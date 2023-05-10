import { ICardReveal } from "@shared/socket";
import { Board, COORDSORTIEX, COORDSORTIEY } from "../Board/Board";
import { Bonus } from "../Card/Bonus";
import {
  Card,
  IDCOAL,
  IDEMPTY,
  IDFINISH,
  IDGOLD,
  TYPECOAL,
  TYPEGOLD,
} from "../Card/Card";

import { Debrouillard } from "../Player/debrouillard";
import { Fixeur } from "../Player/fixeur";
import { Teletravailleur } from "../Player/teletravailleur";
import { Collapse } from "../Card/Collapse";
import { Deck } from "../Deck/Deck";
import { Finish } from "../Card/Finish";
import { Move } from "../Move/Move";
import { Path } from "../Card/Path";
import { Player } from "../Player/Player";
import { Reveal } from "../Card/Reveal";
import { Game, MINEURSCONST, SABOTEURCONST } from "./Game";
import { IMove } from "@shared/socket";
import { Deadline } from "../Card/Deadline";
describe("Function endTurn", () => {
  const game: Game = new Game([1, 2, 3]);
  const players: Player[] = game.players;
  test("It should change currentPlayer when you endTurn", () => {
    //Le joueur actuel est actualisé à la fin d'un tour
    game.startGame();
    game.endTurn();
    expect(game.currentPlayer).toBe(1); // au joueur 1 de jouer
    game.endTurn(); //au joueur 2 de jouer
    game.endTurn();
    expect(game.currentPlayer).toBe(0); // au joueur 0 , on vérifie que revient bien a 0 selon le nombre de joueurs
  });
  test("It should skip player if playerHand is empty", () => {
    game.players[1].cardsInHand = [];
    game.players[1].handSize = 0;
    players[2].drawSubPlayer(new Reveal(2));
    game.endTurn();
    expect(game.currentPlayer).toBe(2);
  });
});

describe("Function draw", () => {
  test("It should decrement deckSize by 1 if you can draw and you draw", () => {
    //On vérifie que la taille du deck diminue quand on pioche
    const game: Game = new Game([1, 2, 3]);
    game.startGame();
    game.deckSize = 1;
    //On ajoute une carte dans le deck
    game.deck.tab.push(new Card(1));
    game.draw(game.deck, game.players[0]);
    expect(game.deckSize).toBe(0);
  });
});

describe("Function discard", () => {
  test("It should decrement player handsize and put card in discardDeck", () => {
    //On vérifie que la main du joueur est actualisé correctement apres la défausse d'une carte
    //Et que la carte va dans la défausse
    const game: Game = new Game([1, 2, 3]);
    const cardDiscard = new Card(2);
    game.startGame();
    //On ajoute une carte classique dans la main du joueur
    game.players[0].cardsInHand[0] = cardDiscard;
    //La taille de la main avant la défausse
    const oldHandSize: number = ++game.players[0].handSize;
    game.discard(game.players[0], cardDiscard);
    //On vérifie que la taille de la main est bien diminuée
    expect(game.players[0].handSize).toBe(oldHandSize - 1);
    //On vérifie que la carte n'est plus dans la main
    expect(game.players[0].cardsInHand).not.toContain(cardDiscard);
    //On vérifie que la carte est bien dans la défausse
    expect(game.discardDeck.tab.pop()).toEqual(cardDiscard);
  });
});

describe("Function useDeadlineCard", () => {
  const game: Game = new Game([1, 2, 3]);

  const nbCards: number = 5;
  const deadlineCardIncrease: Deadline = new Deadline(40, true, nbCards);
  const deadlineCardDecrease: Deadline = new Deadline(40, false, nbCards);
  test("It should add 5 cards to discardDeck", () => {
    game.startGame();
    //On garde en mémoire les cartes qui sont supprimés du deck
    const cardsTaken: Card[] = game.deck.tab.slice(0, nbCards);
    //On garde en mémoire la valeur de de size et la taille effective du deck (normalement la même)
    let curDeckSize: number = game.deckSize;
    let effectiveDeckSize: number = game.deck.tab.length;
    //Vérifie que la pioche contient plus de nbcartes
    expect(game.deck.tab.length).toBeGreaterThanOrEqual(nbCards);
    game.useDeadlineCard(game.players[0], deadlineCardDecrease);
    //On vérifie que la taille de la défausse a augmenté
    expect(game.discardDeck.tab.length).toBe(nbCards);
    //On vérifie la taille du deck
    expect(game.deckSize).toBe(curDeckSize - nbCards);
    expect(game.deck.tab.length).toBe(effectiveDeckSize - nbCards);

    //On vérifie que les cartes sont les mêmes et dans le même ordre
    expect(cardsTaken).toStrictEqual(game.discardDeck.tab);
  });
  test("It should remove 5 cards from discardDeck and put them in deck", () => {
    game.startGame();
    //On ajoute des cartes dans la défausse

    game.discardDeck.tab.push(new Card(100));
    game.discardDeck.tab.push(new Card(101));
    game.discardDeck.tab.push(new Card(102));
    game.discardDeck.tab.push(new Card(103));
    game.discardDeck.tab.push(new Card(104));
    game.discardDeck.tab.push(new Card(105));

    //On garde en mémoire les cartes qui sont supprimés de la défausse
    const cardsTaken: Card[] = game.discardDeck.tab.slice(0, nbCards);
    //On garde en mémoire la valeur de de size et la taille effective du deck (normalement la même)
    let curDiscardSize: number = game.discardDeck.tab.length;
    let curDeckSize: number = game.deckSize;
    let effectiveDeckSize: number = game.deck.tab.length;
    //Vérifie que discardDeck contient plus de nbcartes
    expect(game.discardDeck.tab.length).toBeGreaterThanOrEqual(nbCards);
    game.useDeadlineCard(game.players[0], deadlineCardIncrease);
    //On vérifie que la taille de la défausse a diminué
    expect(game.discardDeck.tab.length).toBe(curDiscardSize - nbCards);
    //On vérifie la taille du deck
    expect(game.deckSize).toBe(curDeckSize + nbCards);
    expect(game.deck.tab.length).toBe(effectiveDeckSize + nbCards);

    //On vérifie que les cartes sont les mêmes et dans le même ordre
    expect(cardsTaken).toStrictEqual(game.deck.tab.slice(-nbCards));
  });
  test("It should remove max number of cards from discard", () => {
    game.startGame();
    //On ajoute une carte dans la défausse

    game.discardDeck.tab.push(new Card(100));
    const cardTaken: Card[] = game.discardDeck.tab.slice(-1);
    //On garde en mémoire la valeur de de size et la taille effective du deck (normalement la même)
    let curDiscardSize: number = game.discardDeck.tab.length;
    let curDeckSize: number = game.deckSize;
    let effectiveDeckSize: number = game.deck.tab.length;
    //Vérifie que discardDeck contient moins de nbcartes
    expect(game.discardDeck.tab.length).toBeLessThan(nbCards);
    game.useDeadlineCard(game.players[0], deadlineCardIncrease);
    //On vérifie que la taille de la défausse a diminué
    expect(game.discardDeck.tab.length).toBe(0);
    //On vérifie la taille du deck
    expect(game.deckSize).toBe(curDeckSize + 1);
    expect(game.deck.tab.length).toBe(effectiveDeckSize + 1);

    //On vérifie que les cartes sont les mêmes et dans le même ordre
    expect(cardTaken).toStrictEqual(game.deck.tab.slice(-1));
  });
  test("It should remove max number of cards from deck", () => {
    game.startGame();
    game.deckSize = 1;
    game.deck.tab = game.deck.tab.slice(-1);
    const cardTaken = game.deck.tab.slice(-1);
    //On garde en mémoire la longueur de la défausse
    let curDiscardSize: number = game.discardDeck.tab.length;
    //Vérifie que la pioche contient moins de nbcartes
    expect(game.deck.tab.length).toBeLessThan(nbCards);
    game.useDeadlineCard(game.players[0], deadlineCardDecrease);
    //On vérifie que la taille de la pioche a diminué
    expect(game.deck.tab.length).toBe(0);
    expect(game.deckSize).toBe(0);
    //On vérifie la taille de la défausse
    expect(game.discardDeck.tab.length).toBe(curDiscardSize + 1);

    //On vérifie que les cartes sont les mêmes et dans le même ordre
    expect(cardTaken).toStrictEqual(game.discardDeck.tab.slice(-1));
  });
});

