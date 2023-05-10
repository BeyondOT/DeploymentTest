import { Bonus } from "../Card/Bonus";
import { Card } from "../Card/Card";
import { Collapse } from "../Card/Collapse";
import { Path } from "../Card/Path";
import { Reveal } from "../Card/Reveal";
import { Deck } from "./Deck";
describe("Init Deck", () => {
  test("It should create a Deck object", () => {
    const deck = new Deck();
    deck.tab[1] = new Card(4);
    expect(deck.tab[1].cardId).toBe(4); //on vérifie que la carte a bien été stockée avec son id
  });
});
describe("Function drawSubDeck", () => {
  test("It should remove and return the first card when drawing", () => {
    //On vérifie qu'on pioche bien la première carte du deck
    const deck = new Deck();
    const cardDrawn = new Card(3);
    const nextCard = new Card(4);
    deck.tab[0] = cardDrawn;
    deck.tab[1] = nextCard;
    //Vérifie que la carte tirée est bien la première
    expect(deck.drawSubDeck()).toBe(cardDrawn);
    //Vérifie que la nouvelle première carte du deck est la carte qui suivait la carte tirée
    expect(deck.tab[0]).toBe(nextCard);
  });
});
describe("Function initDeck", () => {
  test("It should create a cards in order of their id", () => {
    //On vérifie que le deck est bien initialisé
    const deck = new Deck();
    deck.initDeck();
    for (let i = 0; i < deck.tab.length; i++) {
      //on vérifie que les id des cartes sont dans l'ordre
      expect(deck.tab[i].cardId).toBe(i + 1);
      expect(deck.tab[i]).toBeInstanceOf(Card);
      if (i < 30) {
        //on a 30 cartes chemin sans cul de sac
        expect(deck.tab[i]).toBeInstanceOf(Path); //on vérifie que leurs types sont bien ceux déclarés
        let pathi = deck.tab[i] as Path;
        expect(pathi.deadEnd).toBe(false);
      }
      if (i >= 30 && i < 45) {
        //on a15 bonus

        expect(deck.tab[i]).toBeInstanceOf(Bonus);
      }
      if (i >= 45 && i < 48) {
        //on a 3 eboulements

        expect(deck.tab[i]).toBeInstanceOf(Collapse);
      }
      if (i >= 48 && i < 54) {
        //on a 6 reveal

        expect(deck.tab[i]).toBeInstanceOf(Reveal);
      }
      if (i >= deck.tab.length - 9) {
        expect(deck.tab[i]).toBeInstanceOf(Path);
        let pathi = deck.tab[i] as Path;
        expect(pathi.deadEnd).toBe(true);
      }
    }
  });
  test("It should always create the same deck ", () => {
    let deck1 = new Deck();
    let deck2 = new Deck();
    expect(deck1.tab).toMatchObject(deck2.tab);
    deck1.initDeck();
    deck2.initDeck();
    expect(deck1.tab).toMatchObject(deck2.tab);
  });
});
describe("Function emptyDeck", () => {
  test("It should detect that the deck is empty", () => {
    const deck: Deck = new Deck();
    expect(deck.emptyDeck()).toBe(true);
  });
  test("It should detect that the deck is not empty", () => {
    const deck: Deck = new Deck();
    //On ajoute une carte
    deck.tab.push(new Card(1));
    expect(deck.emptyDeck()).toBe(false);
  });
});

describe("Function deckShiftEnd", () => {
  test("It should shift first element to last ", () => {
    const deck: Deck = new Deck();
    deck.initDeck();
    let premier: Card = deck.tab[0];
    let second: Card = deck.tab[1];
    deck.deckShiftEnd();
    expect(deck.tab[deck.tab.length - 1]).toBe(premier);
    expect(deck.tab[0]).toBe(second);
  });
  test("It should keep the type of the element", () => {
    const deck: Deck = new Deck();
    deck.initDeck();
    let premier = new Path(99, false, true, true, true, true);
    deck.tab[0] = premier;
    deck.deckShiftEnd();
    expect(deck.tab[deck.tab.length - 1]).toBe(premier);
    let fin = deck.tab[deck.tab.length - 1] as Path;
    expect(fin.cardId).toBe(premier.cardId);
    expect(fin.deadEnd).toBe(premier.deadEnd);
    expect(fin.east).toBe(premier.east);
    expect(fin.west).toBe(premier.west);
    expect(fin.north).toBe(premier.north);
    expect(fin.south).toBe(premier.south);
  });
});

describe("Function deckBalance", () => {
  test("It should balance the deck, spacing the cards of the same type  ", () => {
    const deck: Deck = new Deck();
    deck.tab[0] = new Card(1);
    deck.tab[0].cardType = 66;

    deck.tab[1] = new Card(2);
    deck.tab[1].cardType = 67;

    deck.tab[2] = new Card(3);
    deck.tab[2].cardType = 67;

    deck.tab[3] = new Card(4);
    deck.tab[3].cardType = 66;
    deck.tab[4] = new Card(5);
    deck.tab[4].cardType = 68;

    deck.tab[5] = new Card(6);
    deck.tab[5].cardType = 68;

    deck.tab[6] = new Card(7);
    deck.tab[6].cardType = 73;
    deck.tab[7] = new Card(8);
    deck.tab[7].cardType = 74;
    deck.tab[8] = new Card(9);
    deck.tab[8].cardType = 75;
    const distances: number[] = [];
    for (let i = 0; i < deck.tab.length - 1; i++) {
      if (deck.tab[i].cardType === deck.tab[i + 1].cardType) {
        distances.push(Math.abs(i + 1 - i));
      }
    }

    const expectedSum = distances.reduce((a, b) => a + b, 0);

    deck.deckBalance();

    const newDistances: number[] = [];
    for (let i = 0; i < deck.tab.length - 1; i++) {
      if (deck.tab[i].cardType === deck.tab[i + 1].cardType) {
        newDistances.push(Math.abs(i + 1 - i));
      }
    }

    const actualSum = newDistances.reduce((a, b) => a + b, 0);

    expect(actualSum).toBeLessThanOrEqual(expectedSum);
  });
});
