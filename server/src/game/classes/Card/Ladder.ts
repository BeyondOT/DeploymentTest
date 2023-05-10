import { Card, IDLADDER } from "./Card";
//Classe Ladder: carte représentant le départ des joueurs
export class Ladder extends Card {
  public coordY: number;
  public coordX: number;
  constructor(idLadder: number = IDLADDER) {
    super(idLadder);
    this.cardType = 99;
    this.coordX = 1; // coordonnées fixes car échelle toujours au meme endroit
    this.coordY = 3;
  }
}
