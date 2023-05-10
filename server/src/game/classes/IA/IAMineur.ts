import { IA, CAT_STANDARD, CAT_SURE } from "./IA";
import { IMove, Tools } from "@shared/socket";
import {
  IDCOLLAPSE,
  IDMALUSCART,
  IDMALUSTORCH,
  IDMALUSPICK,
  IDBONUSCART,
  IDBONUSPICK,
  IDBONUSTORCH,
  IDREVEAL,
} from "../Deck/Deck";
import { Path } from "../Card/Path";
import { randomInt } from "crypto";
import { Card, TYPECOAL, TYPEGOLD } from "../Card/Card";
import { COORDSORTIEX, COORDSORTIEY } from "../Board/Board";

/**
 * Une classe qui étend {@link IA | `IA`}.
 * Voici les caractéristiques de son comportement :
 * - Son but est de construire un chemin vers les objectifs (l'or en
 * particulier si son emplacement est connu)
 * - Hostile envers les saboteurs
 * - Moyennement solidaire avec les autres mineurs
 */
export class IAMineur extends IA {
  /**
   * Construit un chemin vers :
   * - l'or si sa position est connue
   * - l'objectif le plus proche qui n'est pas un charbon sinon
   * Si c'est possible, alors le coup est ajouté à liste avec un (potentiel 3,
   * catégorie standard).
   */
  construireChemin(): void {
    // TODO: remplacer les coordonnées en paramètre par des constantes
    let cases_dispo: number[][] = this.board.reachableEmptyCells(3, 1);
    let distance_tab: number[] = [];
    let obj: number[][] = this.compute_goal();
    let mv: IMove = {
      cardId: -1,
      playerId: this.playerId,
      coordX: -1,
      coordY: -1,
      target: "Board",
      flip: false,
    };

    // Pour chaque coordonnées on calcule sa distance vers l'objectif le plus
    // proche.
    for (let i = 0; i < cases_dispo.length; i++) {
      let x: number = cases_dispo[i][0];
      let y: number = cases_dispo[i][1];
      let d: number;
      switch (obj.length) {
        case 1:
          d = this.distance([x, y], obj[0]);
          break;
        case 2:
          d = Math.min(
            this.distance([x, y], obj[0]),
            this.distance([x, y], obj[1])
          );
          break;
        case 3:
          d = Math.min(
            this.distance([x, y], obj[0]),
            this.distance([x, y], obj[1]),
            this.distance([x, y], obj[2])
          );
          break;
        default:
          throw new Error("Pas d'objectif");
      }
      distance_tab.push(d);
    }

    this.sortReachable(cases_dispo, distance_tab); // tri selon les distances
    cases_dispo.slice(3); // On prend les 3 cases les plus proches

    // Parmis les chemins, on teste ceux qui peuvent être jouées sur les 3
    // cases les plus proches de l'objectif
    let no_move: boolean = true;
    let i: number = 0;
    while (i < Math.min(3, cases_dispo.length) && no_move) {
      // On l'empêche de jouer sur les colonnes adjacentes à la sortie sinon il
      // fait de la merde (temporaire)
      if (cases_dispo[i][1] < COORDSORTIEY - 1)
        // Parcours des cartes de la main
        for (let k = 0; k < this.cardsInHand.length && no_move; k++) {
          const c = this.cardsInHand[k];

          // Si la carte est un chemin
          if (this.is_path(c.cardType)) {
            let p: Path = c as Path;
            let x = cases_dispo[i][0];
            let y = cases_dispo[i][1];
            // Si ce n'est pas un cul-de-sac
            if (!p.deadEnd) {
              // Si le coup est jouable
              if (this.board.checkPaths(p, x, y)) {
                mv.cardId = c.cardId;
                mv.coordX = x;
                mv.coordY = y;
                // ajouter le coup
                this.coup_pot_l.push({
                  coup: mv,
                  potentiel: 3,
                  categorie: CAT_STANDARD,
                });
                // sortir de la boucle
                no_move = false;
              } else {
                p.flip();
                // Si le coup dans l'autre sens est jouable
                if (this.board.checkPaths(p, x, y)) {
                  p.flip();
                  mv.cardId = c.cardId;
                  mv.coordX = x;
                  mv.coordY = y;
                  mv.flip = true;
                  // ajouter le coup
                  this.coup_pot_l.push({
                    coup: mv,
                    potentiel: 3,
                    categorie: CAT_STANDARD,
                  });
                  // sortir de la boucle
                  no_move = false;
                }
              }
            }
          }
        }
      i++;
    }
  }

