import { Card } from "./Card";
//Classe Deadline: les cartes qui ajoutent des cartes dans la pioche (ou en retirent)
export class Deadline extends Card {
  public increase: boolean; //True si ajout de cartes, false sinon
  public numberOfCards: number; //Nombre de cartes à ajouter
  constructor(cardId: number, increase: boolean, numberOfCards: number) {
    super(cardId);
    this.increase = increase;
    this.numberOfCards = numberOfCards;
  }
}
