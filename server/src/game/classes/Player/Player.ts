import { ICardReveal, IPLayersRevealed, Tools } from "@shared/socket";
import { Board } from "../Board/Board";
import { Bonus } from "../Card/Bonus";
import { Card, TYPECOAL, TYPEGOLD } from "../Card/Card";

export type powerTargetType =
  | "Player"
  | "Board"
  | "Tools"
  | "Deck"
  | "Hand"
  | "Card"
  | null;

export class Player {
  public playerId: number;
  public handSize: number; //Nombre de cartes dans la main du joueur
  public goldAmount: number; //Nombre de pépites du joueur
  public pickaxe: boolean; //true si équipement en bon état, false sinon
  public cart: boolean;
  public torch: boolean;
  public saboteur: boolean; //true si le joueur est saboteur, false sinon
  public cardsInHand: Card[] = []; //Liste des cartes du joueur
  public cardsRevealed: ICardReveal[] = [];
  public powerTarget: powerTargetType = null;
  public powerLeft: number = 0;
  public playersRevealed: IPLayersRevealed[] = [];

  public constructor(playerId: number) {
    this.goldAmount = 0;
    this.playerId = playerId;
    this.saboteur = false; //true i saboteur false sinon
    this.handSize = 0; // a modif a chaque pioche dans le deck et a chaque carte jouée
    this.pickaxe = true; //init a true car commence avec les outils non cassées/ sans penalty
    this.cart = true;
    this.torch = true;
    this.cardsInHand = [];
  }
  //Pioche une carte (effet côté joueur)
  public drawSubPlayer(card: Card): void {
    this.cardsInHand.push(card); //La carte est ajouté à sa main
    this.handSize++; //La taille de sa main augmente
  }
  //Défausse une carte cardDiscard
  public discardSubPlayer(cardDiscard: Card): void {
    let index = this.cardsInHand.indexOf(cardDiscard); //Index de la carte à défausser
    this.cardsInHand.splice(index, 1); //Retire 1 élément à index
    this.handSize--; //Diminue la taille de la main du joueur
  }
  //Renvoie true si la carte bonus/malus est utilisable sur le joueur, false sinon
  public checkBonus(
    bonus: Bonus,
    targetTools: Tools = {
      pickaxe: bonus.pickaxe,
      cart: bonus.cart,
      lantern: bonus.torch,
    }
  ): boolean {
    //On aurait pu tester l'égalité des booléens pour raccourcir et optimiser le code
    //mais cela ne fonctionnerai pas pour les cartes à deux bonus
    //Si on vise le chariot
    if (targetTools.cart) {
      //Si le chariot est dans le même état que penalty
      //(penalty = true et cart=true => cart réparé et on veut le casser) et que la carte Bonus concerne le chariot
      if (this.cart == bonus.penalty && bonus.cart) {
        //Alors on peut appliquer le bonus
        return true;
      }
    }
    //Si on vise la pioche
    else if (targetTools.pickaxe) {
      if (this.pickaxe == bonus.penalty && bonus.pickaxe) {
        return true;
      }
    }
    //Si on vise la torche
    else if (targetTools.lantern) {
      if (this.torch == bonus.penalty && bonus.torch) {
        //Alors la carte est utilisable
        return true;
      }
    }
    return false;
  }
  //Applique une carte bonus/malus sur le joueur
  public applyBonus(
    bonus: Bonus,
    targetTools: Tools = {
      pickaxe: bonus.pickaxe,
      cart: bonus.cart,
      lantern: bonus.torch,
    }
  ): void {
    //Si malus, penalty = true donc cart = false (cassé)
    //Si on vise le chariot
    if (targetTools.cart) {
      this.cart = !bonus.penalty;
    }
    //Si on vise la pioche
    else if (targetTools.pickaxe) {
      this.pickaxe = !bonus.penalty;
    }
    //Si on vise la torche
    else if (targetTools.lantern) {
      this.torch = !bonus.penalty;
    }
    /*if (bonus.penalty) {
      //c'est un malus
      if (bonus.torch) {
        //si c'est un malus torche cassée et qu'il a une torche
        this.torch = false;
      }
      if (bonus.cart) {
        this.cart = false;
      }
      if (bonus.pickaxe) {
        this.pickaxe = false;
      }
    } else {
      if (bonus.torch) this.torch = true;
      if (bonus.cart) {
        this.cart = true;
      }
      if (bonus.pickaxe) {
        this.pickaxe = true;
      }
    }*/
  }
  //Révèle une des cartes finales au joueur
  //Note les coordonnées de la carte dans l'attribut cardsRevealed
  public applyReveal(board: Board, coordX: number, coordY: number): void {
    let coords: number[] = [coordX, coordY];
    const coordGold: number[] = [board.coordOrX, board.coordOrY];
    let type = TYPECOAL;
    if (coordGold[0] == coords[0] && coordGold[1] == coords[1]) type = TYPEGOLD;
    const cardRevealed: ICardReveal = {
      cardType: type,
      coordX: coordX,
      coordY: coordY,
    };
    //On rajoute les coordonnées observées dans la liste
    this.cardsRevealed.push(cardRevealed);
  }
  // Description à écrire
  public checkRevealSubPlayer(coordX: number, coordY: number): boolean {
    let coords = [coordX, coordY];
    let exist: boolean = false;
    this.cardsRevealed.forEach((cardsRevealed) => {
      let coordsRevealed = [cardsRevealed.coordX, cardsRevealed.coordY];
      if (coordsRevealed[0] == coordX && coordsRevealed[1] == coordY) {
        exist = true;
      }
    });
    return !exist;
  }
  //Renvoie true si la main du joueur est vide, false sinon
  public emptyHand(): boolean {
    if (this.handSize == 0) {
      return true;
    }
    return false;
  }
  //Renvoie true si une carte d'id cardId appartient au joueur, false sinon
  public checkOwner(cardId: number): boolean {
    let tab: number[] = []; //Tableau des id des cartes du joueur
    this.cardsInHand.forEach(function (carte) {
      tab.push(carte.cardId); //On ajoute les id des chaque carte
    });
    return tab.includes(cardId); //Vérifique si dans le tableau il y a l'id cardId
  }
  public cardRank(cardId: number) {
    let place = -1;
    this.cardsInHand.forEach((card, index) => {
      if (card.cardId === cardId) {
        place = index;
      }
    });
    return place;
  }
  public nextGame() {
    this.cardsInHand.forEach((card) => {
      this.discardSubPlayer(card);
    });
    this.saboteur = false; //1 i saboteur 0 sinon
    this.cardsInHand = [];
    this.handSize = 0; // a modif a chaque pioche dans le deck et a chaque carte jouée
    this.pickaxe = true; //init a true car commence avec les outils non cassées/ sans penalty
    this.cart = true;
    this.torch = true;
    this.cardsRevealed = [];
    this.powerLeft = 0;
    this.powerTarget = null;
    this.playersRevealed = [];
    return this;
  }

  public checkAllTools(): boolean {
    // return True if all tools are up

    return this.cart && this.pickaxe && this.torch;
  }

  public useTrace(playerInspected: Player): void {
    const playerRevealed: IPLayersRevealed = {
      playerdId: playerInspected.playerId,
      saboteur: playerInspected.saboteur,
    };
    this.playersRevealed.push(playerRevealed);
  }
  /*public power() {
    //sert pour overloading
    return true;
  }*/

  public copyPlayer(playerCopied: Player): void {
    this.goldAmount = playerCopied.goldAmount;
    this.handSize = playerCopied.handSize;
    this.pickaxe = playerCopied.pickaxe;
    this.cart = playerCopied.cart;
    this.torch = playerCopied.torch;
    this.cardsInHand = playerCopied.cardsInHand;
    this.cardsRevealed = playerCopied.cardsRevealed;
    this.playersRevealed = playerCopied.playersRevealed;
  }
}
