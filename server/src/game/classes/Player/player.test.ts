import { Card, TYPECOAL, TYPEGOLD } from "../Card/Card";
import { Bonus } from "../Card/Bonus";
import { Player } from "./Player";
import { Path } from "../Card/Path";
import { Board, COORDSORTIEX, COORDSORTIEY } from "../Board/Board";
import { ICardReveal, IPLayersRevealed } from "@shared/socket";

describe("Init Player", () => {
  test("It should create a Player object", () => {
    const player = new Player(4);
    //On vérifie que l'id reste le même
    expect(player.playerId).toBe(4);
    //On vérifie que la main du joueur est vide
    expect(player.handSize).toBe(0);
    //On vérifie que les équipements du joueurs ne sont pas cassées
    expect(player.pickaxe).toBe(true);
    expect(player.cart).toBe(true);
    expect(player.torch).toBe(true);
  });
});
describe("Function checkBonus", () => {
  test("checkBonus should test if a bonus is valid to use for a player", () => {
    const player = new Player(4);
    expect(player.checkBonus(new Bonus(100, true, true, false, false))).toBe(
      //on vérifie qu'on peut casser la pioche d'un joueur
      true
    );
    player.pickaxe = false;
    expect(player.checkBonus(new Bonus(101, false, true, false, false))).toBe(
      //on vérifie qu'on peut réparer la pioche d'un joueur
      true
    );
    expect(player.checkBonus(new Bonus(102, false, false, true, false))).toBe(
      //on vérifie qu'on ne peut pas reparer  le chariot pas cassé
      false
    );
    expect(player.checkBonus(new Bonus(103, false, false, false, true))).toBe(
      //on vérifie qu'on peut pas réparer la torche si pas cassée
      false
    );
    expect(player.checkBonus(new Bonus(104, true, false, true, false))).toBe(
      //on peut casser le chariot
      true
    );
    expect(player.checkBonus(new Bonus(105, true, false, false, true))).toBe(
      //on peut casser la torche
      true
    );
    player.cart = false;
    expect(player.checkBonus(new Bonus(106, false, false, true, false))).toBe(
      //on peut réparer le chariot cassé
      true
    );
    player.torch = false;
    expect(player.checkBonus(new Bonus(107, false, false, false, true))).toBe(
      //on peut réparer la torche cassée
      true
    );
  });
  test("checkBonus should test if a bonus is valid to use for a player with doubleCards", () => {
    const player = new Player(4);
    player.torch = false;
    player.cart = true;
    player.pickaxe = true;
    expect(
      player.checkBonus(new Bonus(108, false, true, false, true), {
        pickaxe: false,
        cart: false,
        lantern: true,
      })
    ).toBe(
      //on peut réparer la torche cassée avec une carte double bonus
      true
    );
    expect(
      player.checkBonus(new Bonus(109, false, true, false, true), {
        pickaxe: false,
        cart: true,
        lantern: false,
      })
    ).toBe(
      //on ne peut réparer le chariot cassé avec une carte double bonus
      false
    );
  });
});
describe("Function draw", () => {
  test("It should increment your handSize if you draw", () => {
    //Vérifie que la taille de la main du joueur s'agrandit quand il pioche
    const player: Player = new Player(1);
    const card: Card = new Card(1);
    const handSize = player.handSize;

    player.drawSubPlayer(card);
    //Vérifie que la taille de la main est égale à celle de l'ancienne +1
    expect(player.handSize).toBe(handSize + 1);
  });

  test("It should add the drawn card to your hand", () => {
    //Vérifie que la carte piochée est bien celle dans la main
    const player: Player = new Player(1);
    const card: Card = new Card(1);
    player.drawSubPlayer(card);
    expect(player.cardsInHand[0]).toBe(card);
  });
});
describe("Function discard", () => {
  test("It should decrement your handSize if you discard a card", () => {
    //Vérifie que la taille de la main du joueur diminue quand il défausse
    const player: Player = new Player(1);
    const cardDiscard: Card = new Card(1);
    const handSize = 1;
    player.handSize = handSize;
    player.cardsInHand[0] = cardDiscard;

    player.discardSubPlayer(cardDiscard);
    //Vérifie que la taille de la main a diminué de 1 par rapport à l'ancienne
    expect(player.handSize).toBe(handSize - 1);
  });

  test("It should remove the discarded card from your cards", () => {
    //Vérifique que la carte défaussée n'est plus dans la main du joueur
    const player: Player = new Player(1);
    const firstCard: Card = new Card(1);
    const cardDiscard: Card = new Card(2);
    const lastCard: Card = new Card(3);
    const handSize = 3;
    player.handSize = handSize;
    player.cardsInHand[0] = firstCard;
    player.cardsInHand[1] = cardDiscard;
    player.cardsInHand[2] = lastCard;

    player.discardSubPlayer(cardDiscard);
    //Vérifie que les autres cartes sont encores présentes et qu'il n'y pas de "trous"
    expect(player.cardsInHand[0]).toBe(firstCard);
    expect(player.cardsInHand[1]).toBe(lastCard);
  });
});
describe("Function applyReveal", () => {
  test("cardsRevealed attribute should be modified and have TYPEGOLD", () => {
    const board = new Board();
    const player1: Player = new Player(1);
    const coordGoldX: number = board.coordOrX;
    const coordGoldY: number = board.coordOrY;
    const cardExpected: ICardReveal = {
      cardType: TYPEGOLD,
      coordX: coordGoldX,
      coordY: coordGoldY,
    };
    player1.applyReveal(board, coordGoldX, coordGoldY);

    expect(player1.cardsRevealed).toContainEqual(cardExpected);
  });
  test("cardsRevealed attribute should be modified and have TYPECOAL", () => {
    const board = new Board();
    const player1: Player = new Player(1);
    board.coordOrX = 0;
    board.coordOrY = 0;
    const cardExpected: ICardReveal = {
      cardType: TYPECOAL,
      coordX: COORDSORTIEX,
      coordY: COORDSORTIEY,
    };
    player1.applyReveal(board, COORDSORTIEX, COORDSORTIEY);

    expect(player1.cardsRevealed).toContainEqual(cardExpected);
  });
});
describe("Function checkRevealSubPlayer", () => {
  test("It should return true if coords are not revealed yet", () => {
    const player1: Player = new Player(1);
    const coordX: number = COORDSORTIEX;
    const coordY: number = COORDSORTIEY;
    expect(player1.checkRevealSubPlayer(coordX, coordY)).toBe(true);
  });
  test("It should return false if coords are already revealed", () => {
    const board = new Board();
    const player1: Player = new Player(1);
    const coordX: number = COORDSORTIEX;
    const coordY: number = COORDSORTIEY;
    player1.applyReveal(board, coordX, coordY);
    expect(player1.checkRevealSubPlayer(coordX, coordY)).toBe(false);
  });
});

