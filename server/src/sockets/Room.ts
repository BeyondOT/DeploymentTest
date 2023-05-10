import {
  ICallbackObject,
  IEnd,
  IInitialSend,
  ILobbyInfos,
  IMessage,
  IMove,
  MainPlayer,
} from "@shared/socket";
import { Server } from "socket.io";
import { Card } from "../game/classes/Card/Card";
import { Player } from "../game/classes/Player/Player";
import { delay } from "../utils/utils";
import { GameEngineManager } from "./GameEngineManager";
import { SocketPlayer } from "./SocketPlayer";

export interface ChatMessage {
  sender: string;
  receiver: string;
  body: string;
}

export class Room {
  private name: string;
  private maxSize: number;
  private players: Map<string, SocketPlayer> = new Map();
  private saboteurs_l: SocketPlayer[] = [];
  private gameManager: GameEngineManager;
  public io: Server;
  private n_ia: number;
  private testGame: boolean;
  public gameMode: string;

  constructor(
    name: string,
    maxSize: number,
    io: Server,
    gameMode: string,
    testGame = false,
    n_ia?: number
  ) {
    this.name = name;
    this.maxSize = maxSize;
    this.gameManager = new GameEngineManager();
    this.io = io;
    this.n_ia = n_ia == undefined ? 0 : n_ia;
    if (this.n_ia > maxSize - 1) this.n_ia = maxSize - 1;
    this.testGame = testGame;
    this.gameMode = gameMode;
  }

  /** Ajoute un joueur à la partie et la démarre lorsqu'elle peut commencer. */
  public join(player: SocketPlayer): Error | void {
    // Check if room is full
    if (this.roomFull()) {
      console.log("Error: La room est pleine");
      throw new Error("Error: La room est pleine.");
    }

    // Add the new player to the players map
    player.setInGameId(this.players.size);
    let name: string = player.getPseudo();

    // If player has no name we put a name for him
    if (!name) {
      name = `UnNamed ${this.players.size}`;
      player.setPseudo(name);
    }
    // If the name already exists we add a number to it
    if (this.players.has(name)) {
      name = `${name} ${this.players.size}`;
      player.setPseudo(name);
    }

    this.players.set(name, player);

    // join the room
    player.getSocket().join(this.name);
    console.log(player.getPseudo() + " a rejoint la room " + this.name);
    console.log("The room has currently : " + this.players.size + " players");

    /* Gérer le mouvement et les messages du joueur */
    this.setupEventListeners(player);

    this.launchGame(player.getPseudo(), true);
  }

  /** Mise en place des listeners du joueur. */
  public setupEventListeners(player: SocketPlayer): void {
    this.coupEventListener(player);
    this.messageEventListener(player);
  }

  /** 
   * Ecoute sur la socket l'évènement playerPlayed. 
   * Lorsqu'il est reçu la partie est mise à jour, les données sont envoyées
   * aux joueurs et soit le round se termine soit les IA jouent.
   */
  public coupEventListener(player: SocketPlayer): void {
    player.getSocket().on("playerPlayed", (move: IMove, callback) => {
      move.playerId = player.getInGameId();
      // On update le game state
      try {
        let fin_round: boolean = this.gameManager.update(move);

        this.sendPlayersData();

        // Si la manche se termine
        if (fin_round) {
          this.newRound(this.gameManager.getEndInfo());
        } else {
          this.playIA();
          // Si c'est la partie de test, les IA font des discards
          if (this.testGame) {
            this.testGameAIMove();
          }
        }

        callback({
          status: "ok",
        });
      } catch (error) {
        // console.log(error);
        if (error instanceof Error) {
          const callbackObjet: ICallbackObject = {
            status: "failed",
            message: error.message,
          };
          callback(callbackObjet);
          return;
        }
      }
    });
  }

