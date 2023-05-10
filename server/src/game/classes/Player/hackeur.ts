import { Player, powerTargetType } from "./Player";
import { Admin } from "./admin";
import { Briseur } from "./briseur";
import { Debrouillard } from "./debrouillard";
import { Fixeur } from "./fixeur";
import { Teletravailleur } from "./teletravailleur";

export class Hackeur extends Player {
  constructor(playerId: number) {
    super(playerId);
    this.powerLeft = 1; //Une action par round par défaut
    this.powerTarget = "Player";
  }

  public power(playerToSwapArg: Player, players: Player[]): boolean {
    //Vérifie qu'on n'échange pas de rôle avec soi même
    if (playerToSwapArg.playerId == this.playerId) {
      return false;
    }
    this.powerLeft--;
    let playerToSwap: Player = playerToSwapArg;
    //on peut modifier le tableau player car passé par reference , a tester, sinon le return au lieu de bool
    players[playerToSwap.playerId] = new Player(playerToSwap.playerId);
    players[playerToSwap.playerId].copyPlayer(playerToSwapArg);
    players[playerToSwap.playerId].saboteur = this.saboteur;
    //on mets le role de l'autre joueur dans le role d hackeur et on recupere son compteur
    //on doit donc tester chaque role un par un pour voir quelle instance de player c'est
    let hackeurNewRole;
    if (playerToSwap instanceof Admin) {
      hackeurNewRole = new Admin(this.playerId);
      hackeurNewRole.powerLeft = playerToSwap.powerLeft;
    } else if (playerToSwap instanceof Briseur) {
      hackeurNewRole = new Briseur(this.playerId);
      hackeurNewRole.powerLeft = playerToSwap.powerLeft;
    } else if (playerToSwap instanceof Debrouillard) {
      hackeurNewRole = new Debrouillard(this.playerId);
      hackeurNewRole.powerLeft = playerToSwap.powerLeft;
    } else if (playerToSwap instanceof Fixeur) {
      hackeurNewRole = new Fixeur(this.playerId);
      hackeurNewRole.powerLeft = playerToSwap.powerLeft;
    } else if (playerToSwap instanceof Hackeur) {
      hackeurNewRole = new Hackeur(this.playerId);
      hackeurNewRole.powerLeft = playerToSwap.powerLeft;
    } else if (playerToSwap instanceof Teletravailleur) {
      hackeurNewRole = new Teletravailleur(this.playerId);
      hackeurNewRole.powerLeft = playerToSwap.powerLeft;
    } else if (playerToSwap instanceof Player) {
      hackeurNewRole = new Player(this.playerId);
    }

    if (hackeurNewRole instanceof Player) {
      //on vérifie que ca a bien marché
      players[hackeurNewRole.playerId] = hackeurNewRole;
      players[hackeurNewRole.playerId].copyPlayer(this);
      players[hackeurNewRole.playerId].saboteur = playerToSwap.saboteur; //on echange les équipes
    } else {
      throw new Error("nouveau role pas un Player ");
    }
    players[this.playerId] = hackeurNewRole;
    return true;
  }
}

/*//Echange le rôle avec un autre joueur
  public swapRole(playerToSwap: Player): void {
    //On échange les rôles
    this.role = playerToSwap.role;
    playerToSwap.role = "";
    //On prend le compteur de l'autre joueur
    this.roleActionsLeft = playerToSwap.roleActionsLeft;
    playerToSwap.roleActionsLeft = 0;
    //On échange les camps
    this.saboteur = playerToSwap.saboteur;
    playerToSwap.saboteur = false;
  }
  //Retourne true si on peut échanger le rôle, false sinon
  
  */