test("it should apply bonus cards to player", () => {
  let player: Player = new Player(100);
  player.applyBonus(new Bonus(101, true, true, false, false)); //casse pioche
  expect(player.pickaxe).toBe(false);
  player.applyBonus(new Bonus(101, false, true, false, false)); //repare pioche
  expect(player.pickaxe).toBe(true);
  player.applyBonus(new Bonus(101, true, false, true, false)); //casse chariot
  expect(player.cart).toBe(false);
  player.applyBonus(new Bonus(101, false, false, true, false));
  expect(player.cart).toBe(true);
  player.applyBonus(new Bonus(101, true, false, false, true)); //casse torche
  expect(player.torch).toBe(false);
  player.applyBonus(new Bonus(101, false, false, false, true));
  expect(player.torch).toBe(true);
});

describe("Function checkOwner", () => {
  test("It should check if a card is in the hand of a given player", () => {
    //Devrait renvoyer les bonnes valeurs selon les cartes testées
    let player: Player = new Player(100);
    let carte = new Card(99);
    //On ajoute une carte dans la main du joueur
    player.cardsInHand[0] = carte;
    //On vérifie la fonction renvoie bien true
    expect(player.checkOwner(99)).toBe(true);
    //On vérifie que la fonction renvoie false pour une carte quelconque qui n'est pas dans la main
    expect(player.checkOwner(new Card(98).cardId)).toBe(false);
    //On vérifie que ca renvoie false avec une carte Path qui n'est pas dans la main
    expect(
      player.checkOwner(new Path(100, false, false, true, false, false).cardId)
    ).toBe(false);
    let carte2 = new Path(103, false, false, false, true, false);
    player.cardsInHand[1] = carte2;
    player.cardsInHand[2] = new Card(5);
    //On vérifie que ca marche avec une carte Path pour true
    expect(player.checkOwner(carte2.cardId)).toBe(true);
    //On vérifie que ca marche avec une carte quelconque dans la main
    expect(player.checkOwner(5)).toBe(true);
  });
});
describe("Function checkAllTools", () => {
  test("It should check if a player has all his tools up", () => {
    let player = new Player(69);
    expect(player.checkAllTools()).toBe(true);
    player.pickaxe = false;
    expect(player.checkAllTools()).toBe(false);
    player.pickaxe = true;
    player.torch = false;
    expect(player.checkAllTools()).toBe(false);
    player.torch = true;
    player.cart = false;
    expect(player.checkAllTools()).toBe(false);
    player.cart = true;
    expect(player.checkAllTools()).toBe(true);
  });
});