  /**
   * Ecoute sur la socket l'évènement sendChatMessage.
   * Lorsqu'il est reçu l'on vérifie que les champs sont bien remplis et si 
   * c'est le cas le message est retransmis au destinataire.
   */
  public messageEventListener(player: SocketPlayer): void {
    player.getSocket().on("sendChatMessage", (msg: IMessage, callback) => {
      console.log("J'ai reçu" + msg);
      let sent: boolean = false;
      let error_msg: string = "";

      if (msg.from === "") {
        error_msg = "sender is missing";
      } else if (msg.body === "") {
        error_msg = "body is missing";
      } else {
        switch (msg.to) {
          case "all":
            this.io.to(this.name).emit("receiveChatMessage", msg);
            sent = true;
            break;
          case "saboteur":
            if (this.isSaboteur(player)) {
              this.saboteurs_l.forEach((sab) => {
                sab.getSocket().emit("receiveChatMessage", msg);
              });
              sent = true;
            } else {
              error_msg = "sender is not saboteur";
            }
            break;
          default:
            let dst: SocketPlayer = this.players.get(msg.to)!;
            if (dst != undefined) {
              dst.getSocket().emit("receiveChatMessage", msg);
              sent = true;
            } else {
              error_msg = "player doesn't exist";
            }
            break;
        }
      }

      if (sent) {
        callback({
          status: "ok",
        });
      } else {
        callback({
          status: "failed",
          message: error_msg,
        });
      }
    });
  }

  /** Envoi des informations du jeu à tout le monde. */
  public sendPlayersData(): void {
    this.players.forEach((player) => {
      player
        .getSocket()
        .emit("updatePlayerState", this.gameManager
          .getPlayerInfos(player.getInGameId()));
    });

    this.io.to(this.name)
      .emit("updateGameState", this.gameManager.getGameState());
  }

