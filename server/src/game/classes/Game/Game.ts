import { randomInt } from "crypto";
import { Board } from "../Board/Board";
import { Bonus } from "../Card/Bonus";
import { Card } from "../Card/Card";
import { Collapse } from "../Card/Collapse";
import {
  BONUSPICK,
  Deck,
  IDBONUSPICK,
  IDCOLLAPSE,
  IDCROSS,
  IDEASTWEST,
  IDNORTHEAST,
  IDNORTHEASTWEST,
  IDNORTHSOUTH,
  IDREVEAL,
  IDSOUTHEAST,
  IDSOUTHEASTNORTH,
} from "../Deck/Deck";
import { CONSTDISCARD, Move } from "../Move/Move";
import { Path } from "../Card/Path";
import { Player } from "../Player/Player";
import { Reveal } from "../Card/Reveal";
import { Deadline } from "../Card/Deadline";
import { Teletravailleur } from "../Player/teletravailleur";
import { Admin } from "../Player/admin";
import { Briseur } from "../Player/briseur";
import { Fixeur } from "../Player/fixeur";
import { Hackeur } from "../Player/hackeur";
import { errorMonitor } from "events";
import { Debrouillard } from "../Player/debrouillard";
import { IMove, Tools } from "@shared/socket";
import { LockPort } from "../Card/LockPort";

export const MINEURSCONST = 1;
export const SABOTEURCONST = 2;
export class Game {
  public deckSize: number; //taille du deck
  public winner: number; //gagnant de la partie , 0 si partie en cours
  public currentPlayer: number; //Joueur qui doit jouer
  public gameBoard: Board;
  public rolesMinerList: string[]; //Liste des rôles mineurs
  public rolesSaboteurList: string[]; //Liste des rôles saboteurs
  public players: Player[];
  public manche: number; //Numéro de la manche actuelle
  public deck: Deck = new Deck();
  public discardDeck: Deck = new Deck();

  public constructor(playersId: number[]) {
    this.rolesMinerList = ["Fixeur", "Briseur", "Debrouillard", "Admin"]; //Ajouter ici Roles Miners : "Role"
    this.rolesSaboteurList = ["Fixeur", "Briseur", "Debrouillard", "Admin"]; //Ajout ici Roles saboteurs : "Role"
    this.winner = 0;
    this.currentPlayer = 0;
    this.gameBoard = new Board();
    this.manche = 1;
    this.players = [];
    this.deck.initDeck();
    this.deckSize = this.deck.tab.length;
    //on utilise shuffle pour mélanger dans startGame, pas ici pour permettre startGameConst()

    playersId.forEach((playerId) => {
      let newPlayer = new Player(playerId);
      this.players.push(newPlayer);
    });
  }
  //                CHECK

  public checkTurn(idPlayer: number) {
    if (this.players[this.currentPlayer].playerId == idPlayer) {
      return true;
    } else {
      throw new Error("Ce n'est pas a votre tour de jouer");
      return false;
    }
  }

  //Renvoie true si on peut piocher, false sinon
  public checkDraw(deck: Deck): boolean {
    return !deck.emptyDeck(); //Vérifie juste si le deck est vide
  }
  //Renvoie true si le joueur peut défausser, false sinon
  public checkDiscard(player: Player, card: Card): boolean {
    return player.checkOwner(card.cardId); //Vérifie que le joueur a la carte
  }

  public checkReveal(coordX: number, coordY: number): boolean {
    let revealOk: boolean = false;
    if (this.gameBoard.checkRevealSubBoard(coordX, coordY)) {
      if (this.players[this.currentPlayer].checkRevealSubPlayer(coordX, coordY))
        revealOk = true;
    }
    return revealOk;
  }
  //Vérifie que le joueur visé par l'action est valide (id dans la partie)
  public checkTargetPlayer(playerId: number) {
    return 0 <= playerId && playerId < this.players.length;
  }

  //                END CHECK

  // Get the current player
  public getCurrentPlayer(): number {
    return this.currentPlayer;
  }

  public getDeck(): Deck {
    return this.deck;
  }

