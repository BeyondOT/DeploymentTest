import { Player, powerTargetType } from "./Player";

export class Teletravailleur extends Player {
  constructor(playerId: number) {
    super(playerId);
    this.powerLeft = 1; //aucune action role passif, peut poser meme quand tools cassés donc jamais changé
    //ici 1 pour faciliter l'utilisation dans update
  }
}
