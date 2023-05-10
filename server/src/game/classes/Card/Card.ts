//Constantes cardID fixes car présentes à chaque partie et initialisées avec le board
export const IDEMPTY = 0;
export const IDLADDER = -1;
export const IDFINISH = -2;
export const IDGOLD = 69;
export const IDCOAL = 70;
export const TYPEGOLD = 69;
export const TYPECOAL = 70;
export class Card {
  public cardId: number;
  public cardType: number;
  public locked: boolean;
  public constructor(cardId: number) {
    this.cardId = cardId;
    this.cardType = 0;
    this.locked= false;
  }
}