  //Distribue les cartes
  public dealCards(deck: Deck): void {
    let nbPlayers: number = this.players.length;
    let nbCardsDeal: number = 0; //Nombre de cartes à distribuer
    //on définit le nombre de cartes à distribuer selon le nombre de joueur
    if (3 <= nbPlayers && nbPlayers <= 5) {
      nbCardsDeal = 6;
    } else if (6 <= nbPlayers && nbPlayers <= 7) {
      nbCardsDeal = 5;
    } else if (8 <= nbPlayers && nbPlayers <= 10) {
      nbCardsDeal = 4;
    }
    //Pour chaque joueur, pioche (appel draw()) nbCardsDeal cartes puis fais de même au suivant
    this.players.forEach((player) => {
      for (let cardsDealt = 0; cardsDealt < nbCardsDeal; cardsDealt++) {
        this.draw(deck, player);
      }
    });
  }
  //Le joueur player pioche une carte
  public draw(deck: Deck, player: Player): void {
    if (!this.deck.emptyDeck()) {
      this.deckSize--; //on diminue la taille du deck
      let cardDrawn: Card = deck.drawSubDeck(); //on appelle draw() dans Deck (qui s'occupe des modifications au niveau du deck)
      player.drawSubPlayer(cardDrawn); //on appelle draw() dans Player (qui s'occupe des modifications au niveau de player)
    }
  }
  //Le joueur player se défausse d'une carte cardDiscard
  public discard(player: Player, cardDiscard: Card): void {
    //On ajoute la carte à la défausse
    this.discardDeck.tab.push(cardDiscard);
    //On enlève la carte de la main du joueur
    this.removeCard(player, cardDiscard);
  }
  //Enlève complètement une carte d'un joueur (carte Deadline)
  public removeCard(player: Player, cardDiscard: Card): void {
    player.discardSubPlayer(cardDiscard); //On fait les modifications de la défausse au niveau de player
  }
  //Utilise la carte Deadline (ajout de carte ou retrait de cartes de la pioche)
  public useDeadlineCard(player: Player, cardDeadline: Deadline): void {
    const increase = cardDeadline.increase;
    let nbCards: number = cardDeadline.numberOfCards;
    let deckSize: number = 0;
    let deckToTakeFrom: Deck;
    let deckToAddTo: Deck;
    //Si on rajoute des cartes dans la pioche
    if (increase) {
      deckSize = this.discardDeck.tab.length;
      //Nombre de cartes max ajoutable
      nbCards = nbCards > deckSize ? deckSize : nbCards;
      this.deckSize += nbCards;
      deckToAddTo = this.deck;
      deckToTakeFrom = this.discardDeck;
    }
    //Si on enlève des cartes dans la pioche
    else {
      deckSize = this.deck.tab.length;
      //Nombre de cartes max enlevables
      nbCards = nbCards > deckSize ? deckSize : nbCards;
      this.deckSize -= nbCards;
      deckToAddTo = this.discardDeck;
      deckToTakeFrom = this.deck;
    }
    //On ajoute les cartes
    for (let i = 0; i < nbCards; i++) {
      deckToAddTo.tab.push(deckToTakeFrom.drawSubDeck());
    }
  }

  //Renvoie le prochain joueur
  public nextPlayer() {
    return (this.currentPlayer + 1) % this.players.length;
  }
  // End the current player's turn and move to the next player
  public endTurn(): void {
    this.currentPlayer = this.nextPlayer();
    if (this.players[this.currentPlayer].emptyHand()) {
      if (this.checkDraw(this.deck)) {
        this.draw(this.deck, this.players[this.currentPlayer]);
      }
      this.endTurn();
    }
  }

  //Renvoie un tableau de booléens, si tab[i] vaut true, joueur[i] est saboteur, sinon il est mineur
  //pour 3 ou 4 joueurs= 1 saboteurs dans le tirage
  //5 6 joueurs=2 saboteurs
  //7 8 9 o joueurs  =3 saboteurs
  public getRoles(): boolean[] {
    //renvoie un tableau contenant des booléens tirés aléatoirement
    let nbJoueurs = this.players.length;
    nbJoueurs++; //on rajoute une valeur car il peut y avoir une partie sans saboteur,
    //on tire aléatoirement et il restera une carte assignée a aucun joueur
    let tab: boolean[] = [];
    for (let i = 0; i < nbJoueurs; i++) {
      //tout le monde est mineur
      tab[i] = false;
    }
    //3 ou 4 joueurs
    if (nbJoueurs <= 4) {
      //un seul saboteur
      let i = randomInt(nbJoueurs);
      if (tab[i] == true) {
        //on vérifie qu'on assigne pas une case déja saboteur
        while (tab[i] == true) {
          //tant que case déja saboteur on regenère
          i = randomInt(nbJoueurs);
        }
      }
      tab[i] = true;
    }
    //5 ou 6 joueurs
    if (nbJoueurs == 5 || nbJoueurs == 6) {
      //deux saboteurs
      for (let j = 0; j < 2; j++) {
        let i = randomInt(nbJoueurs);
        if (tab[i] == true) {
          //on vérifie qu'on assigne pas une case déja saboteur
          while (tab[i] == true) {
            i = randomInt(nbJoueurs);
          }
        }
        tab[i] = true;
      }
    }
    //7 joueurs ou plus
    if (nbJoueurs > 7) {
      for (let j = 0; j < 3; j++) {
        let i = randomInt(nbJoueurs);
        if (tab[i] == true) {
          //on vérifie qu'on assigne pas une case déja saboteur
          while (tab[i] == true) {
            i = randomInt(nbJoueurs);
          }
        }
        tab[i] = true;
      }
    }
    //puis on enlève une des valeurs
    tab.splice(randomInt(nbJoueurs), 1);
    return tab;
  }

