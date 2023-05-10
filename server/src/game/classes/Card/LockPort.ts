import { Card } from "./Card";
//Class lock: représente les cartes Blocage/déblocage de port
export class LockPort extends Card {
  lock: boolean;
  constructor(CardId: number, lck: boolean) {
    super(CardId);
    this.lock = lck;
  }
}
