import { Card } from "./Card";
//Classe Reveal: représent la carte vision permettant à un joueur de voir ce que cache une carte finale
export class Reveal extends Card {
  constructor(cardId: number) {
    super(cardId);
  }
}