  // Init players in Array of players
  public initPlayers(): void {
    const nbrPlayers: number = this.players.length;
    const tabMinersId: number[] = [];
    const tabSaboteursId: number[] = [];
    const copyRolesMinerList: string[] = [...this.rolesMinerList];
    const copyRolesSaboteurList: string[] = [...this.rolesSaboteurList];
    let tab: boolean[] = this.getRoles(); //Tableau où true représentera un saboteur, false un mineur
    let tabMiner: number[] = []; //Liste des indices des mineurs
    let tabSaboteur: number[] = []; //Liste des indices des saboteurs
    //On initialise les joueurs classiques
    for (let pas = 0; pas < nbrPlayers; pas++) {
      this.players[pas].saboteur = tab[pas];
      if (this.players[pas].saboteur) tabSaboteursId.push(pas);
      else tabMinersId.push(pas);
    }
    //Tant qu'il reste des mineurs sans rôles spéciaux ou des rôles à donner
    //On attribue des rôles spéciaux aux mineurs sans rôles spéciaux
    while (tabMinersId.length != 0 && copyRolesMinerList.length != 0) {
      //On récupère un rôle aléatoire
      let randIndiceRole: number = randomInt(copyRolesMinerList.length);
      //On récupère un joueur aléatoire
      let randIndicePlayer: number = randomInt(tabMinersId.length);
      //On initialise le rôle pour le joueur
      this.initRole(
        tabMinersId[randIndicePlayer],
        copyRolesMinerList[randIndiceRole]
      );
      //On supprime le rôle de la liste des rôles disponibles
      copyRolesMinerList.splice(randIndiceRole, 1);
      //On retire le joueur de la liste des joueurs sans rôles spéciaux
      tabMinersId.splice(randIndicePlayer, 1);
    }

    //Tant qu'il reste des saboteurs sans rôles spéciaux ou des rôles à donner
    //On attribue des rôles spéciaux aux saboteurs sans rôles spéciaux
    while (tabSaboteursId.length != 0 && copyRolesSaboteurList.length != 0) {
      //On récupère un rôle aléatoire
      let randIndiceRole: number = randomInt(copyRolesSaboteurList.length);
      //On récupère un joueur aléatoire
      let randIndicePlayer: number = randomInt(tabSaboteursId.length);
      //On initialise le rôle pour le joueur
      this.initRole(
        tabSaboteursId[randIndicePlayer],
        copyRolesSaboteurList[randIndiceRole]
      );
      //On supprime le rôle de la liste des rôles disponibles
      copyRolesSaboteurList.splice(randIndiceRole, 1);
      //On retire le joueur de la liste des joueurs sans rôles spéciaux
      tabSaboteursId.splice(randIndicePlayer, 1);
    }
  }
  public initRole(playerIndice: number, role: string) {
    let currentPlayer: Player = this.players[playerIndice];
    let currentPlayerId: number = currentPlayer.playerId;
    let newRole;
    switch (role) {
      case "Admin":
        newRole = new Admin(currentPlayerId);
        break;
      case "Hacker":
        newRole = new Hackeur(currentPlayerId);
        break;
      case "Fixeur":
        newRole = new Fixeur(currentPlayerId);
        break;
      case "Briseur":
        newRole = new Briseur(currentPlayerId);
        break;
      case "Debrouillard":
        newRole = new Debrouillard(currentPlayerId);
        break;
      case "Teletravailleur":
        newRole = new Teletravailleur(currentPlayerId);
        break;
      //Ne devrait pas arriver
      default:
        newRole = new Player(currentPlayerId);
    }
    newRole.copyPlayer(currentPlayer);
    newRole.saboteur = currentPlayer.saboteur;
    this.players[playerIndice] = newRole;
  }

