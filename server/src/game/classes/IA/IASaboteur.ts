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
} from "../Deck/Deck";
import { Card, IDEMPTY } from "../Card/Card";
import { Path } from "../Card/Path";
import { randomInt } from "crypto";
import { COORDSORTIEX, COORDSORTIEY } from "../Board/Board";

/**
 * Une classe qui étend {@link IA | `IA`}.
 * Voici les caractéristiques de son comportement :
 * - Son but est d'empêcher la construction des chemins vers les objectifs
 * - Solidaire avec les saboteurs
 * - Hostile envers les autres mineurs
 */
export class IASaboteur extends IA {
  /**
   * Construit un cul de sac ou un chemin éloignant de l'objectif (potentiel 2,
   * catégorie standard).
   */
  construireChemin(): void {
    let cards: Card[] = this.cds_in_hand();
    let cases_dispo: number[][] = this.board.reachableEmptyCells(3, 1);
    let distance_tab: number[] = [];
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
      let d: number = Math.min(
        this.distance([x, y], [COORDSORTIEX, COORDSORTIEY]),
        this.distance([x, y], [COORDSORTIEX + 2, COORDSORTIEY]),
        this.distance([x, y], [COORDSORTIEX - 2, COORDSORTIEY])
      );
      distance_tab.push(d);
    }

    this.sortReachable(cases_dispo, distance_tab); // tri selon les distances
    cases_dispo.slice(3); // On prend les 3 cases les plus proches

    // Parmis les chemins, on teste ceux qui peuvent être jouées sur les 3
    // cases les plus proches de l'objectif
    let no_move: boolean = true;
    let i: number = 0;
    while (i < Math.min(3, cases_dispo.length) && no_move) {
      // Parcours des cartes de la main
      for (let k = 0; k < cards.length && no_move; k++) {
        const c = cards[k];

        let p: Path = c as Path;
        let x = cases_dispo[i][0];
        let y = cases_dispo[i][1];
        // Si le coup est jouable
        if (this.board.checkPaths(p, x, y)) {
          mv.cardId = c.cardId;
          mv.coordX = x;
          mv.coordY = y;
          // ajouter le coup
          this.coup_pot_l.push({
            coup: mv,
            potentiel: 2,
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
              potentiel: 2,
              categorie: CAT_STANDARD,
            });
            // sortir de la boucle
            no_move = false;
          }
        }
      }
      i++;
    }
  }

  /**
   * Détruit un chemin adjacent à l'échelle (potentiel 2, catégorie standard).
   */
  saboterChemin(): void {
    let targ_x: number = -1;
    let targ_y: number = -1;

    let idCarteHaute: number = this.board.tab[2][1].cardId;
    let idCarteBasse: number = this.board.tab[4][1].cardId;
    let idCarteGauche: number = this.board.tab[3][0].cardId;
    let idCarteDroite: number = this.board.tab[3][2].cardId;

    if (idCarteDroite != IDEMPTY) {
      targ_x = 3;
      targ_y = 2;
    } else if (idCarteHaute != IDEMPTY) {
      targ_x = 2;
      targ_y = 1;
    } else if (idCarteBasse != IDEMPTY) {
      targ_x = 4;
      targ_y = 1;
    } else if (idCarteGauche != IDEMPTY) {
      targ_x = 3;
      targ_y = 0;
    }

    if (targ_x != -1 && targ_y != -1) {
      const mv: IMove = {
        cardId: this.cardIdInHand(IDCOLLAPSE),
        playerId: this.playerId,
        coordX: targ_x,
        coordY: targ_y,
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
   * Sabote l'équipement du mineur qui a le plus d'outils en bon état
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

      // Parcours des joueurs
      for (let i = 0; i < this.players.length; i++) {
        let compte = 0;

        // Si le joueur n'est pas suspecté d'être saboteur
        if (!IA.saboteurHint.includes(i) && i != this.playerId) {
          if (this.players[i].cart) compte++;
          if (this.players[i].pickaxe) compte++;
          if (this.players[i].torch) compte++;

          // l'actuel joueur avec le plus d'outils en bon état.
          if (compte < less_broken_tools) {
            target_id = i; // le joueur devient la cible.
            less_broken_tools = compte; // actualisation du min
            target_tool = { cart: false, pickaxe: false, lantern: false };
            // choix de l'outil à casser.
            if (mcart && this.players[i].cart) {
              cardId = this.cardIdInHand(IDMALUSCART);
              target_tool.cart = true;
            } else if (mpick && this.players[i].pickaxe) {
              cardId = this.cardIdInHand(IDMALUSPICK);
              target_tool.pickaxe = true;
            } else if (mtorch && this.players[i].torch) {
              cardId = this.cardIdInHand(IDMALUSTORCH);
              target_tool.lantern = true;
            }
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
      let cardId: number = cp.coup.cardId as number;
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
        // On défausse au hasard
        if (idCarteDefausse < 0) {
          let index: number = randomInt(bad_cards.length);
          idCarteDefausse = bad_cards[index];
        }
      } else if (bad_cards.length == 1) {
        // Une seule carte injouable
        idCarteDefausse = bad_cards[0];
      } else if (bad_cards.length == 0) {
        // On défausse la carte de catégorie standard de plus faible potentiel

        let min_pot: number = 3;
        this.coup_pot_l.forEach((cp) => {
          const pot: number = cp.potentiel;
          const id: number = cp.coup.cardId as number;
          if (cp.categorie == CAT_STANDARD && min_pot > pot) {
            min_pot = pot;
            idCarteDefausse = id;
          }
        });

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

  // Pour plus tard
  //feinter(): void {}

  evaluer(): void {
    // réinitialisation
    this.coup_pot_l = [];

    // évaluation des possibilités
    if (this.cds_in_hand().length > 0 && this.checkAllTools())
      this.construireChemin();
    if (this.has(IDCOLLAPSE)) this.saboterChemin();
    this.saboterJoueur(); // Vérif des cartes dans la fct
    this.reparerJoueur(); // Vérif des cartes dans la fct
    if (this.cardsInHand.length > 0) this.piocher();
  }

  /** Renvoie la liste des cul-de-sac dans la main. */
  private cds_in_hand(): Card[] {
    let ret: Card[] = [];
    this.cardsInHand.forEach((c) => {
      if (this.is_path(c.cardType)) {
        const p: Path = c as Path;
        if (p.deadEnd) ret.push(c);
      }
    });
    return ret;
  }
}
