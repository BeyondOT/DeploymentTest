import { IPLayersRevealed } from "@shared/socket";
import { Player, powerTargetType } from "./Player";
//attention a l'import de admin , vscode import admin de mongodb
export class Admin extends Player {
  constructor(playerId: number) {
    super(playerId);
    this.powerLeft = 1; //Une action par round par défaut
    this.powerTarget = "Player";
  }

  //Rajoute l'id et le camp du joueur inspecté dans playersRevealed
  public power(playerInspected: Player): boolean {
    if (playerInspected.playerId == this.playerId) {
      return false;
    }
    this.useTrace(playerInspected);
    this.powerLeft--;
    return true;
  }
}