  /**
   * Détruit un chemin gênant s'il y en a un (potentiel 2, catégorie standard).
   */
  saboterChemin(): void {
    let len: number = IA.lst_cds.length;
    // S'il y a des culs-de-sac, on prend le dernier posé.
    if (len > 0) {
      const mv: IMove = {
        cardId: this.cardIdInHand(IDCOLLAPSE),
        playerId: this.playerId,
        coordX: IA.lst_cds[len - 1][0],
        coordY: IA.lst_cds[len - 1][1],
        target: "Board",
      };
      this.coup_pot_l.push({
        coup: mv,
        potentiel: 2,
        categorie: CAT_STANDARD,
      });
    }
  }

  /**
   * Sabote l'équipement du saboteur qui a le plus d'outils en bon état
   * (potentiel 2, catégorie standard).
   */
  saboterJoueur(): void {
    let mcart, mpick, mtorch: boolean;
    mcart = this.has(IDMALUSCART);
    mpick = this.has(IDMALUSPICK);
    mtorch = this.has(IDMALUSTORCH);

    if (mcart || mpick || mtorch) {
      let target_id: number = -1;
      let less_broken_tools: number = 4;
      let cardId: number = -1;
      let target_tool: Tools = { cart: false, pickaxe: false, lantern: false };

      // Parcours des saboteurs
      for (let i = 0; i < IA.saboteurHint.length; i++) {
        const id = IA.saboteurHint[i];
        let compte = 0;

        if (this.players[id].cart) compte++;
        if (this.players[id].pickaxe) compte++;
        if (this.players[id].torch) compte++;

        // l'actuel joueur avec le plus d'outils en bon état.
        if (compte < less_broken_tools) {
          target_id = id; // le joueur devient la cible.
          less_broken_tools = compte; // actualisation du min
          target_tool = { cart: false, pickaxe: false, lantern: false };
          // choix de l'outil à casser.
          if (mcart && this.players[id].cart) {
            cardId = this.cardIdInHand(IDMALUSCART);
            target_tool.cart = true;
          } else if (mpick && this.players[id].pickaxe) {
            cardId = this.cardIdInHand(IDMALUSPICK);
            target_tool.pickaxe = true;
          } else if (mtorch && this.players[id].torch) {
            cardId = this.cardIdInHand(IDMALUSTORCH);
            target_tool.lantern = true;
          }
        }
      }

      if (target_id != -1 && cardId != -1) {
        const mv: IMove = {
          cardId: cardId,
          playerId: this.playerId,
          target: "Player",
          targetPlayerId: target_id,
          targetTool: target_tool,
        };
        this.coup_pot_l.push({
          coup: mv,
          potentiel: less_broken_tools == 3 ? 2 : 1,
          categorie: CAT_STANDARD,
        });
      }
    }
  }

  /**
   * Si l'IA ne connait pas la position de l'or, alors on construit le coup
   * _reveal_ sur l'un des objectifs inconnus (catégorie sûre).
   */
  reveler(): void {
    if (!this.or_found()) {
      let x: number = COORDSORTIEX;
      let y: number = COORDSORTIEY;
      if (this.cardsRevealed.length == 1) {
        // On révèle une carte non révélée
        switch (this.cardsRevealed[0].coordX) {
          case COORDSORTIEX:
            x = COORDSORTIEX + 2;
            break;
          case COORDSORTIEX + 2:
            x = COORDSORTIEX;
            break;
          default:
            x = COORDSORTIEX;
            break;
        }
      }
      const mv: IMove = {
        cardId: this.cardIdInHand(IDREVEAL),
        playerId: this.playerId,
        coordX: x,
        coordY: y,
        target: "Board",
      };
      this.coup_pot_l.push({
        coup: mv,
        potentiel: 2,
        categorie: CAT_SURE,
      });
    }
  }

