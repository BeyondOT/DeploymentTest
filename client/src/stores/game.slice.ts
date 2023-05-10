import {
  CardType,
  GameState,
  ICell,
  IMessage,
  MainPlayer,
  OtherPlayer,
} from "@shared/socket";
import produce from "immer";
import { StateCreator } from "zustand";

export interface OtherPlayerClient extends OtherPlayer {
  avatar?: string;
}

export interface ISelectedCard extends CardType {
  isPower?: boolean;
}

export interface MainPlayerClient extends MainPlayer {
  avatar?: string;
  selectedCard?: ISelectedCard | null;
}

export type TPlayerStateType = "inQueue" | "inGame" | "idle";

export interface GameStateClient {
  playerState: TPlayerStateType;
  mainPlayer: MainPlayerClient;
  otherPlayers: OtherPlayerClient[];
  board: CardType[][];
  row: number;
  column: number;
  playerTurn: number;
  deckSize: number;
  winner: number;
  reachableCells: ICell[] | null;
  messages: IMessage[];

  setMainPlayer: (player: MainPlayerClient) => void;
  selectCard: (card: ISelectedCard | null) => void;
  setGameState: (data: GameState) => void;
  addMessage: (data: IMessage) => void;
  setPlayerState: (playerState: TPlayerStateType) => void;
}

export const createGameSlice: StateCreator<
  GameStateClient,
  [["zustand/devtools", never]],
  [],
  GameStateClient
> = (set) => ({
  playerState: "idle",
  mainPlayer: {} as MainPlayerClient,
  otherPlayers: [] as OtherPlayerClient[],
  board: [] as CardType[][],
  playerTurn: -1,
  deckSize: 0,
  winner: 0,
  reachableCells: [],
  row: 0,
  column: 0,
  messages: [] as IMessage[],

  setGameState(data) {
    set(
      produce((state: GameStateClient) => {
        state.board = data.board;
        state.row = data.board.length;
        state.column = data.board[0].length;
        state.reachableCells = data.reachableCells;
        data.reachableCells?.forEach((cell) => {
          state.board[cell.coordX][cell.coordY].isReachable = true;
        });
        state.mainPlayer.cardsRevealed.forEach((card) => {
          state.board[card.coordX][card.coordY].cardId = -2;
          state.board[card.coordX][card.coordY].cardType = card.cardType;
          state.board[card.coordX][card.coordY].isRevealed = true;
        });
        state.deckSize = data.deckSize;
        state.playerTurn = data.playerTurn;
        state.otherPlayers = data.players;
        state.winner = data.winner;
      }),
      false,
      { type: "game/setGameState", data }
    );
  },
  setMainPlayer(player) {
    set(
      produce((state: GameStateClient) => {
        state.mainPlayer.cardsHeld = player.cardsHeld;
        state.mainPlayer.role = player.role;
        state.mainPlayer.tools = player.tools;
        state.mainPlayer.username = player.username;
        state.mainPlayer.userId = player.userId;
        state.mainPlayer.cardsRevealed = player.cardsRevealed;
        state.mainPlayer.powerTarget = player.powerTarget;
        state.mainPlayer.job = player.job;
        state.mainPlayer.powerLeft = player.powerLeft;
        state.mainPlayer.playersRevealed = player.playersRevealed;
        
      }),
      false,
      {
        type: "game/setMainPlayer",
        player,
      }
    );
  },
  addMessage(data) {
    set(
      produce((state: GameStateClient) => {
        state.messages = state.messages.concat(data);
      }),
      false,
      { type: "game/addMessage", data }
    );
  },

  selectCard(card) {
    set(
      produce((state: GameStateClient) => {
        state.mainPlayer.selectedCard = card;
      }),
      false,
      { type: "game/selectCard", card }
    );
  },
  setPlayerState(playerState) {
    set(
      produce((state: GameStateClient) => {
        state.playerState = playerState;
      })
    );
  },
});
