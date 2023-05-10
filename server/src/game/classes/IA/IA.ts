import { IMove, Tools } from "@shared/socket";
import { Player } from "../Player/Player";
import { Board } from "../Board/Board";
import { Card, TYPEGOLD, IDEMPTY, IDFINISH } from "../Card/Card";
import { Path } from "../Card/Path";
import { randomInt } from "crypto";
import {
  IDBONUSCART,
  IDBONUSPICK,
  IDBONUSTORCH,
  IDCOLLAPSE,
  IDMALUSCART,
  IDMALUSPICK,
  IDMALUSTORCH,
  IDREVEAL,
} from "../Deck/Deck";

export const CAT_STANDARD: number = 0;
export const CAT_SURE: number = 1;

export interface ICoupPotentiel {
  /** Le coup */
  coup: IMove;
  /** Son potentiel (entre 1 et 3) */
  potentiel: number;
  /**
   * Sa catégorie (sûre si le coup doit être absolument joué, standard sinon)
   */
  categorie: number;
}

/**
 * Représentation des coordonnées d'une case et de sa distance à l'objectif
 * le plus proche
 */
interface IComb {
  coord: number[];
  d: number;
}

/**
 * Une classe abstraite qui sert de modèle pour les IA. Elle fournit des
 * prototypes de méthodes qui évaluent tous les coups possibles pour au final
 * jouer le coup de plus intéressant.
 */
export abstract class IA extends Player {
  static saboteurHint: number[] = [];
  static lst_cds: number[][] = [];
  protected coup_pot_l: ICoupPotentiel[];
  protected board: Board;
  protected players: Player[];

  /**
   * Met à jour la liste des culs-de-sac et des saboteurs.
   */
  static deviner(m: IMove, b: Board): void {
    if (m.target == "Board" && m.coordX != -1 && m.coordY != -1) {
      // Le joueur a posé une carte sur le plateau
      let x: number = m.coordX as number;
      let y: number = m.coordY as number;
      let cardPlayed: Card = b.tab[x][y];

      if (cardPlayed.cardId != IDEMPTY && cardPlayed.cardId != IDFINISH) {
        // La carte jouée n'est ni un collapse ni un reveal
        let path: Path = cardPlayed as Path;
        if (path.deadEnd) {
          IA.lst_cds.push([x, y]);
          if (!IA.saboteurHint.includes(m.playerId))
            IA.saboteurHint.push(m.playerId);
        }
      } else if (cardPlayed.cardId == IDEMPTY) {
        // La carte jouée est un collapse, on met à jour la liste des cds
        const len: number = IA.lst_cds.length;
        let index: number = 0;
        while (index < len) {
          if (IA.lst_cds[index][0] == x && IA.lst_cds[index][1] == y) {
            break;
          }
          index++;
        }
        if (len > 0 && index != len) {
          IA.lst_cds.splice(index, 1);
        }
      }
    }
  }

  /** Réinitialise la liste des cds et des saboteurs. */
  static reset(): void {
    IA.saboteurHint = [];
    IA.lst_cds = [];
  }

  constructor(playerID: number, board: Board) {
    super(playerID);
    this.coup_pot_l = [];
    this.board = board;
    this.players = [];
  }

  private init_from_player(p: Player) {
    this.playerId = p.playerId;
    this.handSize = p.handSize;
    this.goldAmount = p.goldAmount;
    this.pickaxe = p.pickaxe;
    this.cart = p.cart;
    this.torch = p.torch;
    this.saboteur = p.saboteur;
    this.cardsInHand = p.cardsInHand;
    this.cardsRevealed = p.cardsRevealed;
  }

  abstract construireChemin(): void;
  abstract saboterChemin(): void;
  abstract saboterJoueur(): void;

  /**
   * Si l'IA a un objet cassé elle le répare (coup de catégorie sûre). Sinon
   * si l'un de ses coéquipiers a un objet cassé elle le répare (potentiel 1,
   * catégorie standard).
   */
  reparerJoueur(): void {
    let cardId: number = -1;
    let target_tool: Tools = { cart: false, pickaxe: false, lantern: false };
    if (this.has(IDBONUSPICK) && !this.pickaxe) {
      cardId = this.cardIdInHand(IDBONUSPICK);
      target_tool.pickaxe = true;
    } else if (this.has(IDBONUSCART) && !this.cart) {
      cardId = this.cardIdInHand(IDBONUSCART);
      target_tool.cart = true;
    } else if (this.has(IDBONUSTORCH) && !this.torch) {
      cardId = this.cardIdInHand(IDBONUSTORCH);
      target_tool.lantern = true;
    }

    if (cardId != -1) {
      const mv: IMove = {
        cardId: cardId,
        playerId: this.playerId,
        target: "Player",
        targetPlayerId: this.playerId,
        targetTool: target_tool,
      };
      this.coup_pot_l.push({
        coup: mv,
        potentiel: 2,
        categorie: CAT_SURE,
      });
    }
  }

