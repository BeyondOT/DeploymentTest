import { IMove, Target, Tools } from "@shared/socket";

export const CONSTDISCARD = -1;
export class Move implements IMove {
  //crée et init  en front donc on a pas besoin de plus ici
  cardId: number;
  playerId: number;
  target: Target;
  targetPlayerId?: number;
  targetTool?: Tools;
  coordX?: number;
  coordY?: number;
  flip?: boolean;

  constructor() {
    this.cardId = 0;
    this.playerId = 0;
    this.target = null;
  }
  public movePathInit(
    cardId: number,
    playerId: number,
    coordX: number,
    coordY: number,
    flip: boolean
  ) {
    this.moveRevealCollapseInit(cardId, playerId, coordX, coordY);
    this.flip = flip;
  }
  public moveBonusInit(
    cardId: number,
    playerId: number,
    targetPlayerId: number,
    pick: boolean,
    cart: boolean,
    torch: boolean
  ) {
    this.target = "Player";
    this.cardId = cardId;
    this.playerId = playerId;
    this.targetPlayerId = targetPlayerId;
    this.targetTool = { cart: cart, pickaxe: pick, lantern: torch };
  }
  public moveRevealCollapseInit(
    cardId: number,
    playerId: number,
    coordX: number,
    coordY: number
  ) {
    this.target = "Board";
    this.cardId = cardId;
    this.playerId = playerId;
    this.coordX = coordX;
    this.coordY = coordY;
  }
}