describe("Function removeCard", () => {
  const game: Game = new Game([1, 2, 3]);
  test("It should remove the card from the game (card not in deckDiscard", () => {
    game.startGame();
    const cardDiscard = new Card(2);
    //On ajoute une carte classique dans la main du joueur
    game.players[0].cardsInHand[0] = cardDiscard;
    game.removeCard(game.players[0], cardDiscard);
    expect(game.players[0].cardsInHand).not.toContain(cardDiscard);
    expect(game.discardDeck.tab).not.toContain(cardDiscard);
  });
});

describe("Function getRoles", () => {
  test("It should return a tab with randomly distributed boolean  for  3,5 and 8 players", () => {
    //Vérifie que les rôles ont bien été distribués
    [
      [3, 2],
      [5, 3],
      [8, 5],
    ].forEach((i) => {
      const arr = Array.from(Array(i[0]), (_, index) => index + 1);
      const game: Game = new Game(arr);
      game.startGame();
      let tab: boolean[] = game.getRoles();
      let nombreMineurs = game.players.length;
      for (let j = 0; j < tab.length; j++) {
        if (tab[j] === true) {
          nombreMineurs--;
        }
      }
      expect(nombreMineurs).toBeLessThanOrEqual(tab.length);
      expect(nombreMineurs).toBeGreaterThanOrEqual(i[1]);
    });
  });
});

describe("Function dealCards", () => {
  test("It should give the right amount of cards and updateGame the deck size when dealing", () => {
    //Liste des nombres de joueurs possibles
    const nbPlayersTab: number[] = [3, 4, 5, 6, 7, 8, 9, 10];
    //Liste des nombres de cartes à distribuer
    const nbCardsDealExpected: number[] = [6, 6, 6, 5, 5, 4, 4, 4];
    //Liste des taille du deck après la distribution
    const deckSizeExpected: number[] = [45, 39, 33, 33, 28, 31, 27, 23];
    //On vérifie les valeurs pour chaque nombre de joueurs possible
    nbPlayersTab.forEach((nbPlayer, index) => {
      //Liste des id des joueurs
      //On prépare la liste d'id de joueurs à donner en argument a new Game pour sa création
      let game: Game = new Game(
        Array.from(Array(nbPlayersTab[index]), (_, index) => index + 1)
      );
      //On crée les cartes
      game.dealCards(game.deck);
      //On vérifie que chaque joueur a le bon nombre de cartes
      game.players.forEach((gamePlayer) => {
        expect(gamePlayer.handSize).toBe(nbCardsDealExpected[index]);
      });
      //On vérifie que le deck fait bien la bonne taille après distribution des cartes
      expect(game.deckSize).toBe(deckSizeExpected[index]);
    });
  });
});

describe("Function checkReveal", () => {
  const game: Game = new Game([1, 2, 3]);
  test("It should return true on unrevealed Finish", () => {
    expect(game.checkReveal(COORDSORTIEX, COORDSORTIEY)).toBe(true);
  });
  test("It should return false on wrong case", () => {
    expect(game.checkReveal(0, 0)).toBe(false);
  });
  test("It should return false on revealed case", () => {
    game.players[game.currentPlayer].applyReveal(
      game.gameBoard,
      COORDSORTIEX,
      COORDSORTIEY
    );
    expect(game.checkReveal(COORDSORTIEX, COORDSORTIEY)).toBe(false);
  });
});

describe("Function saboteursWin", () => {
  test("It should give 1 to 4 golds to every Saboteurs who just won the round", () => {
    //On vérifie que les saboteurs recoivent la bonne quantité d'or
    //Liste des id des joueurs
    let game: Game = new Game([1, 2, 3, 4]);
    game.startGame();
    //Liste des joueurs pour faciliter la manipulation
    game.players[0].saboteur = true;
    game.players[1].saboteur = true;
    game.players[2].saboteur = false;
    game.players[3].saboteur = false; // on a initialisé un tableau de joueur avec 2 sab et 2 mineurs
    // On verifie que les golds des joueurs avant la fonction soit bien de 0
    for (let i = 0; i < game.players.length; i++) {
      expect(game.players[i].goldAmount).toBe(0);
    }
    game.saboteursWin();
    //On vérifie l'or de chaque joueur
    game.players.forEach((element) => {
      if (!element.saboteur) {
        expect(element.goldAmount).toBe(0); // si mineur alors 0 gold
      } else {
        expect(element.goldAmount).toBe(3); // avec 2 saboteurs, les saboteurs qui gagnent reçoivent 3 golds
      }
    });
  });
});