  /**
   * Détermine la carte la moins intéressante de sa main, pour éventuellement
   * la défausser (potentiel à 1 et catégorie standard).
   */
  abstract piocher(): void;

  /**
   * Initialise la liste des coups potentiels à partir de tous les coups
   * possibles.
   */
  abstract evaluer(): void;

  /**
   * Parcours la liste des coups possibles et en choisi un de façon aléatoire
   * en tenant compte des catégories et des potentiels.
   * @returns Le coup issu du coup potentiel choisi.
   */
  public jouer(board: Board, players: Player[]): IMove | null {
    let mv: IMove;

    // mise à jour du jeu
    this.board = board;
    this.players = players;
    this.init_from_player(players[this.playerId]);

    // mise à jour des coups potentiels
    this.evaluer();

    if (this.coup_pot_l.length > 0) {
      // Liste des coups sûrs
      let cp_surs: IMove[] = [];
      this.coup_pot_l.forEach((cp) => {
        if (cp.categorie == CAT_SURE) cp_surs.push(cp.coup);
      });

      if (cp_surs.length > 0) {
        mv = cp_surs[randomInt(cp_surs.length)];
      } else {
        // S'il n'y a pas de coups sûrs, on fait la somme cumulée des probas de
        // chaque coup et on prend un x au hasard sur [0, max(cumsum)]. Par
        // recherche dichotomique on trouve à quel coup cela correspond.
        let cumsum: number[] = [];
        cumsum.push(this.coup_pot_l[0].potentiel);
        for (let i = 1; i < this.coup_pot_l.length; i++) {
          const cp: ICoupPotentiel = this.coup_pot_l[i];
          cumsum.push(cp.potentiel + cumsum[i - 1]);
        }
        const x: number = randomInt(0, cumsum[cumsum.length - 1]);
        const index: number = this.rech_dicho(x, cumsum);
        mv = this.coup_pot_l[index].coup;
      }
      //this.summary(mv);
      return mv;
    } else return null;
  }

  /*************************************\ 
  |* TESTS SUR LES CARTES ET LES MAINS *|
  \*************************************/

  /** Vérifie que le joueur à la carte en main. */
  protected has(cardType: number): boolean {
    let in_hand: boolean = false;
    this.cardsInHand.forEach((c) => {
      if (c.cardType == cardType) in_hand = true;
    });
    return in_hand;
  }

  /** Vérifie si le joueur connait la position de l'or. */
  protected or_found(): boolean {
    let or_connu: boolean = false;
    this.cardsRevealed.forEach((c) => {
      if (c.cardType == TYPEGOLD) or_connu = true;
    });
    return or_connu || this.cardsRevealed.length == 2;
  }

  /** Retourne l'id de la carte de type demandé en main */
  protected cardIdInHand(cardType: number) {
    let r = -1;
    for (let i = 0; i < this.cardsInHand.length; i++) {
      const c = this.cardsInHand[i];
      if (cardType == c.cardType) r = c.cardId;
    }
    return r;
  }

  /** Vérifie si la carte dans la main est un chemin */
  protected is_path(cardType: number): boolean {
    return (
      cardType != IDREVEAL &&
      cardType != IDCOLLAPSE &&
      cardType != IDBONUSCART &&
      cardType != IDBONUSPICK &&
      cardType != IDBONUSTORCH &&
      cardType != IDMALUSCART &&
      cardType != IDMALUSPICK &&
      cardType != IDMALUSTORCH
    );
  }

  /** Vérifie si le joueur possède une carte chemin */
  protected has_path(): boolean {
    let is_p: boolean = false;
    this.cardsInHand.forEach((c) => {
      if (this.is_path(c.cardType)) is_p = true;
    });
    return is_p;
  }

  /** Trouve un doublon dans la main du joueur */
  protected has_double(): number {
    let len: number = this.cardsInHand.length;
    for (let i = 0; i < len - 1; i++) {
      const c1: number = this.cardsInHand[i].cardId;
      for (let j = i + 1; j < len; j++) {
        const c2: number = this.cardsInHand[j].cardId;
        if (c1 == c2) return c1;
      }
    }
    return -1;
  }

  /********************\ 
  |* FONCTIONS DE TRI *|
  \********************/

  /**
   * Calcul de la distance entre deux points.
   * @param a Le point a
   * @param b Le point b
   * @returns La distance euclidienne entre a et b
   */
  protected distance(a: number[], b: number[]): number {
    let somme_carree: number = 0;
    for (let i = 0; i < a.length; i++) {
      const xi: number = a[i];
      const yi: number = b[i];
      somme_carree += (xi - yi) ** 2;
    }
    return Math.sqrt(somme_carree);
  }

