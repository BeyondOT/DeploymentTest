import { Card } from "./Card";
//Classe Path: représentes les cartes chemins posées par les joueurs
export class Path extends Card {
  //true si impasse, false sinon
  public deadEnd: boolean;
  //true si ouvert dans la direction du nom de l'attribut , false sinon
  public north: boolean;
  public south: boolean;
  public east: boolean;
  public west: boolean;
  public hasSecondPath: boolean;
  north2: boolean;
  south2: boolean;
  east2: boolean;
  west2: boolean;
  public isFlipped: boolean;
  constructor(
    cardId: number,
    deadEnd: boolean,
    north: boolean,
    south: boolean,
    east: boolean,
    west: boolean,
    north2?: boolean,
    south2?: boolean,
    east2?: boolean,
    west2?: boolean
  ) {
    super(cardId);
    this.deadEnd = deadEnd;
    this.north = north;
    this.south = south;
    this.east = east;
    this.west = west;
    this.isFlipped = false;
    if (
      north2 !== undefined &&
      south2 !== undefined &&
      east2 !== undefined &&
      west2 !== undefined
    ) {
      this.hasSecondPath = true;
      this.north2 = north2;
      this.south2 = south2;
      this.east2 = east2;
      this.west2 = west2;
    } else {
      this.hasSecondPath = false;
      this.north2 = false;
      this.south2 = false;
      this.east2 = false;
      this.west2 = false;
    }
  }
  //Fonction retournant une carte (en modifiant ses valeurs)
  public flip(): void {
    //On échange le nord et le sud
    let temp: boolean = this.north;
    this.north = this.south;
    this.south = temp;
    //On échange l'est et l'ouest
    temp = this.east;
    this.east = this.west;
    this.west = temp;
    this.isFlipped = !this.isFlipped;
  }

  public affPath() {
    let tab: number[][] = [[0,0,0], [0,0,0], [0,0,0]];
    if (this.north) tab[0][1] = 1;
    if (this.west) tab[1][0] = 1;
    if (!this.deadEnd) tab[1][1] = 1;
    if (this.east) tab[1][2] = 1;
    if (this.south) tab[2][1] = 1;
    for (let i = 0; i < tab.length; i++) {
      const ln = tab[i];
      console.log(ln);
    }
  }
}