describe("Function minersWin", () => {
  test("It should give 1 to 3 golds to every Miners who just won the round, the miner who found gold is supposed to have 3 golds", () => {
    //On vérifie que les mineurs recoivent la bonne quantité d'or
    let game: Game = new Game([1, 2, 3, 4]);
    game.startGame();
    game.currentPlayer = 3; //le miner qui a trouvé l'or est le player ID = 3
    game.players[0].saboteur = true;
    game.players[1].saboteur = true; // on a initialisé un tableau de joueur avec 2 saboteurs et 2 mineurs
    for (let i = 0; i < game.players.length; i++) {
      expect(game.players[i].goldAmount).toBe(0); // on verifie que les golds des joueurs avant la fonction soit bien de 0
    }
    game.players[game.currentPlayer].saboteur = false;
    game.minersWin();
    game.players.forEach((element) => {
      if (!element.saboteur) {
        expect(element.goldAmount).toBeGreaterThan(0); // les mineurs doivent avoir + de 0 golds
      } else {
        expect(element.goldAmount).toBe(0); // si saboteur 0 golds
      }
    });
    //expect(game.players[game.currentPlayer].goldAmount).toBe(3); // le vainqueur doit avoir 3 golds
  });
});

describe("Function emptyHands", () => {
  test("It should return true if all the player's hands are empty", () => {
    const game: Game = new Game([0, 1, 2]);
    expect(game.emptyHands()).toBe(true);
    game.draw(game.deck, game.players[1]);
    expect(game.emptyHands()).toBe(false);
  });
});

describe("Function useDeadlineCard", () => {
  const game = new Game([1, 2, 3]);
  const deadlineCard: Deadline = new Deadline(100, true, 5);
  test("It should remove the card from the game when used", () => {
    game.players[0].drawSubPlayer(deadlineCard);
  });
});

describe("Function startGame", () => {
  test("startGame should initalise all game data", () => {
    let game = new Game([0, 42, 2]);
    game.startGame();
    expect(game.gameBoard).toBeInstanceOf(Board);
    expect(game.currentPlayer).toBe(0);
    expect(game.deckSize).toBeLessThan(51); //car on a appelé dealCards
    expect(game.deckSize).toBeGreaterThan(0);
    expect(game.winner).toBe(0);
    expect(game.players[1].handSize).toBeGreaterThan(2);
    expect(game.players[1].goldAmount).toBe(0); //car on vent de créer game donc doit pas encore avoir de pépites
    expect(game.players[0].goldAmount).toBe(0);
    expect(game.players[1].playerId).toBe(42); //id donné de base
  });
  test("it should reset everything in the game  except players gold and ids, so it can be used between rounds", () => {
    let game = new Game([0, 42, 92]);
    game.startGame();
    //on simule une partie pour voir si les modifs persistent de round en round
    game.gameBoard.addPath(new Path(1000, true, true, true, true, true), 4, 4); //on ajoute un chemin a 4,4
    game.nextPlayer(); //change currentPlayer
    game.players[0].cardsInHand.forEach((element) => {
      game.discard(game.players[0], element); //on discard toute la main
    });
    game.players[1].cardsInHand[1] = new Collapse(100);
    game.deckSize = 0;
    game.players[0].goldAmount = 10;
    game.players[1].goldAmount = 1;
    game.winner = 3;
    //on passe le round avec startGame
    game.startGame();
    expect(game.gameBoard.tab[4][4].cardId).toBe(0); //on s'attends a ce que la carte path ait été enlevée
    expect(game.currentPlayer).toBe(0);
    expect(game.deckSize).toBeLessThan(60); //car on a appelé dealCards
    expect(game.deckSize).toBeGreaterThan(0);
    expect(game.winner).toBe(0); //winner remis a zéro
    expect(game.players[1].handSize).toBeGreaterThan(2);
    expect(game.players[1].cardsInHand[1].cardId).toBeLessThan(1000);
    expect(game.players[0].handSize).toBeGreaterThan(2);
    expect(game.players[1].goldAmount).toBe(1); //car on vent de créer game donc doit pas encore avoir de pépites
    expect(game.players[0].goldAmount).toBe(10);
    expect(game.players[1].playerId).toBe(42);
    expect(game.players[2].playerId).toBe(92);
  });
});

