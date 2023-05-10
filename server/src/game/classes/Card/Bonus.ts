import { Card } from "./Card";
//Classe Bonus: les cartes bonus ou malus pour réparer ou casser l'équipement des joueurs
export class Bonus extends Card {
  //true si malus, false sinon
  penalty: boolean;
  //true si concerne l'équipement du nom de l'attribut, false sinon
  pickaxe: boolean;
  cart: boolean;
  torch: boolean;
  constructor(
    cardId: number,
    penalty: boolean,
    pickaxe: boolean,
    cart: boolean,
    torch: boolean
  ) {
    super(cardId);
    this.penalty = penalty;
    this.pickaxe = pickaxe;
    this.cart = cart;
    this.torch = torch;
  }
}