  // share gold to miners
  public minersWin(): void {
    let gold: number[] = [];
    for (let i = 0; i < this.players.length; i++) {
      //current player doit prendre 3 golds
      let random: number = randomInt(1, 4);
      if (!this.players[i].saboteur) {
        // si les joueurs sont mienurs
        if (this.currentPlayer == this.players[i].playerId) {
          this.players[i].goldAmount += 3; // le currentplayer (celui qui a gagné) touche 3 golds obligatoirement
        } else {
          this.players[i].goldAmount += random; // si il n'est pas le gagnant il aura un nombre aleatoire
        }
      }
    }
  }

  // share gold to saboteurs
  public saboteursWin(): void {
    let goldToGive: number = 0;
    let saboteursCount: number = 0;
    this.players.forEach((element) => {
      //on compte le nombre de saboteurs
      if (element.saboteur) {
        saboteursCount++;
      }
    });
    if (saboteursCount == 1) {
      // en fonction du nombre de saboteur on a une récompense fixe
      goldToGive = 4;
    } else if (saboteursCount == 2 || saboteursCount == 3) {
      goldToGive = 3;
    } else if (saboteursCount == 4) {
      goldToGive = 2;
    }
    this.players.forEach((element) => {
      if (element.saboteur) {
        // on distribue les golds à chaque saboteur
        element.goldAmount += goldToGive;
      }
    });
  }

  public emptyHands() {
    let bool = true;
    this.players.forEach((gamePlayers) => {
      if (!gamePlayers.emptyHand()) {
        bool = false;
      }
    });
    return bool;
  }

  //on fait a part l'initalisation des joueurs car il ne faudra pas la refaire a chaque round
  //alors que startGame si, pour remettre a 0 le board, l'or, les mains etc
  public startGame() {
    //il faudra appeler new game a part car dans classe game
    this.manche++;
    this.players.forEach((element) => element.nextGame()); //on remets chaque joueur a zéro
    this.players.forEach((element) => (element.cardsInHand = []));
    this.players.forEach((element) => (element.handSize = 0));
    this.initPlayers();
    //this.deckSize = this.deck.tab.length;
    this.winner = 0;
    this.currentPlayer = 0;
    this.gameBoard = new Board();
    this.deck = new Deck();
    this.discardDeck = new Deck();
    this.deck.initDeck();
    this.deckSize = this.deck.tab.length;

    this.deck.shuffle();
    this.dealCards(this.deck);
  }

  public startGameConst() {
    //il faudra appeler new game a part car dans classe game
    //permet d'avoir toujours la même partie, pour debug
    //seul le premier joueur est un saboteur
    //chaque joueur recoit 6 cartes les plus variées possibles pour le débug, toujours les mêmes
    if (this.players.length > 3) {
      //on enleve les autres joueurs, on ne garde que les trois premiers (0,1,2)
      this.players.splice(3, this.players.length - 3);
    }
    this.manche++;
    this.players.forEach((element) => element.nextGame()); //on remets chaque joueur a zéro
    this.players.forEach((element) => (element.cardsInHand = []));
    this.players.forEach((element) => (element.handSize = 0));
    let saboteur: boolean[] = [];
    this.initPlayers();
    this.players.forEach((element) => saboteur.push(false));
    saboteur[0] = true;
    this.players.forEach(
      (element, index) => (element.saboteur = saboteur[index])
    );
    this.deckSize = this.deck.tab.length;
    this.winner = 0;
    this.currentPlayer = 0;
    this.gameBoard = new Board();
    this.deck = new Deck();
    this.deck.initDeck();
    //première carte de chaque joueur
    //premier joueur aura une carte SOUTHEASTNORTH
    this.draw(this.deck, this.players[0]);

    //on déplace les cartes a la fin du deck jusqu'a recontrer un nouveau type
    this.deck.shiftToType(IDSOUTHEAST);
    //le joueur 1 pioche une carte SOUTHEAST
    this.draw(this.deck, this.players[1]);

    //le joueur 2 pioche une carte NORTHEAST
    this.deck.shiftToType(IDNORTHEAST);
    this.draw(this.deck, this.players[2]);

    //deuxieme carte de chaque joueur
    //le joueur 0 pioche une carte NORTHEASTWEST
    this.deck.shiftToType(IDNORTHEASTWEST);
    this.draw(this.deck, this.players[0]);

    //le joueur 1 pioche une carte EASTWEST
    this.deck.shiftToType(IDEASTWEST);
    this.draw(this.deck, this.players[1]);

    //le joueur 2 pioche une carte NORTHSOUTH
    this.deck.shiftToType(IDNORTHSOUTH);
    this.draw(this.deck, this.players[2]);

    //troisieme carte
    //chaque joueur pioche un carte en croix
    this.deck.shiftToType(IDCROSS);
    this.players.forEach((element) => this.draw(this.deck, element));

    //quatrième carte deux bonus pick pour 0 et 1  un malus pick pour 2
    // seulement deux cartes bonusPick donc un joueur aura un MalusPick
    this.deck.shiftToType(IDBONUSPICK);
    this.players.forEach((element) => this.draw(this.deck, element));

    //cinquième carte  un éboulement pour chacun
    this.deck.shiftToType(IDCOLLAPSE);
    this.players.forEach((element) => this.draw(this.deck, element));
    //sixème carte un reveal pour chacun
    this.deck.shiftToType(IDREVEAL);
    this.players.forEach((element) => this.draw(this.deck, element));

    //on équilibre le deck en espacant  les cartes de meme type

    this.deck.deckBalance();
  }