describe("Function startGameConst", () => {
  test("startGameConst should initalise all game data", () => {
    let game = new Game([0, 42, 2]);
    game.startGameConst();
    expect(game.gameBoard).toBeInstanceOf(Board);
    expect(game.currentPlayer).toBe(0);
    expect(game.players.length).toBe(3);
    expect(game.deckSize).toBeLessThan(51); //car on a appelé dealCards
    expect(game.deckSize).toBeGreaterThan(0);
    expect(game.winner).toBe(0);
    expect(game.players[1].handSize).toBeGreaterThan(5);
    expect(game.players[1].goldAmount).toBe(0); //car on vent de créer game donc doit pas encore avoir de pépites
    expect(game.players[0].goldAmount).toBe(0);
    expect(game.players[1].playerId).toBe(42); //id donné de base
  });
  test("it should reset everything in the game  except players gold and ids, so it can be used between rounds", () => {
    let players: number[] = [0, 42, 92];
    let game = new Game(players);
    game.startGameConst();
    let tabcheck = game.deck.tab;
    //on simule une partie pour voir si les modifs persistent de round en round
    game.gameBoard.addPath(new Path(1000, true, true, true, true, true), 4, 4); //on ajoute un chemin a 4,4
    game.nextPlayer(); //change currentPlayer
    game.players[0].cardsInHand.forEach((element) => {
      game.discard(game.players[0], element); //on discard toute la main
    });
    game.players[1].cardsInHand[1] = new Collapse(100);
    game.deckSize = 0;
    game.players[0].goldAmount = 10;
    game.players[1].goldAmount = 1;
    game.winner = 3;
    //on passe le round avec startGame
    game.startGameConst();
    expect(game.gameBoard).toBeInstanceOf(Board);
    expect(game.gameBoard.tab[4][4].cardId).toBe(0); //on s'attends a ce que la carte path ait été enlevée
    expect(game.currentPlayer).toBe(0);
    //expect(game.deckSize).toBeLessThan(60); //car on a appelé dealCards
    expect(game.deckSize).toBeGreaterThan(0);
    expect(game.winner).toBe(0); //winner remis a zéro
    expect(game.players[1].handSize).toBeGreaterThan(2);
    expect(game.players[1].cardsInHand[1].cardId).toBeLessThan(1000);
    expect(game.players[0].handSize).toBeGreaterThan(2);
    expect(game.players[1].goldAmount).toBe(1); //car on vent de créer game donc doit pas encore avoir de pépites
    expect(game.players[0].goldAmount).toBe(10);
    expect(game.players[1].playerId).toBe(42);
    expect(game.players[2].playerId).toBe(92);
  });
  test("startGameConst should initalise all game data always the same ", () => {
    let game1 = new Game([0, 1, 2]);
    let game2 = new Game([0, 1, 2]);
    expect(game1.deck).toMatchObject(game2.deck);
    game1.startGameConst();
    game2.startGameConst();
    expect(game2.deck).toMatchObject(game1.deck); //toujours le meme deck
    expect(game1.players[0].cardsInHand).toMatchObject(
      game2.players[0].cardsInHand
    ); //la meme main
    expect(game1.players[1].cardsInHand).toMatchObject(
      game2.players[1].cardsInHand
    ); //la meme main
    expect(game1.players[2].cardsInHand).toMatchObject(
      game2.players[2].cardsInHand
    ); //la meme main
    game2.startGameConst();
    expect(game2.deck).toMatchObject(game1.deck); //toujours le meme deck
    expect(game1.players[0].cardsInHand).toMatchObject(
      game2.players[0].cardsInHand
    ); //la meme main
    expect(game1.players[1].cardsInHand).toMatchObject(
      game2.players[1].cardsInHand
    ); //la meme main
    expect(game1.players[2].cardsInHand).toMatchObject(
      game2.players[2].cardsInHand
    ); //la meme main
    expect(game2.deck).toMatchObject(game1.deck); //toujours le meme deck
    expect(game1.players[0].handSize).toBe(game2.players[0].handSize);
  });
});

describe("Function checkTargetPlayer", () => {
  test("It should return true if target is valid", () => {
    //Retourne vrai si cible valide (dans la liste des joueurs)
    const game = new Game([1, 2, 3]);
    expect(game.checkTargetPlayer(1)).toBe(true);
  });
  test("It should return false if target is invalid", () => {
    //Retourne vrai si cible valide (dans la liste des joueurs)
    const game = new Game([1, 2, 3]);
    expect(game.checkTargetPlayer(-1)).toBe(false);
    expect(game.checkTargetPlayer(3)).toBe(false);
  });
});

