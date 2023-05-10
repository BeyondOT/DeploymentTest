import { Card, IDFINISH } from "./Card";
//Classe Finish: les cartes or et charbon (considérés comme des croisements à 4 chemin par défaut)
class Finish extends Card {
  coordX: number;
  coordY: number;
  discovered: boolean; //true si la carte a été découverte (il a existé un chemin du départ jusqu'à la carte), false sinon
  constructor(coordX: number, coordY: number) {
    super(IDFINISH); //carte ui sera retournée en front, on garde le meme id pour les trois finish
    //et on garde les coordonnées de l'or en back pour éviter la triche
    this.cardType = 999;
    this.coordX = coordX; // on pourrait mettre fixe, mais a voir si on fait d'autres dispositions
    this.coordY = coordY;
    this.discovered = false; //Carte caché par défaut
  }
}
export { Finish };
