import { Card, IDLADDER } from "./Card";
import { Ladder } from "./Ladder";
import { Path } from "./Path";
//Classe Ladder: carte représentant le départ des joueurs
export class LadderPath extends Path {
  constructor(
    cardId: number,
    north: boolean,
    south: boolean,
    east: boolean,
    west: boolean
  ) {
    super(cardId, false, north, south, east, west);
    this.cardType = 98;
  }
}
