export interface PlayerPublicInfos {
  tools: Tools;
  userId: number;
  username: string;
}

export type PowerTargetType =
  | "Player"
  | "Board"
  | "Tools"
  | "Deck"
  | "Hand"
  | "Card"
  | null;

export interface Tools {
  cart: boolean;
  pickaxe: boolean;
  lantern: boolean;
}

export interface MainPlayer extends PlayerPublicInfos {
  role: string;
  job: IJob;
  cardsHeld: CardType[];
  cardsRevealed: ICardReveal[];
  powerTarget: PowerTargetType;
  powerLeft: number;
  playersRevealed: IPLayersRevealed[];
}

export interface OtherPlayer extends PlayerPublicInfos {
  nbCards: number;
}

export interface GameState {
  players: OtherPlayer[];
  reachableCells: ICell[] | null;
  board: CardType[][];
  playerTurn: number;
  deckSize: number;
  winner: number;
}

export type IJob =
  | "Admin"
  | "Fixeur"
  | "Briseur"
  | "Teletravailleur"
  | "Debrouillard"
  | "Hacker"
  | "Noob";

export type Categorie =
  | "Path"
  | "Collapse"
  | "Reveal"
  | "Bonus"
  | "Malus"
  | "Start"
  | "Finish"
  | "Lock"
  | "Unlock"
  | "PlayerReveal"
  | null;

export interface CardType {
  cardId: number;
  cardType: number;
  categorie: Categorie;
  isRevealed?: boolean;
  isFlipped?: boolean;
  targetTools?: Tools;
  isReachable?: boolean;
  cardPosition?: {
    coordX: number;
    coordY: number;
  };
}
export type Target = "Power" | "Board" | "Discard" | "Player" | null;

export interface ICell {
  coordX: number;
  coordY: number;
}

export interface IMove {
  cardId?: number;
  playerId: number;
  target: Target;
  targetPlayerId?: number; //Optionnel si le target est un player, ou pour power (certains cas)
  targetTool?: Tools;
  //Optionnel, si le target est le plateau
  coordX?: number;
  coordY?: number;
  flip?: boolean;
}

export interface ICardReveal {
  cardType: number;
  coordX: number;
  coordY: number;
}
export interface IPLayersRevealed {
  playerdId: number;
  saboteur: boolean;
  role?: string;
}
export interface ICallbackObject {
  status: "ok" | "failed";
  message?: string;
}

export interface IMessage {
  from: string;
  body: string;
  to: string;
}
export interface IEnd {
  round_winner_team: number;
  round_winner_id: number;
  next_round: number;
  game_over: boolean;
  premier: number;
  score: Map<string, number>;
}

export const MINEURSCONST = 1;
export const SABOTEURCONST = 2;

export interface CreateRoomParams {
  username: string;
  roomName: string;
  numberOfPlayers: number;
  gameMode: string;
  nbIA?: number;
}

export interface IAuthSocket {
  userId: string;
  pseudo: string;
  friends: string[];
}

export interface ILobbyInfos {
  players: string[];
  info: string;
  roomMaxSize: number;
  roomCurrentSize: number;
}

export interface IInitialSend {
  mainPlayer: MainPlayer;
  gameState: GameState;
}