  //fonction utilisées dans update
  public getPremier(): number {
    let max: number = 0;
    let id_prem: number = -1;
    for (let i = 0; i < this.players.length; i++) {
      const qte = this.players[i].goldAmount;
      if (qte >= max) {
        max = qte;
        id_prem = i;
      }
    }
    return id_prem;
  }

  public updateGame(move: IMove) {
    let rtn: number = 0;
    //se mettre d'accord sur const discard
    let idPlayer = move.playerId;

    let removeCard: boolean = false; //true s'il faut supprimer la carte du jeu (pas vers défausse),false sinon
    //on vérifie que c'est le joueur dont c'est le tour qui joue
    if (this.checkTurn(idPlayer)) {
      if (move.target == "Power") {
        //si le joueur utilise son pouvoir, on l'applique
        this.casePower(move);
      } else {
        //on vérfie que le joueur a la carte en main
        let idCard = move.cardId as number;
        //on verifie le détenteur de la carte jouée
        if (this.players[idPlayer].checkOwner(idCard)) {
          let cardRank = this.players[idPlayer].cardRank(idCard); //on crée une variable qui sera le rang dans le tableau main du joueur de la carte
          //si discard on passe tout la partie qui joue la carte, on ne la joue pas et on la défausse comme si elle avait été jouée
          if (move.target !== "Discard") {
            //Cartes visant un joueur
            if (move.target == "Player") {
              //cas ou c'est une carte bonus ou malus
              this.caseBonus(move, idPlayer, cardRank);
              //cas ou c'est une carte deadline
              if (this.caseDeadline(move, idPlayer, cardRank))
                removeCard = true;
            }
            //Cartes visant le plateau
            else if (move.target == "Board") {
              let coordX: number = move.coordX as number;
              let coordY: number = move.coordY as number;
              //Si la carte vise le plateau, ses coords doivent etre dans le board
              if (this.gameBoard.checkCellInBoardMove(coordX, coordY)) {
                //cas ou c'est un éboulement
                this.caseCollapse(move, idPlayer, cardRank);
                //cas ou c'est une carte reveal
                this.caseReveal(move, idPlayer, cardRank);
                //cas ou c'est un chemin
                this.casePath(move, idPlayer, cardRank);
                //cas ou c'est un lock
                this.caseLock(move, idPlayer, cardRank);
              }
              //faire cas d'erreur pas in board
            }
          }
          //Si il faut supprimer la carte du jeu (pas vers la défausse) alors caseRemove
          //Sinon, on défausse la carte peu importe si elle a été jouée ou si elle est défaussée
          if (removeCard) this.caseRemove(idPlayer, cardRank);
          else this.caseDiscard(idPlayer, cardRank);
          //on vérifie si les saboteurs ont gagné
          this.caseSabWin();
          //on fait piocher le joueur et on termine le tour
          if (this.winner == 0) this.caseEndandDraw();
        } else {
          //cas ou le joueur joue une carte qui n'est pas dans sa main
          throw "card not in player hand";
        }
      }
    }
    return rtn;
  }