//achraff demerde :D
describe("Function updateGame", () => {
  let game = new Game([0, 1, 2]);
  game.startGame();
  let move0 = new Move();
  move0.movePathInit(1000, game.currentPlayer, 5, 5, false);
  test("it shouldn't play not owned cards", () => {
    game.players[0].cardsInHand = []; //on vide sa main

    try {
      game.updateGame(move0);
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("card not in player hand"); //on s'attends a une erreur car pas de carte dans sa main
    }
  });
  test("it should play only cards that the players owns", () => {
    game.players[game.currentPlayer].drawSubPlayer(new Card(1000));
    expect(game.updateGame(move0)).toBe(0);
  });
  test("it should play reveals cards if possible ", () => {
    //cas move non valable
    let move1 = new Move();
    move1.moveRevealCollapseInit(1100, game.currentPlayer, 1, 1);
    game.players[game.currentPlayer].drawSubPlayer(new Reveal(1100));
    try {
      game.updateGame(move1);
    } catch (error) {
      //coordonées de reveal pas valables
      if (error instanceof Error)
        expect(error.message).toBe(
          "erreur coordonnées cibles de reveal non valables"
        );
    }
    //cas reveal ou on a un move valable
    let move2 = new Move();
    game.currentPlayer = 0;
    move2.moveRevealCollapseInit(
      1200,
      game.currentPlayer,
      COORDSORTIEX,
      COORDSORTIEY
    );
    game.gameBoard.tab[COORDSORTIEX][COORDSORTIEY] = new Finish(
      COORDSORTIEX,
      COORDSORTIEY
    ); //on rajoute la sortie pour etre sur de pas créer une erreur

    game.players[game.currentPlayer].drawSubPlayer(new Reveal(1200));
    game.updateGame(move2);
    let type = TYPECOAL;
    if (
      COORDSORTIEX == game.gameBoard.coordOrX &&
      COORDSORTIEY == game.gameBoard.coordOrY
    )
      type = TYPEGOLD;
    const cardRevealExpected: ICardReveal = {
      cardType: type,
      coordX: COORDSORTIEX,
      coordY: COORDSORTIEY,
    };
    //on vérifie que ajouté a cartes revelées
    expect(game.players[0].cardsRevealed).toContainEqual(cardRevealExpected);
  });
  test("it should play collapse cards if valid", () => {
    //cas éboulement non valable
    let move3 = new Move();
    move3.moveRevealCollapseInit(1200, game.currentPlayer, 1, 1);
    game.players[game.currentPlayer].drawSubPlayer(new Collapse(1200));
    try {
      game.updateGame(move3);
    } catch (error) {
      //coordonées de l'eboulement pas valables car pas de cartes a cet endroit
      if (error instanceof Error)
        expect(error.message).toBe(
          "erreur coordonnées de l'éboulement non valables"
        );
    }
    //cas ou on joue l'eboulement
    game.gameBoard.tab[1][1] = new Path(1300, false, true, true, true, true); //on ajoute une carte a l'endroit de l'eboulement
    game.updateGame(move3);
    expect(game.gameBoard.tab[1][1].cardId).toBe(IDEMPTY);
  });
  test("it should play Bonus cards if valid", () => {
    game.currentPlayer = 0;
    game.players[game.currentPlayer].drawSubPlayer(
      new Bonus(100, false, true, false, false)
    ); //on ajoute le bonus a la main du joueur qui joue le move
    let move4 = new Move(); //target = id du joueur 1
    move4.moveBonusInit(100, game.currentPlayer, 1, true, false, false);
    //ne devrait pas marcher car ici on essaye de réparer une pioche pas cassée

    try {
      game.updateGame(move4);
    } catch (error) {
      //coordonées de l'eboulement pas valables car pas de cartes a cet endroit
      if (error instanceof Error)
        expect(error.message).toBe("erreur cible du bonus non valable");
    }
    //cas ou ca devrait appliquer la carte
    //on essaie pour un malus pioche
    game.currentPlayer = 0;
    game.players[game.currentPlayer].drawSubPlayer(
      new Bonus(101, true, true, false, false)
    );
    let move5 = new Move(); //target = id du joueur 1
    move5.moveBonusInit(101, game.currentPlayer, 1, true, false, false);
    game.updateGame(move5);
    //on vérifie que pioche bien cassée
    expect(game.players[1].pickaxe).toBe(false);
    //on essaie de la réparer avec le bonus sur la pioche précédemment pioché
    game.currentPlayer = 0;
    game.updateGame(move4);
    //on vérifie que pioche bien reparée
    expect(game.players[1].pickaxe).toBe(true);

    //on essaie pour un malus torche
    game.players[0].drawSubPlayer(new Bonus(102, true, false, false, true));
    game.currentPlayer = 0;
    let move6 = new Move(); //target = id du joueur 1
    move6.moveBonusInit(102, game.currentPlayer, 1, false, false, true);
    game.updateGame(move6);
    //on vérifie que torche bien cassée
    expect(game.players[1].torch).toBe(false);
    //on essaie de la réparer
    game.players[0].drawSubPlayer(new Bonus(103, false, false, false, true));
    game.currentPlayer = 0;
    let move7 = new Move();
    move7.moveBonusInit(103, game.currentPlayer, 1, false, false, true);
    game.updateGame(move7);
    //on vérifie que torche bien reparée
    expect(game.players[1].torch).toBe(true);

    //on essaie pour un malus chariot sur le joueur 2
    game.players[0].drawSubPlayer(new Bonus(104, true, false, true, false));
    game.currentPlayer = 0;
    let move8 = new Move(); //target = id du joueur 1
    move8.moveBonusInit(104, game.currentPlayer, 2, false, true, false);
    game.updateGame(move8);
    //on vérifie que le chariot est bien cassé
    expect(game.players[2].cart).toBe(false);
    //on essaie de le réparer
    game.players[0].drawSubPlayer(new Bonus(105, false, false, true, false));
    game.currentPlayer = 0;
    let move9 = new Move();
    move9.moveBonusInit(105, game.currentPlayer, 2, false, true, false);
    game.updateGame(move9);
    //on vérifie que torche bien reparée
    expect(game.players[2].cart).toBe(true);
  });
  test("It should play Double Bonus cards if valid", () => {
    game.startGame();
    let move = new Move();
    const doubleMalusPickTorch = new Bonus(110, true, true, false, true);
    const targetPlayer = game.players[1];
    game.players[game.currentPlayer].drawSubPlayer(doubleMalusPickTorch);
    //On vise la pioche
    move.moveBonusInit(110, game.currentPlayer, 1, true, false, false);
    game.updateGame(move);
    //On vérifie que seulement la pioche est cassée
    expect(targetPlayer.pickaxe).toBe(false);
    expect(targetPlayer.cart).toBe(true);
    expect(targetPlayer.torch).toBe(true);

    game.currentPlayer = 0;
    game.players[game.currentPlayer].drawSubPlayer(doubleMalusPickTorch);
    //On vise le chariot
    move.moveBonusInit(110, game.currentPlayer, 1, false, true, false);
    //Echoue car on vise un outil non visé par la carte bonus
    try {
      game.updateGame(move);
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("erreur cible du bonus non valable");
    }
  });
  test("it should play path cards if valid", () => {
    game.startGame();
    let move14 = new Move();
    move14.movePathInit(2000, game.currentPlayer, 3, 4, false);
    game.players[game.currentPlayer].drawSubPlayer(
      new Path(2000, false, true, true, true, true)
    );
    try {
      game.updateGame(move14);
    } catch (error) {
      //coordonées du chemin pas valable car connecté a rien
      if (error instanceof Error)
        expect(error.message).toBe("erreur coordonées de chemin non valable");
    }
    //on essaie de poser a coté de l'échelle
    let move15 = new Move();
    move15.movePathInit(2001, game.currentPlayer, 3, 2, false);
    game.players[game.currentPlayer].drawSubPlayer(
      new Path(2001, false, true, true, true, true)
    );
    expect(game.updateGame(move15)).toBe(0);
    expect(game.gameBoard.tab[3][2].cardId).toBe(2001);
    //on essaie de poser a coté du chemin qu'on vient de poser
    let move16 = new Move();
    move16.movePathInit(2002, game.currentPlayer, 3, 3, false);
    game.players[game.currentPlayer].drawSubPlayer(
      new Path(2002, false, true, true, true, true)
    );
    expect(game.updateGame(move16)).toBe(0);
    expect(game.gameBoard.tab[3][3].cardId).toBe(2002);
  });

  test("it should play path cards if valid, and change coal and gold values if a path join them to the ladder, and use checkGold", () => {
    //ladder a 3 1, cartes finish a  3 9, 5 9 et 1 9
    //ici on mets l'or a 1, 9 pour diffférencier les cas, car de base coord aleatoires
    game.startGame();
    game.gameBoard.coordOrX = 1;
    game.gameBoard.coordOrY = 9;
    //on construis le chemin vers charbon en 3 9
    game.gameBoard.addPath(new Path(2003, false, true, true, true, true), 3, 2);
    game.gameBoard.addPath(new Path(2004, false, true, true, true, true), 3, 3);
    game.gameBoard.addPath(new Path(2005, false, true, true, true, true), 3, 4);
    game.gameBoard.addPath(new Path(2006, false, true, true, true, true), 3, 5);
    game.gameBoard.addPath(new Path(2007, false, true, true, true, true), 3, 6);
    game.gameBoard.addPath(new Path(2008, false, true, true, true, true), 3, 7);
    game.players[game.currentPlayer].drawSubPlayer(
      new Path(2009, false, true, true, true, true)
    );
    let move17 = new Move();
    move17.movePathInit(2009, game.currentPlayer, 3, 8, false);
    expect(game.gameBoard.tab[3][9].cardId).toBe(IDFINISH);
    game.updateGame(move17);
    expect(game.gameBoard.tab[3][9].cardType).toBe(TYPECOAL);
    expect(game.gameBoard.tab[3][9].cardId).toBe(IDCOAL); //idcoal car on a que des charbons ici
    game.gameBoard.addPath(new Path(2010, false, true, true, true, true), 4, 7);
    game.gameBoard.addPath(new Path(2011, false, true, true, true, true), 5, 7);
    game.players[game.currentPlayer].drawSubPlayer(
      new Path(2012, false, true, true, true, true)
    );
    let move18 = new Move();
    move18.movePathInit(2012, game.currentPlayer, 5, 8, false);
    game.updateGame(move18);
    expect(game.gameBoard.tab[5][9].cardId).toBe(IDCOAL);
    game.gameBoard.addPath(new Path(2013, false, true, true, true, true), 2, 7);
    game.gameBoard.addPath(new Path(2014, false, true, true, true, true), 1, 7);
    game.players[game.currentPlayer].drawSubPlayer(
      new Path(2015, false, true, true, true, true)
    );
    let move19 = new Move();
    move19.movePathInit(2015, game.currentPlayer, 1, 8, false);
    game.updateGame(move19);
    expect(game.gameBoard.tab[1][9].cardId).toBe(IDGOLD);
  });
  test("it should end the game and give the gold if discovered", () => {
    game.startGame();
    game.gameBoard.coordOrX = 3;
    game.gameBoard.coordOrY = 9;
    //on construis le chemin vers charbon en 3 9
    game.gameBoard.addPath(new Path(2020, false, true, true, true, true), 3, 2);
    game.gameBoard.addPath(new Path(2021, false, true, true, true, true), 3, 3);
    game.gameBoard.addPath(new Path(2022, false, true, true, true, true), 3, 4);
    game.gameBoard.addPath(new Path(2023, false, true, true, true, true), 3, 5);
    game.gameBoard.addPath(new Path(2024, false, true, true, true, true), 3, 6);
    game.gameBoard.addPath(new Path(2025, false, true, true, true, true), 3, 7);
    game.gameBoard.tab[3][8] = new Card(IDEMPTY); //sinon passe pas, probablement a cause du test precédent verifier dépendances entre test ? pas indépendant ?
    //le joueur qui pose la carte doit etre un mineur pour vérif le gain de pépites
    game.players[0].saboteur = false;
    game.players[0].drawSubPlayer(
      new Path(2026, false, true, true, true, true)
    );
    let move20 = new Move();
    move20.movePathInit(2026, game.currentPlayer, 3, 8, false);
    game.updateGame(move20);
    expect(game.gameBoard.tab[3][9].cardId).toBe(IDGOLD); //idgold car gold placé ici artificiellement
    expect(game.gameBoard.checkGold()).toBe(true);
    expect(game.players[0].goldAmount).toBeGreaterThan(0); //joueur qui a posé la carte doit avoir gagné des pepites
    expect(game.winner).toBe(MINEURSCONST);
  });
  test("it should keep in hand cards used in non valid moves ", () => {
    game.players[0].cardsInHand = []; //on vide sa main
    let move21 = new Move();
    move21.movePathInit(2027, game.currentPlayer, 5, 5, false);
    game.players[0].drawSubPlayer(new Path(2027, true, true, true, true, true));
    try {
      game.updateGame(move21);
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("erreur coordonées de chemin non valable"); //on s'attends a une erreur car pas de carte dans sa main
    }
    expect(game.players[0].cardsInHand[0].cardId).toBe(2027);
    game.players[0].cardsInHand = []; //on vide sa main
    game.players[1].pickaxe = true; //devrait déja l'etre de base
    game.players[0].drawSubPlayer(new Bonus(1100, false, true, false, false)); //on ajoute le bonus a la main du joueur qui joue le move
    let move22 = new Move(); //target = id du joueur 1
    move22.moveBonusInit(1100, game.currentPlayer, 1, true, false, false);
    //ne devrait pas marcher car ici on essaye de réparer une pioche pas cassée
    try {
      game.updateGame(move22);
    } catch (error) {
      //coordonées de l'eboulement pas valables car pas de cartes a cet endroit
      if (error instanceof Error)
        expect(error.message).toBe("erreur cible du bonus non valable");
    }
    expect(game.players[0].cardsInHand[0].cardId).toBe(1100);

    let move23 = new Move();
    move23.moveRevealCollapseInit(11200, game.currentPlayer, 1, 1);
    game.players[0].cardsInHand = []; //on vide sa main
    game.players[0].handSize = 0;
    game.players[0].drawSubPlayer(new Collapse(11200));
    try {
      game.updateGame(move23);
    } catch (error) {
      //coordonées de l'eboulement pas valables car pas de cartes a cet endroit
      if (error instanceof Error)
        expect(error.message).toBe(
          "erreur coordonnées de l'éboulement non valables"
        );
    }
    expect(game.players[0].cardsInHand[0].cardId).toBe(11200);

    game.players[0].cardsInHand = []; //on vide sa main
    game.players[0].handSize = 0;
    let move24 = new Move();
    move24.moveRevealCollapseInit(11100, game.currentPlayer, 1, 1);
    game.players[0].drawSubPlayer(new Reveal(11100));
    try {
      game.updateGame(move24);
    } catch (error) {
      //coordonées de reveal pas valables
      if (error instanceof Error)
        expect(error.message).toBe(
          "erreur coordonnées cibles de reveal non valables"
        );
    }
    expect(game.players[0].cardsInHand[0].cardId).toBe(11100);
  });
  test("it should remove the played card or discarded ones ", () => {
    //pour les cartes vision
    let move12 = new Move();
    move12.moveRevealCollapseInit(
      1200,
      game.currentPlayer,
      COORDSORTIEX,
      COORDSORTIEY
    );
    game.gameBoard.tab[COORDSORTIEX][COORDSORTIEY] = new Finish(
      COORDSORTIEX,
      COORDSORTIEY
    ); //on rajoute la sortie pour etre sur
    game.players[0].cardsInHand.push(new Reveal(1200));
    expect(game.players[0].checkOwner(1200)).toBe(true);
    game.updateGame(move12);
    expect(game.players[0].checkOwner(1200)).toBe(false);

    //pour les cartes eboulement
    let move13 = new Move();
    move13.moveRevealCollapseInit(1201, game.currentPlayer, 1, 1);
    game.players[0].drawSubPlayer(new Collapse(1201));
    game.gameBoard.tab[1][1] = new Path(1300, false, true, true, true, true); //on ajoute une carte a l'endroit de l'eboulement
    expect(game.players[0].checkOwner(1201)).toBe(true);
    game.updateGame(move13);
    expect(game.players[0].checkOwner(1201)).toBe(false);

    //pour les cartes bonus
    game.players[0].drawSubPlayer(new Bonus(106, true, false, true, false));
    let move10 = new Move(); //target = id du joueur 1
    move10.moveBonusInit(106, game.currentPlayer, 2, false, true, false);
    expect(game.players[0].checkOwner(106)).toBe(true);
    game.updateGame(move10);
    //on vérifie que la carte a bien été enlevée
    expect(game.players[0].checkOwner(106)).toBe(false);
    //on essaie de le réparer
    game.players[0].drawSubPlayer(new Bonus(107, false, false, true, false));
    let move11 = new Move();
    move11.moveBonusInit(107, game.currentPlayer, 2, false, true, false);
    expect(game.players[0].checkOwner(107)).toBe(true);
    game.updateGame(move11);
    //on vérifie la carte a bien été enlevée
    expect(game.players[0].checkOwner(107)).toBe(false);

    game.players[0].drawSubPlayer(
      new Path(2000, false, true, true, true, true)
    );

    //on essaie de poser a coté de l'échelle
    let move25 = new Move();
    move25.movePathInit(20001, game.currentPlayer, 2, 3, false);
    game.players[0].drawSubPlayer(
      new Path(20001, false, true, true, true, true)
    );
    game.updateGame(move25);
    expect(game.gameBoard.tab[2][3].cardId).toBe(20001);
    expect(game.players[0].checkOwner(20001)).toBe(false);

    //on essaie avec Discard
    game.players[0].drawSubPlayer(new Path(999, false, true, true, true, true));
    expect(game.players[0].checkOwner(999)).toBe(true);
    let move26 = new Move(); //on mets une coord invalide pour bien verifier que défausse et ne joue pas
    move26.movePathInit(999, game.currentPlayer, 0, 0, false);
    move26.target = "Discard";
    game.updateGame(move26);
    expect(game.players[0].checkOwner(999)).toBe(false);
  });
  test("it should make the  player draw a new card if valid", () => {
    game.startGame();
    game.players[0].drawSubPlayer(
      new Path(1999, false, true, true, true, true)
    );
    let count = game.players[0].handSize;
    expect(game.players[0].checkOwner(1999)).toBe(true);
    expect(game.players[0].handSize).toBe(count);
    let move27 = new Move(); //on mets une coord invalide pour bien verifier que défausse et ne joue pas
    move27.movePathInit(1999, game.currentPlayer, 0, 0, false);
    move27.target = "Discard";
    game.updateGame(move27);
    expect(game.players[0].handSize).toBe(count); //meme valeur car a joué une carte et en a piochée une autre
  });
  test("it should end the game and saboteurWin if hands and decks are empty ", () => {
    let game = new Game([0, 1, 2]);
    game.startGame();
    game.deck.tab = [];
    game.deckSize = 0;
    game.players.forEach((joueurs) => {
      joueurs.cardsInHand = [];
      joueurs.handSize = 0;
    });
    game.players[0].drawSubPlayer(new Collapse(300)); //on ajoute une seule carte en jeu
    let move28 = new Move(); //on la joue
    move28.moveRevealCollapseInit(300, game.currentPlayer, 0, 0);
    move28.target = "Discard";
    game.updateGame(move28);
    expect(game.deckSize).toBe(0);
    expect(game.emptyHands()).toBe(true);
    expect(game.winner).toBe(SABOTEURCONST);
  });
  test("it should change the current player if the move is valid ", () => {
    game.startGame();
    game.currentPlayer = 0;
    game.players[game.currentPlayer].drawSubPlayer(new Collapse(700));
    let move29 = new Move();
    move29.moveRevealCollapseInit(700, game.currentPlayer, 0, 0);
    move29.target = "Discard";
    game.updateGame(move29);
    expect(game.currentPlayer).toBe(1);
    try {
      game.updateGame(move29);
    } catch (error) {
      if (error instanceof Error)
        expect(error.message).toBe("Ce n'est pas a votre tour de jouer");
      expect(game.currentPlayer).toBe(1);
    }
    game.players[game.currentPlayer].drawSubPlayer(new Reveal(500));
    let move30 = new Move();
    move30.moveRevealCollapseInit(
      500,
      game.currentPlayer,
      COORDSORTIEX,
      COORDSORTIEY
    );

    game.updateGame(move30);
    expect(game.currentPlayer).toBe(2);
  });

  test("it should flip a path card if move.flip is true", () => {
    game.startGame();
    let move31 = new Move();
    move31.movePathInit(200, game.currentPlayer, 3, 4, true);
    game.players[game.currentPlayer].cardsInHand = []; //on vide sa main
    game.players[game.currentPlayer].drawSubPlayer(
      new Path(200, false, true, false, true, false)
    );
    try {
      game.updateGame(move31);
    } catch (error) {
      //coordonées du chemin pas valable car connecté a rien
      if (error instanceof Error)
        expect(error.message).toBe("erreur coordonées de chemin non valable");
      let path = game.players[0].cardsInHand[0] as Path;
      //on veut que les booléens ne soient pas modifiés car on a pas posé la carte, donc flip pas effectif
      expect(path.north).toBe(true);
      expect(path.south).toBe(false);
      expect(path.east).toBe(true);
      expect(path.west).toBe(false);
    }
    //on pose un chemin en croix  a coté de l'échelle

    let move32 = new Move();
    move32.movePathInit(201, game.currentPlayer, 3, 2, true);
    game.players[game.currentPlayer].drawSubPlayer(
      new Path(201, false, true, true, true, true)
    );
    game.updateGame(move32);

    expect(game.gameBoard.tab[3][2].cardId).toBe(201);
    //on essaie de poser a coté du chemin qu'on vient de poser en utilisant flip
    let move33 = new Move(); //on pose la carte qui précédemment generait une erreur
    move33.movePathInit(202, game.currentPlayer, 3, 3, true);
    game.players[game.currentPlayer].cardsInHand = []; //on vide sa main
    game.players[game.currentPlayer].drawSubPlayer(
      new Path(202, false, true, false, true, false)
    );
    game.updateGame(move33);

    expect(game.gameBoard.tab[3][3].cardId).toBe(202);
    let path = game.gameBoard.tab[3][3] as Path; //on cherche la carte sur le board
    //on veut que les booléens ne soient pas modifiés car on a pas posé la carte, donc flip pas effectif
    expect(path.north).toBe(false);
    expect(path.south).toBe(true);
    expect(path.east).toBe(false);
    expect(path.west).toBe(true);
  });

  test("test if a player is not trying to play if he has a broken tool", () => {
    let game = new Game([0, 1, 2, 3]);
    game.startGame();
    game.players[0].pickaxe = false;
    game.players[0].drawSubPlayer(new Path(57, false, true, true, true, true));
    let move101 = new Move();
    move101.movePathInit(57, game.currentPlayer, 3, 2, false);
    try {
      game.updateGame(move101);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe(
          "Un de vos outils est cassé. Vous ne pouvez pas jouer."
        );
      }
    }
    game.players[0].pickaxe = true;
    expect(game.updateGame(move101)).toBe(0);
    expect(game.gameBoard.tab[3][2]).toBeInstanceOf(Path);
  });

  test("it should check if the coords in move are in board only if the card uses it, so not if it's a discard or a bonus ", () => {});

  test("it should track the current player and stop other people from playing ", () => {
    let game = new Game([0, 1, 2]);
    game.startGame();
    expect(game.currentPlayer).toBe(0);
    game.players[game.currentPlayer].drawSubPlayer(new Card(100));
    let move102 = new Move();
    move102.movePathInit(100, game.currentPlayer, 0, 0, false);
    move102.target = "Discard";
    game.updateGame(move102);
    expect(game.currentPlayer).toBe(1);
    game.players[game.currentPlayer].drawSubPlayer(new Card(100));
    try {
      game.updateGame(move102);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe("Ce n'est pas a votre tour de jouer");
        expect(game.currentPlayer).toBe(1);
      }
    }
  });
});

