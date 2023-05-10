import {
  CardType,
  GameState,
  ICell,
  IEnd,
  IMove,
  MainPlayer,
  OtherPlayer,
  PlayerPublicInfos,
  Tools,
} from "@shared/socket";
import { Bonus } from "../game/classes/Card/Bonus";
import { Card, TYPECOAL, TYPEGOLD } from "../game/classes/Card/Card";
import { Collapse } from "../game/classes/Card/Collapse";
import { Finish } from "../game/classes/Card/Finish";
import { Ladder } from "../game/classes/Card/Ladder";
import { Path } from "../game/classes/Card/Path";
import { Reveal } from "../game/classes/Card/Reveal";
import { Game } from "../game/classes/Game/Game";
import { IA } from "../game/classes/IA/IA";
import { IAMineur } from "../game/classes/IA/IAMineur";
import { IASaboteur } from "../game/classes/IA/IASaboteur";
import { Player } from "../game/classes/Player/Player";
import { Admin } from "../game/classes/Player/admin";
import { Briseur } from "../game/classes/Player/briseur";
import { Debrouillard } from "../game/classes/Player/debrouillard";
import { Fixeur } from "../game/classes/Player/fixeur";
import { Hackeur } from "../game/classes/Player/hackeur";
import { Teletravailleur } from "../game/classes/Player/teletravailleur";
import { SocketPlayer } from "./SocketPlayer";

export class GameEngineManager {
  private ge: Game | null;
  private players: Map<string, SocketPlayer> | null;
  private ia_l: IA[];
  private gameMode: string;

  constructor() {
    this.ge = null;
    this.players = null;
    this.ia_l = [];
    this.gameMode = "classic";
  }

  /**
   * Initialise une partie et lance le jeu.
   * @param players Liste des joueurs humain
   * @param gameMode Type de partie
   * @param n_ia Nombre d'IA
   */
  public init(players: Map<string, SocketPlayer>, gameMode: string, n_ia?: number): void {
    // A partir de la map on cree une array d'id
    let playersId: number[] = [];
    players.forEach((player) => {
      playersId.push(player.getInGameId());
    });
    // Ajout des IA
    if (n_ia != undefined) {
      const id: number = playersId[players.size - 1];
      for (let i: number = 1; i <= n_ia; i++) {
        playersId.push(id + i);
      }
    }
    this.ge = new Game(playersId);
    this.players = players;
    this.gameMode = gameMode;
    // Commence le jeu:
    this.ge.startGame();
    // Récupération du rôle des IA
    if (n_ia != undefined) {
      const id: number = playersId[players.size - 1];
      for (let i: number = 1; i <= n_ia; i++) {
        this.addIA(id + i);
      }
    }
  }

  /** Initialise une partie de test. */
  public initGameTest(gameMode: string): void {
    this.ge = new Game([0, 1, 2]);

    this.ge.startGame();
  }

  /**
   * Met à jour le jeu à partir d'un coup ou d'une IA.
   * @param move Le coup du joueur, ignoré si le paramètre ia est défini
   * @param ia L'IA qui doit jouer
   * @returns true si le round est fini, false sinon.
   */
  public update(move: IMove, ia?: IA): boolean {
    let mv: IMove;
    try {
      if (ia == undefined) {
        mv = move;
      } else {
        mv = ia.jouer(this.ge!.gameBoard, this.ge!.players)!;
      }
      this.ge!.updateGame(mv);
      if (this.ia_l.length > 0) IA.deviner(mv, this.ge!.gameBoard);
    } catch (error: any) {
      throw error;
    }
    if (this.ge != undefined) {
      return this.ge!.winner != 0;
    } else throw new Error("La partie n'a pas commencé");
  }

  /** Récupère les informations privées d'un joueur (main, rôle, etc). */
  public getPlayerInfos(id: number): MainPlayer {
    let mainPlayer: MainPlayer = {} as MainPlayer;
    if (!this.ge) {
      return mainPlayer;
    }
    const gePlayer = this.ge.players[id];
    mainPlayer = this.fillPlayerInfos(id, mainPlayer) as MainPlayer;
    mainPlayer.cardsHeld = [] as CardType[];
    mainPlayer.role = gePlayer.saboteur ? "Saboteur" : "Mineur";

    mainPlayer.cardsHeld = this.handleCardsInfos(gePlayer.cardsInHand);
    mainPlayer.cardsRevealed = gePlayer.cardsRevealed;
    mainPlayer.powerTarget = gePlayer.powerTarget;
    mainPlayer.powerLeft = gePlayer.powerLeft;
    mainPlayer.playersRevealed = gePlayer.playersRevealed;
    mainPlayer.job = "Noob";
    if (gePlayer instanceof Admin) {
      mainPlayer.job = "Admin";
    }
    if (gePlayer instanceof Hackeur) {
      mainPlayer.job = "Hacker";
    }
    if (gePlayer instanceof Briseur) {
      mainPlayer.job = "Briseur";
    }
    if (gePlayer instanceof Fixeur) {
      mainPlayer.job = "Fixeur";
    }
    if (gePlayer instanceof Teletravailleur) {
      mainPlayer.job = "Teletravailleur";
    }
    if (gePlayer instanceof Debrouillard) {
      mainPlayer.job = "Debrouillard";
    }

    return mainPlayer;
  }