  //Case Actions
  public caseBonus(move: IMove, idPlayer: number, cardRank: number): boolean {
    //cas ou c'est une carte vision
    if (this.players[idPlayer].cardsInHand[cardRank] instanceof Bonus) {
      let targetPlayerId: number = move.targetPlayerId as number;
      let bonus = this.players[idPlayer].cardsInHand[cardRank] as Bonus;
      let targetTools: Tools = move.targetTool as Tools;
      //si c'est un Teletravailleur et qu'il a un objet cassé il n'as pas le droit de jouer
      if (
        this.players[idPlayer] instanceof Teletravailleur &&
        !this.players[idPlayer].checkAllTools()
      ) {
        throw new Error(
          "Le télétravailleur ne peut pas utiliser de  carte bonus ou Malus si il a un outil cassé."
        );
      } else {
        //sinon, c'est ou un jouer normal ou un Teletravailleur avec rien de cassé
        if (this.players[targetPlayerId].checkBonus(bonus, targetTools)) {
          this.players[targetPlayerId].applyBonus(bonus, targetTools); //on lui applique le bonus
          return true;
        }
        //cas ou bonus non valable sur cette cible
        else {
          throw new Error("erreur cible du bonus non valable");
        }
      }
    }
    return false;
  }

  public caseCollapse(
    move: IMove,
    idPlayer: number,
    cardRank: number
  ): boolean {
    // si c'est une carte eboulement
    if (this.players[idPlayer].cardsInHand[cardRank] instanceof Collapse) {
      let coordX: number = move.coordX as number;
      let coordY: number = move.coordY as number;
      if (!(this.players[idPlayer] instanceof Teletravailleur)) {
        //si c'est n'est pas un télétravailleur
        if (this.gameBoard.checkCollapse(coordX, coordY)) {
          //on vérifie que l'endroit d'éboulement est valable
          this.gameBoard.addCollapse(coordX, coordY); //on fait un éboulement
        }
        //cas ou coordonnées collapse pas valable erreur
        else {
          throw new Error("erreur coordonnées de l'éboulement non valables");
        }
      } else {
        //si c'est le télétravailleur qui utilise la collapse
        if (this.players[idPlayer].checkAllTools()) {
          // si ses outils sont en forme il peut utiliser éboulement
          if (this.gameBoard.checkCollapse(coordX, coordY)) {
            //on vérifie que l'endroit d'éboulement est valable
            this.gameBoard.addCollapse(coordX, coordY); //on fait un éboulement
          }
          //cas ou coordonnées collapse pas valable erreur
          else {
            throw new Error("erreur coordonnées de l'éboulement non valables");
          }
        } else {
          // si un (ou+) outil(s) du télétravailleurs sont cassés il peut pas utiliser l'éboulement
          throw new Error(
            "Le télétravailleur ne peut pas utiliser d'éboulement si il a un outil cassé."
          );
        }
      }
    }
    return false;
  }

  public caseDeadline(
    //cas ou c'est une carte deadline
    move: IMove,
    idPlayer: number,
    cardRank: number
  ): boolean {
    let player = this.players[idPlayer];
    let card = player.cardsInHand[cardRank];
    if (card instanceof Deadline) {
      //si c'est une carte deadline
      let deadlineCard = card as Deadline;
      if (!(player instanceof Teletravailleur) || player.checkAllTools()) {
        //si ce n'est pas un télétravailleur OU qu'il a tous ses outils il peut jouer la carte, on l'applique
        this.useDeadlineCard(player, deadlineCard);
        return true;
      }
      throw new Error(
        "Le télétravailleur ne peut pas utiliser de Deadline si il a un outil cassé."
      );
    }
    return false;
  }