describe("Function updateGame with Teleworker", () => {
  let game = new Game([0, 1, 2]);
  game.startGame();
  game.players[0] = new Teletravailleur(0);
  //game.players[1] = new Teletravailleur(1);
  //game.players[2] = new Teletravailleur(2);
  game.players[0].pickaxe = false; // on casse un outil pour vérifier la particularité du teleworker
  test("Teleworker should not use reveal with a broken tool", () => {
    //cas move valable
    //on test d'abbord avec le joueur
    let move2 = new Move();
    move2.moveRevealCollapseInit(1200, 0, COORDSORTIEX, COORDSORTIEY);
    game.gameBoard.tab[COORDSORTIEX][COORDSORTIEY] = new Finish(
      COORDSORTIEX,
      COORDSORTIEY
    ); //on rajoute la sortie pour etre sur de pas créer une erreur
    game.players[0].cardsInHand.push(new Reveal(1200));
    try {
      game.updateGame(move2);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe(
          "Le télétravailleur ne peut pas utiliser de révélation si il a un outil cassé."
        );
        expect(game.currentPlayer).toBe(0);
      }
    }
  });
  test("collapse should not work if teleworker has a broken tool", () => {
    //cas éboulement non valable
    let move3 = new Move();
    move3.moveRevealCollapseInit(1200, game.currentPlayer, 1, 1);
    game.players[0].drawSubPlayer(new Collapse(1200));
    //cas ou on joue l'eboulement
    game.gameBoard.tab[1][1] = new Path(1300, false, true, true, true, true); //on ajoute une carte a l'endroit de l'eboulement
    try {
      game.updateGame(move3);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe(
          "Le télétravailleur ne peut pas utiliser d'éboulement si il a un outil cassé."
        );
        expect(game.currentPlayer).toBe(0);
      }
    }
  });
  test("Teleworker is supposed to cannot use malus when he has a broken tool", () => {
    game.players[0].drawSubPlayer(new Bonus(101, true, true, false, false)); // on distribue un malus au joueur
    let move5 = new Move(); //target = id du joueur 1
    move5.moveBonusInit(101, game.currentPlayer, 1, false, false, true);
    game.gameBoard.tab[1][1] = new Path(1300, false, true, true, true, true); //on ajoute une carte a l'endroit de l'eboulement
    try {
      game.updateGame(move5);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe(
          "Le télétravailleur ne peut pas utiliser de  carte bonus ou Malus si il a un outil cassé."
        );
        expect(game.currentPlayer).toBe(0);
      }
    }
  });
  test("Even with a broken tool, Teleworker is supposed to be able to use a path", () => {
    //game.players[game.currentPlayer].pickaxe = false;
    let move15 = new Move();
    move15.movePathInit(2001, game.currentPlayer, 3, 2, false);
    game.players[game.currentPlayer].drawSubPlayer(
      new Path(2001, false, true, true, true, true)
    );
    expect(game.updateGame(move15)).toBe(0);
    expect(game.gameBoard.tab[3][2].cardId).toBe(2001);
  });
});

