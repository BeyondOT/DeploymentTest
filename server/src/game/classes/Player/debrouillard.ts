import { Card } from "../Card/Card";
import { Player, powerTargetType } from "./Player";

export class Debrouillard extends Player {
  constructor(playerId: number) {
    super(playerId);
    this.powerLeft = 3; //3 actions par round par défaut
    this.powerTarget = "Card";
  }
  //role debrouillard -> permet de defausser jusqu'à 3 fois dans le round sans passer son tour
  public power() {
    //il faudra discard (pas utilisable ici car dans game), et ne pas skip le tour du player pour que le joueur puisse rejouer
    this.powerLeft--;
  }
}