  public piocher(): void {
    // On cherche la carte la moins intéressante
    let idCarteDefausse: number = -1;
    let bad_cards: number[] = [];
    // Toutes les cartes sont ajoutées
    this.cardsInHand.forEach((c) => {
      bad_cards.push(c.cardId);
    });
    // On retire celles qui sont dans un coup potentiel
    this.coup_pot_l.forEach((cp) => {
      let cardId = cp.coup.cardId as number;
      let index: number = bad_cards.indexOf(cardId);
      if (index != -1) {
        bad_cards.splice(index, 1);
      }
    });
    let paire: number = this.has_double();
    // Si il y a une carte en double on la défausse
    if (paire > -1) {
      idCarteDefausse = paire;
    } else {
      if (bad_cards.length > 1) {
        // Plusieurs cartes injouables
        for (let i = 0; i < bad_cards.length; i++) {
          const id = bad_cards[i];
          // Si la carte reveal n'est pas jouable, elle ne le sera plus jamais
          // donc on la défausse
          if (id == IDREVEAL) {
            idCarteDefausse = id;
            break;
          }
        }
        // Si l'on a rien trouvé on défausse au hasard
        if (idCarteDefausse < 0) {
          let index: number = randomInt(bad_cards.length);
          idCarteDefausse = bad_cards[index];
        }
      } else if (bad_cards.length == 1) {
        // Une seule carte injouable
        idCarteDefausse = bad_cards[0];
      } else if (bad_cards.length == 0) {
        // Toutes les cartes sont jouables
        // S'il y a un cul de sac on le défausse
        for (let i = 0; i < this.cardsInHand.length; i++) {
          const c: Card = this.cardsInHand[i];
          if (this.is_path(c.cardType)) {
            let p: Path = c as Path;
            if (p.deadEnd) {
              idCarteDefausse = i;
              break;
            }
          }
        }
        // Si pas de cds, on défausse la carte de catégorie standard de plus
        // faible potentiel
        if (idCarteDefausse < 0) {
          let min_pot: number = 3;
          this.coup_pot_l.forEach((cp) => {
            const pot: number = cp.potentiel;
            const id: number = cp.coup.cardId as number;
            if (cp.categorie == CAT_STANDARD && min_pot > pot) {
              min_pot = pot;
              idCarteDefausse = id;
            }
          });
        }
        // Si toujours rien, on en défausse une au hasard
        if (idCarteDefausse < 0) {
          let index: number = randomInt(this.cardsInHand.length);
          idCarteDefausse = this.cardsInHand[index].cardId;
        }
      }
    }

    const mv: IMove = {
      cardId: idCarteDefausse,
      playerId: this.playerId,
      target: "Discard",
    };
    this.coup_pot_l.push({
      coup: mv,
      potentiel: 1,
      categorie: CAT_STANDARD,
    });
  }

  evaluer(): void {
    // réinitialisation
    this.coup_pot_l = [];

    // évaluation des possibilités
    if (this.has_path() && this.checkAllTools())
      try {
        this.construireChemin();
      } catch (err) {
        console.log("erreur dans compute_obj");
      }

    if (this.has(IDCOLLAPSE)) this.saboterChemin();
    this.saboterJoueur(); // Vérif des cartes dans la fct
    this.reparerJoueur(); // Vérif des cartes dans la fct
    if (this.has(IDREVEAL) && !this.or_found()) this.reveler();
    if (this.cardsInHand.length > 0) this.piocher();
  }

  /**
   * Détermine les coordonnées des objectifs les plus pertinents.
   * Si la position de l'or est connue on renvoie ses coordonnées, sinon on
   * renvoie toutes les coordonnées qui ne sont pas des charbons.
   */
  private compute_goal(): number[][] {
    let coord: number[][] = [];
    if (this.or_found()) {
      this.cardsRevealed.forEach((c) => {
        if (c.cardType != TYPECOAL) coord.push([c.coordX, c.coordY]);
      });
    } else {
      for (let i = -2; i < 3; i += 2) {
        const x: number = COORDSORTIEX + i;
        const y: number = COORDSORTIEY;
        if (this.board.tab[x][y].cardType != TYPECOAL) coord.push([x, y]);
      }
    }
    return coord;
  }
}