  /**
   * Récupère les informations publiques (nombre de cartes, outils, etc) de
   * tous les joueurs.
   */
  private getOtherPlayersInfos(): OtherPlayer[] {
    let otherPlayers: OtherPlayer[] = [];

    if (!this.ge) {
      return otherPlayers;
    }

    this.ge.players.forEach((player) => {
      let tempPlayer: OtherPlayer = {} as OtherPlayer;
      tempPlayer = this.fillPlayerInfos(player.playerId, tempPlayer) as OtherPlayer;

      tempPlayer.nbCards = player.cardsInHand.length;

      otherPlayers.push(tempPlayer);
    });

    return otherPlayers;
  }

  /** Récupère l'état du plateau. */
  private getBoardState(): CardType[][] {
    let board: CardType[][] = [];
    if (!this.ge) {
      return board;
    }

    // For each row
    this.ge.gameBoard.tab.forEach((row) => {
      // We create a new row
      let tempRow: CardType[] = [];
      tempRow = this.handleCardsInfos(row);
      // We push the row in the board
      board.push(tempRow);
    });

    return board;
  }

  /** Récupère l'état global du jeu. */
  public getGameState(): GameState {
    const board = this.getBoardState()!;
    const players = this.getOtherPlayersInfos()!;
    const reachableCells = this.getReachableCells();
    const inGamePlayerTurn: number = this.ge?.currentPlayer!;
    const winner: number = this.ge?.winner!;
    const deckSize: number = this.ge?.deckSize!;

    const gameState: GameState = {
      board: board,
      reachableCells: reachableCells,
      players: players,
      playerTurn: inGamePlayerTurn!,
      deckSize: deckSize,
      winner: winner,
    };

    return gameState;
  }

  /** Récupère le pseudo d'un joueur à partir de son id dans la partie. */
  private getPseudoFromInGameId(inGameId: number): string {
    let pseudo: string = "";
    this.players?.forEach((player) => {
      if (player.getInGameId() === inGameId) {
        pseudo = player.getPseudo();
      }
    });
    if (pseudo === "") pseudo = "Player " + (inGameId + 1).toString() + " (AI)";
    return pseudo;
  }

  /** Récupère toutes les cases vides jouables sur le plateau. */
  private getReachableCells(): ICell[] | null {
    const reachableCells: ICell[] = [];
    if (!this.ge) {
      return null;
    }
    const coordsReachable: number[][] = this.ge.gameBoard.reachableEmptyCells(3, 1);
    coordsReachable.map((cellCoords) => {
      const cell: ICell = {} as ICell;
      cell.coordX = cellCoords[0];
      cell.coordY = cellCoords[1];
      reachableCells.push(cell);
    });

    return reachableCells;
  }

  /** Remplit les informations d'un joueur. */
  private fillPlayerInfos(id: number, p: PlayerPublicInfos): PlayerPublicInfos {
    if (this.players) {
      p.username = this.getPseudoFromInGameId(id);
    } else {
      p.username = "Player Test " + id;
    }

    if (this.ge != null) {
      p.tools = {} as Tools;

      p.userId = id;
      p.tools.cart = this.ge.players[id].cart;
      p.tools.lantern = this.ge.players[id].torch;
      p.tools.pickaxe = this.ge.players[id].pickaxe;
    }
    return p;
  }