  /**
   * Trie les cases accessibles de la plus proche d'un objectif à la plus loin.
   * Les paramètres doivent être de la même taille.
   * @param reachable Tableau des coordonnées des cases accessibles
   * @param dist Tableau des distances à l'objectif
   */
  protected sortReachable(reachable: number[][], dist: number[]): void {
    // Combinaison des deux tableaux
    let combinaison: IComb[] = [];
    for (let i = 0; i < reachable.length; i++) {
      const coord = reachable[i];
      const d = dist[i];
      combinaison.push({ coord: coord, d: d });
    }

    // Tri selon la distance
    combinaison = this.tri_rapide(combinaison, 0, combinaison.length - 1);

    // Reconstruction du tableau de coordonnées
    for (let i = 0; i < reachable.length; i++) {
      reachable[i] = combinaison[i].coord;
    }
  }

  /** Echange deux éléments d'un tableau de combinaisons */
  private echanger(tab: IComb[], i: number, j: number): void {
    const tmp: IComb = tab[j];
    tab[j] = tab[i];
    tab[i] = tmp;
  }

  /** Partitionne le tableau entre inférieur et supérieur au pivot */
  private partition(tab: IComb[], left: number, right: number): number {
    const pivot: number = tab[Math.floor((right + left) / 2)].d;
    let i: number = left;
    let j: number = right;

    while (i <= j) {
      while (tab[i].d < pivot) {
        i++;
      }
      while (tab[j].d > pivot) {
        j--;
      }
      if (i <= j) {
        this.echanger(tab, i, j); //sawpping two elements
        i++;
        j--;
      }
    }
    return i;
  }

  /** Tri un tableau de combinaisons suivant l'algorithme du quicksort */
  private tri_rapide(tab: IComb[], left: number, right: number): IComb[] {
    let index: number;
    if (tab.length > 1) {
      index = this.partition(tab, left, right); //index returned from partition
      if (left < index - 1) {
        //more elements on the left side of the pivot
        this.tri_rapide(tab, left, index - 1);
      }
      if (index < right) {
        //more elements on the right side of the pivot
        this.tri_rapide(tab, index, right);
      }
    }
    return tab;
  }

  /** Recherche la position d'un élément dans un tableau trié */
  private rech_dicho(x: number, tab: number[]): number {
    if (tab.length == 1) return 0;
    let m: number = Math.floor(tab.length / 2);
    if (tab[m] == x) {
      return m;
    } else if (tab[m] > x) {
      return this.rech_dicho(x, tab.slice(m));
    } else {
      return this.rech_dicho(x, tab.slice(m, tab.length));
    }
  }

  /*************************\ 
  |* FONCTIONS D'AFFICHAGE *|
  \*************************/

  private affCoupPot(): void {
    if (this.coup_pot_l.length > 0)
      this.coup_pot_l.forEach((cp) => {
        const cat: string = cp.categorie == CAT_SURE ? "sure" : "std";
        console.log(
          "{" +
            this.coupToString(cp.coup) +
            ";" +
            cp.potentiel +
            ";" +
            cat +
            "}"
        );
      });
  }

  private mainToString(): string {
    let res: string = "{";
    for (let i = 0; i < this.cardsInHand.length - 1; i++) {
      const c: number = this.cardsInHand[i].cardType;
      res += this.cardToString(c) + ", ";
    }
    return (
      res +
      this.cardToString(
        this.cardsInHand[this.cardsInHand.length - 1].cardType
      ) +
      "}"
    );
  }

  private cardToString(id: number): string {
    switch (id) {
      case IDREVEAL:
        return "reveal";
      case IDCOLLAPSE:
        return "collapse";
      case IDMALUSCART:
        return "malus-cart";
      case IDMALUSPICK:
        return "malus-pick";
      case IDMALUSTORCH:
        return "malus-torch";
      case IDBONUSCART:
        return "bonus-cart";
      case IDBONUSPICK:
        return "bonus-pick";
      case IDBONUSTORCH:
        return "bonus-torch";
      default:
        return "chemin";
    }
  }

  private coupToString(mv: IMove): string {
    let type = -1;
    this.cardsInHand.forEach((c) => {
      if (c.cardId == mv.cardId) type = c.cardType;
    });
    if (mv.target == "Discard") return "(draw," + this.cardToString(type) + ")";
    else
      return (
        "(" +
        this.cardToString(type) +
        "," +
        mv.target +
        "," +
        mv.coordX +
        "," +
        mv.coordY +
        ")"
      );
  }

  public summary(mv: IMove): void {
    console.log("J" + this.playerId + " (IA)");
    console.log(this.saboteur ? "saboteur" : "mineur");
    console.log("Main : " + this.mainToString());
    console.log(this.or_found() ? "Or trouvé" : "Or inconnu");
    console.log(this.checkAllTools() ? "Outils OK" : "Outils KO");
    console.log("Coups potentiels :");
    this.affCoupPot();
    console.log(this.coupToString(mv));
  }
}
