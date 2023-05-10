import { Bonus } from "../Card/Bonus";
import { Card, IDEMPTY } from "../Card/Card";
import { Collapse } from "../Card/Collapse";
import { Path } from "../Card/Path";
import { Reveal } from "../Card/Reveal";

//cartes chemins du jeu quantitées a ne pas modifier
const SOUTHEASTNORTH = 5;
const SOUTHEAST = 4;
const NORTHEAST = 4;
const NORTHEASTWEST = 5;
const EASTWEST = 3;
const NORTHSOUTH = 4;
const CROSS = 5;
//Cartes actions du jeu
export const BONUSPICK = 2;
const MALUSPICK = 3;
const BONUSCART = 2;
const MALUSCART = 3;
const BONUSTORCH = 2;
const MALUSTORCH = 3;
const COLLAPSE = 3;
const REVEAL = 6;

//et comme les cul de sac sont qu'en un exemplaire a chaque fois on les assigne direct dans la fonction

// Ceux ci sont les ids des cartes en terme de type
// une carte qui a le type 0 sera une cross etc...
export const IDCROSS = 26;
export const IDSOUTHEAST = 1;
export const IDNORTHEAST = 2;
export const IDNORTHEASTWEST = 3;
export const IDEASTWEST = 4;
export const IDNORTHSOUTH = 5;
export const IDSOUTHEASTNORTH = 6;
export const IDBONUSPICK = 7;
export const IDMALUSPICK = 8;
export const IDBONUSCART = 9;
export const IDMALUSCART = 10;
export const IDBONUSTORCH = 11;
export const IDMALUSTORCH = 12;
export const IDCOLLAPSE = 13;
export const IDREVEAL = 14;