  /** Récupère les données d'une main. */
  private handleCardsInfos(cardsArray: Card[]) {
    if (!cardsArray) {
      console.log("ERROR: Cards array is empty.");
      return [] as CardType[];
    }
    let newArray: CardType[] = [];
    cardsArray.forEach((card) => {
      let newCard: CardType = {} as CardType;

      newCard.cardId = card.cardId;
      newCard.cardType = card.cardType;
      newCard.categorie = null;
      newCard.isFlipped = false;

      if (card instanceof Path) {
        newCard.categorie = "Path";
        newCard.isFlipped = card.isFlipped;
      }
      if (card instanceof Bonus) {
        if (card.penalty) {
          newCard.categorie = "Malus";
        } else {
          newCard.categorie = "Bonus";
        }
        newCard.targetTools = {} as Tools;
        newCard.targetTools.cart = card.cart;
        newCard.targetTools.lantern = card.torch;
        newCard.targetTools.pickaxe = card.pickaxe;
      }
      if (card instanceof Reveal) {
        newCard.categorie = "Reveal";
      }
      if (card instanceof Collapse) {
        newCard.categorie = "Collapse";
      }
      if (card instanceof Ladder) {
        newCard.categorie = "Start";
      }
      if (card instanceof Finish) {
        newCard.categorie = "Finish";
        if (card.cardType === TYPEGOLD || card.cardType === TYPECOAL) {
          newCard.isRevealed = true;
        }
      }

      newArray.push(newCard);
    });

    return newArray;
  }

  /** Récupère le score de chaque joueur dans une Map. */
  private getScore(): Map<string, number> {
    let score: Map<string, number> = new Map();
    if (this.ge != null && this.players != null) {
      for (let i = 0; i < this.ge.players.length; i++) {
        const p = this.ge.players[i];
        score.set(this.getPseudoFromInGameId(i), p.goldAmount);
      }
    }
    // Tri décroissant
    return new Map([...score.entries()].sort((a, b) => b[1] - a[1]));
  }

  /** Récupère l'état de fin de round. */
  public getEndInfo(): IEnd {
    return {
      round_winner_team: this.ge!.winner,
      round_winner_id: this.ge!.currentPlayer,
      next_round: this.ge!.manche,
      game_over: this.ge!.manche >= 4,
      premier: this.ge!.getPremier(),
      score: this.getScore(),
    };
  }

  /** Ajoute une IA à partir de l'id d'un joueur de la partie. */
  public addIA(id: number): void {
    if (this.gameMode === "classic") {
      let ia: IA;
      let player: Player = this.ge!.players[id];
      if (player.saboteur) ia = new IASaboteur(id, this.ge!.gameBoard);
      else ia = new IAMineur(id, this.ge!.gameBoard);
      this.ia_l.push(ia);
    }
  }

  /** Vérifie si un joueur est une IA. */
  public isIA(id: number): boolean {
    let found: boolean = false;
    this.ia_l.forEach((ia) => {
      if (ia.playerId == id) found = true;
    });
    return found;
  }

  /** Récupère la liste des IA de la partie. */
  public getIA(id: number): IA | undefined {
    for (let k = 0; k < this.ia_l.length; k++) {
      const ia: IA = this.ia_l[k];
      if (ia.playerId == id) {
        return this.ia_l[k];
      }
    }
  }

  /** Récupère l'id du joueur qui doit jouer. */
  public getCurPlayer(): number {
    return this.ge == undefined ? -1 : this.ge.currentPlayer;
  }

  /** Arrête la partie. */
  public end(): void {
    this.ge = null;
    this.players = null;
    this.ia_l = [];
  }

  /** Réinitialise le jeu. */
  public reinitGame(): void {
    if (this.gameIsOn()) {
      this.ge!.startGame();
      this.reinitIA(this.ge!.players);
    }
  }

  /** Réinitialise l'IA (équipe, intuitions, ...) pour un nouveau round. */
  private reinitIA(players: Player[]): void {
    IA.reset();
    players.forEach((p) => {
      const id: number = p.playerId;
      if (this.isIA(id)) {
        this.addIA(id);
        this.ia_l.pop(); // remove the element addIA() pushed
      }
    });
  }

  /** Vérifie si la partie est lancée. */
  public gameIsOn(): boolean {
    return this.ge != null;
  }

  /** Récupère la première carte du joueur (pour GameTest) */
  public getFirstCard(id: number): Card | undefined {
    if (this.gameIsOn()) return this.ge!.players[id].cardsInHand[0];
  }

  /** Affichage des intuitions de l'IA sur les saboteurs. */
  public dispSabInfos(): void {
    console.log();
    console.log("# SABOTEURS INFOS");
    let cds_l = "";
    IA.lst_cds.forEach((cds) => {
      cds_l += "(" + cds[0] + "," + cds[1] + ") ";
    });
    console.log("Culs-de-sac : " + cds_l);
    let sabs = "";
    IA.saboteurHint.forEach((s) => {
      sabs += "(" + s + ") ";
    });
    console.log("saboteurs potentiels : " + sabs);
    console.log();
  }

  // Only for testing
  /** Récupère le game. */
  public getGame(): Game | null {
    return this.ge;
  }
}
