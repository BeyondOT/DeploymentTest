import { Bonus } from "../Card/Bonus";
import { Player, powerTargetType } from "./Player";

export class Briseur extends Player {
  constructor(playerId: number) {
    super(playerId);
    this.powerLeft = 1; //Une action par round par défaut
    this.powerTarget = "Tools";
  }

  //utilise le power de briseur, casse un tools, renvoie true si bien cassé, false si pas valable
  public power(
    targetPlayer: Player,
    pickaxe: boolean,
    cart: boolean,
    torch: boolean
  ): boolean {
    let bonus = new Bonus(110, true, pickaxe, cart, torch);
    //on vérifie qu'on peut appliquer ce bonus a player (que le tool est pas déja cassé)
    if (
      targetPlayer.checkBonus(bonus) &&
      ((pickaxe && !cart && !torch) ||
        (!pickaxe && cart && !torch) ||
        (!pickaxe && !cart && torch))
    ) {
      // si c'est le cas on casse son tool
      targetPlayer.applyBonus(bonus);
      this.powerLeft--;
      return true;
    }
    return false;
  }
}