export class Deck {
  public tab: Card[] = [];
  public initialized: boolean = false; //permet d'éviter l'initalisation double
  constructor() {
    this.tab = [];
    this.initDeck;
  }
  //Pioche une carte (renvoie la 1re carte et la supprime du deck)
  public drawSubDeck(): Card {
    //On suppose que le deck n'est pas vide (vérifié dans le checkDraw)
    return this.tab.shift()!;
  }
  //Initialise le deck, ajoute au deck le bon nombre de chaque cartes
  public initDeck() {
    if (!this.initialized) {
      let max = 0;

      //init des chemins
      for (let i = 0; i < max + SOUTHEASTNORTH; i++) {
        //de 0 a 4 inclus
        this.tab[i] = new Path(i + 1, false, true, true, true, false);
        this.tab[i].cardType = IDSOUTHEASTNORTH;
      }
      max += SOUTHEASTNORTH;
      for (let i = max; i < max + SOUTHEAST; i++) {
        // de 5 a 8
        this.tab[i] = new Path(i + 1, false, false, true, true, false);
        this.tab[i].cardType = IDSOUTHEAST;
      }
      max += SOUTHEAST;
      for (let i = max; i < max + NORTHEAST; i++) {
        // de 9 a 12
        this.tab[i] = new Path(i + 1, false, true, false, true, false);
        this.tab[i].cardType = IDNORTHEAST;
      }
      max += NORTHEAST;
      for (let i = max; i < max + NORTHEASTWEST; i++) {
        //13 a 17
        this.tab[i] = new Path(i + 1, false, true, false, true, true);
        this.tab[i].cardType = IDNORTHEASTWEST;
      }
      max += NORTHEASTWEST;
      for (let i = max; i < max + EASTWEST; i++) {
        //18 a 20
        this.tab[i] = new Path(i + 1, false, false, false, true, true);
        this.tab[i].cardType = IDEASTWEST;
      }
      max += EASTWEST;
      for (let i = max; i < max + NORTHSOUTH; i++) {
        //21 a 24
        this.tab[i] = new Path(i + 1, false, true, true, false, false);
        this.tab[i].cardType = IDNORTHSOUTH;
      }
      max += NORTHSOUTH;
      for (let i = max; i < max + CROSS; i++) {
        //25 a 29
        this.tab[i] = new Path(i + 1, false, true, true, true, true);
        this.tab[i].cardType = IDCROSS;
      }

      max += CROSS;
      for (let i = max; i < max + BONUSPICK; i++) {
        this.tab[i] = new Bonus(i + 1, false, true, false, false);
        this.tab[i].cardType = IDBONUSPICK;
      }
      //création des bonus
      max += BONUSPICK;
      for (let i = max; i < max + MALUSPICK; i++) {
        this.tab[i] = new Bonus(i + 1, true, true, false, false);
        this.tab[i].cardType = IDMALUSPICK;
      }
      max += MALUSPICK;
      for (let i = max; i < max + BONUSCART; i++) {
        this.tab[i] = new Bonus(i + 1, false, false, true, false);
        this.tab[i].cardType = IDBONUSCART;
      }
      max += BONUSCART;
      for (let i = max; i < max + MALUSCART; i++) {
        this.tab[i] = new Bonus(i + 1, true, false, true, false);
        this.tab[i].cardType = IDMALUSCART;
      }
      max += MALUSCART;
      for (let i = max; i < max + BONUSTORCH; i++) {
        this.tab[i] = new Bonus(i + 1, false, false, false, true);
        this.tab[i].cardType = IDBONUSTORCH;
      }
      max += BONUSTORCH;
      for (let i = max; i < max + MALUSTORCH; i++) {
        this.tab[i] = new Bonus(i + 1, true, false, false, true);

        this.tab[i].cardType = IDMALUSTORCH;
      }
      max += MALUSTORCH;
      for (let i = max; i < max + COLLAPSE; i++) {
        this.tab[i] = new Collapse(i + 1);
        this.tab[i].cardType = IDCOLLAPSE;
      }
      max += COLLAPSE;
      for (let i = max; i < max + REVEAL; i++) {
        this.tab[i] = new Reveal(i + 1);
        this.tab[i].cardType = IDREVEAL;
      }
      max += REVEAL;
      //creation des cul de sac
      //NORTH
      this.tab[max] = new Path(max + 1, true, true, false, false, false);
      this.tab[max].cardType = 15;
      max++;

      //NORTHEAST
      this.tab[max] = new Path(max + 1, true, true, false, true, false);
      this.tab[max].cardType = 16;
      max++;
      //NORTHWEST
      this.tab[max] = new Path(max + 1, true, true, false, false, true);
      this.tab[max].cardType = 17;
      max++;
      //NORTHEASTWEST
      this.tab[max] = new Path(max + 1, true, true, false, true, true);
      this.tab[max].cardType = 18;
      max++;
      //EASTWEST
      this.tab[max] = new Path(max + 1, true, false, false, true, true);
      this.tab[max].cardType = 21;
      max++;
      //CROSS
      this.tab[max] = new Path(max + 1, true, true, true, true, true);
      this.tab[max].cardType = 22;
      max++;
      //NORTHSOUTHEAST
      this.tab[max] = new Path(max + 1, true, true, true, true, false);
      this.tab[max].cardType = 23;
      max++;
      //NORTHSOUTH
      this.tab[max] = new Path(max + 1, true, true, true, false, false);
      this.tab[max].cardType = 24;
      max++;
      //EAST
      this.tab[max] = new Path(max + 1, true, false, false, true, false);
      this.tab[max].cardType = 25;
      max++;
    }

    this.initialized = true;
  }
  //Mélange un deck déja initalisé
  public shuffle() {
    //De i allant du nombre de carte à 0
    for (let i = this.tab.length - 1; i > 0; i--) {
      //j valeur aléatoire entre 0 et i
      let j = Math.floor(Math.random() * (i + 1));
      //On garde en mémoire la carte dans le deck à l'emplacement i
      let temp = this.tab[i];
      //On la remplace par la carte d'emplacement j
      this.tab[i] = this.tab[j];
      //On remet la carte en mémoire à l'emplacement j
      this.tab[j] = temp;
    }
  }
  //Renvoie true si deck vide, false sinon
  public emptyDeck(): boolean {
    return this.tab.length == 0;
  }

  public deckShiftEnd(): void {
    //mets le debut du deck a la fin
    let temp = this.tab.shift() as Card;
    this.tab.push(temp);
  }

  public shiftToType(cardType: number) {
    while (this.tab[0].cardType != cardType) {
      //on remets a l'arriere du deck toutes les cartes qui n'ont pas le type recherché
      this.deckShiftEnd();
    }
  }

  public distanceSameObj(obj: Card): number {
    //retourne la distance entre deux objets de meme type, si type differents, 0
    let distance = 0;
    this.tab.forEach((element) => {
      if (obj.cardType == element.cardType) {
        let distEl = Math.abs(
          this.tab.indexOf(obj) - this.tab.indexOf(element)
        );
        if (distance < distEl) {
          distance = distEl;
        }
      }
    });
    return distance;
  }

  public distanceTousObj(): number {
    let sum = 0;
    this.tab.forEach((element) => {
      sum += this.distanceSameObj(element);
    });
    return sum;
  }

  public deckBalance(): Card[] {
    const n = this.tab.length;
    let sorted = false;
    while (!sorted) {
      sorted = true;
      for (let i = 0; i < n - 1; i++) {
        let deck2 = new Deck();
        deck2.tab = this.tab;
        const temp = deck2.tab[i];
        deck2.tab[i] = deck2.tab[i + 1];
        deck2.tab[i + 1] = temp;

        const dist1 = deck2.distanceSameObj(deck2.tab[i]);
        const dist2 = deck2.distanceSameObj(deck2.tab[i + 1]);

        if (dist1 > dist2) {
          this.tab = deck2.tab;
          sorted = false;
        }
      }
    }
    return this.tab;
  }
}