describe("Function updateGame with Debrouillard", () => {
  let game = new Game([0, 1, 2]);
  game.players[0] = new Debrouillard(0);
  game.dealCards(game.deck);
  let card = new Card(1000);
  game.players[0].cardsInHand[0] = card;
  game.currentPlayer = 0;
  let move = new Move();
  move.cardId = 1000;
  move.playerId = game.currentPlayer;
  move.target = "Power";

  let handTemp: Card[];
  let current;
  test("debrouillard can use his power when it's his turn", () => {
    game.updateGame(move);
    expect(game.currentPlayer).toBe(0);
    expect(game.players[0].cardsInHand[0]).not.toBe(card);
  });
  test("debrouillard can discard without use his power when it's his turn", () => {
    move.target = "Discard";
    game.players[0].cardsInHand[0] = card;
    game.updateGame(move);
    expect(game.currentPlayer).toBe(1);
    expect(game.players[0].cardsInHand[0]).not.toBe(card);
  });
  test("debrouillard can't discard when he use his power when it isn't his turn", () => {
    game.players[0].cardsInHand[0] = card;
    expect(game.currentPlayer).toBe(1);
    try {
      game.updateGame(move);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe("Ce n'est pas a votre tour de jouer");
      }
    }
    expect(game.currentPlayer).toBe(1);
    expect(game.players[0].cardsInHand[0]).toBe(card);
  });
  test("debrouillard can finish game when it's his turn and use his power to empty the deck", () => {
    let game1 = new Game([0, 1, 2]);
    game1.players[0] = new Debrouillard(0);
    game1.players[0].drawSubPlayer(card);
    game1.deck.tab = [];
    game1.deckSize = 0;
    game1.currentPlayer = 0;
    move.target = "Power";
    game1.updateGame(move);
    expect(game1.winner).toBe(SABOTEURCONST);
  });
});