  public caseReveal(move: IMove, idPlayer: number, cardRank: number): boolean {
    //cas pour les cartes reveal
    if (this.players[idPlayer].cardsInHand[cardRank] instanceof Reveal) {
      let coordX: number = move.coordX as number;
      let coordY: number = move.coordY as number;
      if (!(this.players[idPlayer] instanceof Teletravailleur)) {
        if (this.checkReveal(coordX, coordY)) {
          //on vérifie si les coordonnées sont valables
          this.players[idPlayer].applyReveal(this.gameBoard, coordX, coordY);
        }
        //cas ou reveal pas valable, erreur
        else {
          throw new Error("erreur coordonnées cibles de reveal non valables");
        }
      } else {
        if (this.players[idPlayer].checkAllTools()) {
          if (this.checkReveal(coordX, coordY)) {
            //on vérifie si les coordonnées sont valables
            this.players[idPlayer].applyReveal(this.gameBoard, coordX, coordY);
          }
          //cas ou reveal pas valable, erreur
          else {
            throw new Error("erreur coordonnées cibles de reveal non valables");
          }
        } else {
          throw new Error(
            "Le télétravailleur ne peut pas utiliser de révélation si il a un outil cassé."
          );
        }
      }
    }
    return false;
  }

  //Case Path
  public casePath(move: IMove, idPlayer: number, cardRank: number): boolean {
    if (this.players[idPlayer].cardsInHand[cardRank] instanceof Path) {
      if (
        this.players[idPlayer].checkAllTools() ||
        this.players[idPlayer] instanceof Teletravailleur
      ) {
        //si il a ses outils ou si c'est le télétravailleur, il peut jouer
        let path = this.players[idPlayer].cardsInHand[cardRank] as Path;
        if (move.flip) {
          //si l'utilisateur a flip la carte, on applique le flip
          path.flip();
        }
        let moveX: number = move.coordX as number;
        let moveY: number = move.coordY as number;
        if (this.gameBoard.checkPaths(path, moveX, moveY)) {
          //si le chemin est valable on l'ajoute au board
          this.gameBoard.addPath(path, moveX, moveY);
          if (this.gameBoard.updateDiscovered()) {
            //on retourne la carte charbon ou or si une autre carte est a coté, true si a retourné une carte false sinon
            //si c'est l'or qu'on a retourné
            if (this.gameBoard.checkGold()) {
              //l'or a été découvert
              this.minersWin(); //distribue les pépites
              this.winner = MINEURSCONST;
            }
          }
        }

        //cas ou le chemin n'est pas valable
        else {
          //on re flip le chemin car il n'as pas pu etre joué donc on le remets a ses anciennes valeurs
          if (move.flip) {
            path.flip();
          }
          throw new Error("erreur coordonées de chemin non valable");
        }
        return true;
      }
      throw new Error("Un de vos outils est cassé. Vous ne pouvez pas jouer.");
    }
    return false;
  }
  public caseLock(move: IMove, idPlayer: number, cardRank: number): boolean {
    let player = this.players[idPlayer];
    let card = player.cardsInHand[cardRank];
    let coordX = move.coordX as number;
    let coordY = move.coordY as number;
    if (card instanceof LockPort) {
      //si c'est une carte Lock
      let lockCard = card as LockPort;
      if (!(player instanceof Teletravailleur) || player.checkAllTools()) {
        //si ce n'est pas un télétravailleur OU qu'il a tous ses outils, il peut jouer la carte, on l'applique
        if (this.gameBoard.checkLock(lockCard.lock, coordX, coordY)) {
          this.gameBoard.applyLock(coordX, coordY);
          return true;
        } else {
          throw new Error(
            "Erreur, la carte LockPort ne peut pas être utilisée ici."
          );
        }
      }
      throw new Error(
        "Le télétravailleur ne peut pas utiliser de LockPort si il a un outil cassé."
      );
    }
    return false;
  }
  //Case Utilitaires
  public caseSabWin() {
    if (this.winner === 0) {
      //si la partie est toujours en cours
      if (this.deckSize <= 0 && this.emptyHands()) {
        //cas ou le deck et les mains sont vides, les saboteurs gagnent
        this.saboteursWin();
        this.winner = SABOTEURCONST;
      }
    }
  }

  public caseEndandDraw() {
    //termine le tour et fait piocher le joueur
    if (this.checkDraw(this.deck)) {
      this.draw(this.deck, this.players[this.currentPlayer]);
    }
    this.endTurn();
  }
  //Défausse la carte
  public caseDiscard(idPlayer: number, cardRank: number) {
    this.discard(
      this.players[idPlayer],
      this.players[idPlayer].cardsInHand[cardRank]
    ); //on retire la carte jouée
  }

  //Retire la carte du jeu (carte Deadline)
  public caseRemove(idPlayer: number, cardRank: number) {
    this.removeCard(
      this.players[idPlayer],
      this.players[idPlayer].cardsInHand[cardRank]
    );
  }