  /** Envoie deux discards au game engine pour simuler des joueurs. */
  private async testGameAIMove(): Promise<void> {
    if (this.gameManager.gameIsOn()) {
      // Move layout
      let discardMove: IMove = {
        cardId: 0,
        playerId: 1,
        target: "Discard",
      };

      // Tour des IA
      for (let i = 1; i <= 2; i++) {
        discardMove.playerId = i;
        let card: Card | undefined =
          this.gameManager.getFirstCard(i);
        if (card != undefined) {
          discardMove.cardId = card.cardId;
          try {
            // update
            this.gameManager.update(discardMove);
            // mise à jour front au bout d'1/2s
            setTimeout(() => {
              this.sendPlayersData();
            }, 500);
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log("Pas de cartes à jouer");
        }
        await delay(500);
        if (card != undefined) {
          discardMove.cardId = card.cardId;
          try {
            // update
            this.gameManager.update(discardMove);
            // mise à jour front au bout d'1/2s
            setTimeout(() => {
              this.sendPlayersData();
            }, 500);
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log("Pas de cartes à jouer");
        }
        await delay(500);
      }
    } else {
      console.log("La partie n'a pas encore commencé");
    }
  }

  /** Vérifie si des IA doivent jouer et les fait jouer le cas échéant. */
  private async playIA(): Promise<void> {
    let p: number = this.gameManager.getCurPlayer();
    let manche_finie: boolean = false;
    //this.gameManager.dispSabInfos();
    while (this.gameManager.isIA(p) && !manche_finie) {
      try {
        // L'IA joue.
        let fin_round: boolean = this.gameManager.update(
          {} as IMove,
          this.gameManager.getIA(p)!
        );

        // Envoie aux joueurs humains des infos.
        setTimeout(() => {
          this.sendPlayersData();
        }, 750);

        // On vérifie si le round est terminé.
        if (fin_round) {
          this.newRound(this.gameManager.getEndInfo());
          manche_finie = true;
        } else {
          await delay(750);
        }
      } catch (error) {
        console.log(error);
      }

      p = this.gameManager.getCurPlayer();
    }
  }

  /**
   * Retire un joueur de la partie et si la partie peut continuer (encore des 
   * joueurs humains), le joueur est remplacé par une IA, sinon la partie est
   * arrêtée. 
   * @param player Le SocketPlayer à retirer.
   * @returns true si la partie a été arrêtée, false sinon.
   */
  public removePlayer(player: SocketPlayer): boolean {
    const name: string = player.getPseudo();
    const id: number = player.getInGameId();
    if (this.players.delete(name)) 
      console.log(name + " has left room " + this.name);
    if (this.players.size == 0) {
      this.gameManager.end();
      console.log("Room " + this.name + ": partie arrêtée");
      return true;
    } else {
      this.n_ia++;
      if (this.gameManager.gameIsOn()) {
        this.gameManager.addIA(id);
        this.playIA();
      } else {
        this.launchGame(name, false);
      }
      return false;
    }
  }

  /** 
   * Envoie les infos du lobby au front en attendant que tout le monde arrive.
   * Lorsque tout le monde est là la partie commence.
   */
  private launchGame(name: string, add: boolean): void {
    // setting lobby infos
    if (this.testGame) {
      this.gameManager.initGameTest(this.gameMode);
      console.log("la partie commence");
      setTimeout(() => this.sendPlayersData(), 2000);
      return;
    }

    let data: ILobbyInfos = {} as ILobbyInfos;
    data.players = [];
    data.roomCurrentSize = this.players.size;
    data.roomMaxSize = this.maxSize;
    this.players.forEach((p) => {
      data.players.push(p.getPseudo());
    });
    data.info = name + " has ";
    if (add) {
      data.info += "joined ";
    } else {
      data.info += "left ";
    }
    data.info += "the party.";

    this.io.to(this.name).emit("lobbyInfos", data);
    // If the players are all there start the game
    if (this.roomFull()) {
      // Start the game.
      this.gameManager.init(this.players, this.gameMode, this.n_ia);
      console.log("la partie commence");
      // Sending initial infos to each players
      let initialSend: IInitialSend = {
        mainPlayer: {} as MainPlayer,
        gameState: this.gameManager.getGameState(),
      };
      this.players.forEach((p) => {
        initialSend.mainPlayer = this.gameManager.getPlayerInfos(p.getInGameId());
        p.getSocket().emit("gameBegins", initialSend);
      });
    }
  }

  /** Commence un nouveau round. */
  private async newRound(state: IEnd): Promise<void> {
    this.io.emit("endOfRound", state);
    // Si la partie n'est pas finie
    if (!state.game_over) {
      console.log("nouveau round");
      setTimeout(() => {
        this.gameManager.reinitGame();
        this.sendPlayersData();
        this.playIA();
        // Si c'est la partie de test, les IA font des discards
        if (this.testGame) {
          this.testGameAIMove();
        }
      }, 750);
      await delay(750);
    }
  }

  /** Retourne le nom de la room. */
  public getName(): string {
    return this.name;
  }
  /** Retourne la taille de la room. */
  public getMaxSize(): number {
    return this.maxSize;
  }
  /** Retourne les joueurs dans la room. */
  public getPlayers(): Map<string, SocketPlayer> {
    return this.players;
  }
  /** Vérifie si la room est pleine. */
  public roomFull(): boolean {
    return this.players.size > this.maxSize - (this.n_ia + 1);
  }
  /** Vérifie si le SocketPlayer est un saboteur (*pour le chat saboteur). */
  private isSaboteur(player: SocketPlayer): boolean {
    let res: boolean = false;
    this.saboteurs_l.forEach((sab) => {
      if (sab.getPseudo() === player.getPseudo()) {
        res = true;
      }
    });
    return res;
  }

  // Only for testing
  /** Retourne le gameManager */
  public getGameManager(): GameEngineManager {
    return this.gameManager;
  }
  /** Modifie la liste des saboteurs. */
  public setSaboteurs_l(socketArray: SocketPlayer[]): void {
    this.saboteurs_l = socketArray;
  }
}