describe("fonction nextGame", () => {
  test("it should reset everything execpt player id ", () => {
    let player1 = new Player(1);
    let player2 = new Player(1);
    expect(player1).toMatchObject(player2);
    player1.nextGame();
    expect(player1).toMatchObject(player2);
    player1.cardsInHand = [new Card(100), new Card(101), new Card(102)];
    player1.handSize = 3;
    player1.cart = false;
    player1.pickaxe = false;
    player1.nextGame();
    expect(player1).toMatchObject(player2);
  });
});

describe("Function useTrace", () => {
  test("It should add player's id and team in playersRevealed", () => {
    //On vérifie que le camp et l'id du joueur inspecté sont bien mis dans playersRevealed
    const player1: Player = new Player(1);
    const playerInspected = new Player(2);
    playerInspected.saboteur = false;
    const playerRevealedExpected: IPLayersRevealed = {
      playerdId: playerInspected.playerId,
      saboteur: playerInspected.saboteur,
    };

    player1.useTrace(playerInspected);
    expect(player1.playersRevealed).toContainEqual(playerRevealedExpected);
  });
});

describe("Function copyPlayer", () => {
  test("It should copy attributes expect personnal copied Player attributes", () => {
    let copiedPlayer = new Player(1);
    let newPlayer = new Player(2);
    copiedPlayer.cart = false;
    copiedPlayer.goldAmount = 2;
    copiedPlayer.drawSubPlayer(new Card(1000));
    newPlayer.copyPlayer(copiedPlayer);
    expect(newPlayer.goldAmount).toBe(copiedPlayer.goldAmount);
    expect(newPlayer.handSize).toBe(copiedPlayer.handSize);
    expect(newPlayer.pickaxe).toBe(copiedPlayer.pickaxe);
    expect(newPlayer.cart).toBe(copiedPlayer.cart);
    expect(newPlayer.torch).toBe(copiedPlayer.torch);
    expect(newPlayer.cardsInHand).toBe(copiedPlayer.cardsInHand);
    expect(newPlayer.cardsRevealed).toBe(copiedPlayer.cardsRevealed);
    expect(newPlayer.playersRevealed).toBe(copiedPlayer.playersRevealed);
  });
});