  //Case Rôles
  public casePower(move: IMove) {
    // aucun joueur ne pose de chemin donc pas la peine de vérif mineurs win
    //aucun joueur ne défausse de carte sans en repiocher donc pas la peine de vérifier mineurswin
    //on vérifie que l'utilisateur a fait son pouvoir
    const curPlayer: Player = this.players[move.playerId];
    let idCard: number = move.cardId as number;
    if (curPlayer.powerLeft == 0) {
      throw new Error("Pouvoir déja utilisés, plus utilisables");
    }
    //let powerApplied: boolean = false; //vrai quand on a pas encore appliqué le pouvoir ce tour, faux empeche de parcourir plusieurs if
    if (this.caseAdmin(move.targetPlayerId!, curPlayer)) {
    } else if (
      this.caseBriseur(move.targetPlayerId!, curPlayer, move.targetTool!)
    ) {
    } else if (
      this.caseFixeur(move.targetPlayerId!, curPlayer, move.targetTool!)
    ) {
    } else if (this.caseHacker(move.targetPlayerId!, curPlayer)) {
    } else if (this.caseDebrouillard(idCard, curPlayer)) {
    }
    //teletravailleur déja integré a caseBonus et casePath donc pas a mettre ici
    else {
      throw new Error("Le rôle ne possède pas de pouvoirs, appel erroné");
    }
  }
  public caseAdmin(targetPlayerId: number, curPlayer: Player): boolean {
    if (curPlayer instanceof Admin) {
      let playerTemp: Admin = curPlayer as Admin; //passage par reference donc modifie le player dans game
      if (playerTemp.power(this.players[targetPlayerId])) {
        return true;
      } else {
        throw new Error("pouvoir non valable");
      }
    }
    return false;
  }

  public caseBriseur(
    targetPlayerId: number,
    curPlayer: Player,
    targetTool: Tools
  ): boolean {
    if (curPlayer instanceof Briseur) {
      let playerTemp: Briseur = curPlayer as Briseur; //passage par reference donc modifie le player dans game
      if (
        playerTemp.power(
          this.players[targetPlayerId],
          targetTool.pickaxe,
          targetTool.cart,
          targetTool.lantern
        )
      ) {
        return true;
      } else {
        throw new Error("pouvoir non valable");
      }
    }
    return false;
  }

  public caseFixeur(
    targetPlayerId: number,
    curPlayer: Player,
    targetTool: Tools
  ): boolean {
    if (curPlayer instanceof Fixeur) {
      let playerTemp: Fixeur = curPlayer as Fixeur; //passage par reference donc modifie le player dans game
      if (
        playerTemp.power(
          this.players[targetPlayerId],
          targetTool.pickaxe,
          targetTool.cart,
          targetTool.lantern
        )
      ) {
        return true;
      } else {
        throw new Error("pouvoir non valable");
      }
    }
    return false;
  }

  public caseHacker(targetPlayerId: number, curPlayer: Player): boolean {
    if (curPlayer instanceof Hackeur) {
      let playerTemp: Hackeur = curPlayer as Hackeur; //passage par reference donc modifie le player dans game
      if (playerTemp.power(this.players[targetPlayerId], this.players)) {
        return true;
      } else {
        throw new Error("pouvoir non valable");
      }
    }
    return false;
  }

  public caseDebrouillard(cardId: number, curPlayer: Player): boolean {
    if (curPlayer instanceof Debrouillard) {
      let playerTemp: Debrouillard = curPlayer as Debrouillard; //passage par reference donc modifie le player dans game
      //Si le joueur a bien la carte en main
      if (curPlayer.checkOwner(cardId)) {
        //on effectue les actions ici, defausse une de ses cartes pour piocher une autre sans passer son tour
        let cardRank = curPlayer.cardRank(cardId);
        curPlayer.power(); //Décrémente juste powerLeft du joueur
        this.discard(
          //on défausse la carte
          curPlayer,
          curPlayer.cardsInHand[cardRank]
        );
        //Si on peut piocher, on pioche
        if (this.checkDraw(this.deck))
          this.draw(this.deck, curPlayer); //il pioche
        else this.caseSabWin(); //Pioche vide, les saboteur ont peut être gagné
        return true;
      }
      //Sinon, erreur quand on pas la carte en main
      else {
        throw new Error("pouvoir non valable "); //défausse une carte qu'il n'as pas en main
      }
    }
    return false;
  }
}
