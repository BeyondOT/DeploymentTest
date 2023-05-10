import { randomInt } from "crypto";
import {
  Card,
  IDEMPTY,
  IDCOAL,
  IDGOLD,
  TYPECOAL,
  TYPEGOLD,
} from "../Card/Card";
import { Collapse } from "../Card/Collapse";
import { Finish } from "../Card/Finish";
import { Ladder } from "../Card/Ladder";
import { Path } from "../Card/Path";
import { LadderPath } from "../Card/LadderPath";

export const COLUMNS = 11; //Nombre de colonnes sur le plateau
export const ROW = 7; //Nombre de lignes sur le plateau

//const comme ca si on fait des autres map modifiable
export const COORDSORTIEX = 3;
export const COORDSORTIEY = 9;
//Pour DFS et fonctions liées
export const FIRSTPATH = 1;
export const SECONDPATH = 2;
const coordFinishX: number[] = [
  COORDSORTIEX - 2,
  COORDSORTIEX,
  COORDSORTIEX + 2,
];
export class Board {
  public tab: Card[][] = []; //Le tableau de cartes
  public coordOrX: number = 0;
  public coordOrY: number = 0;
  public ladderCoordsTab: number[][];
  public constructor() {
    //Création du tableau de cartes
    for (let i = 0; i < ROW; i++) {
      const row: Card[] = []; //lignes
      for (let j = 0; j < COLUMNS; j++) {
        const newCartes = new Card(IDEMPTY); //id carte case vide (obligatoire car init tableau de cartes)
        row.push(newCartes);
      }
      this.tab.push(row);
    }
    //Ajout de l'échelle
    this.tab[3][1] = new Ladder();
    //Ajout des 3 cases finales

    for (let i = 0; i < 3; i++) {
      let coordX: number = coordFinishX[i];
      this.tab[coordX][COORDSORTIEY] = new Finish(coordX, COORDSORTIEY);
    }
    //On décide des coordonnées de l'or
    let random = randomInt(3);
    this.ladderCoordsTab = [[3, 1]];
    this.coordOrX = coordFinishX[random];
    this.coordOrY = COORDSORTIEY;
  }
  //          CHECK

  //Renvoie true si un éboulement est valide aux coordonnées passées en argument, false sinon
  public checkCollapse(coordX: number, coordY: number) {
    //On vérifie qu'on collapse bien un chemin (donc pas une sortie ni l'echelle ni un autre type de carte )
    if (this.tab[coordX][coordY] instanceof Path) {
      //et que ce n'est pas une carte vide
      if (this.tab[coordX][coordY].cardId != IDEMPTY) {
        return true;
      }
    }
    return false;
  }
  //Renvoie true si la carte examinée est bien une carte finale, false sinon
  public checkRevealSubBoard(coordX: number, coordY: number) {
    if (this.tab[coordX][coordY] instanceof Finish) {
      return true;
    }
    return false;
  }
  //Renvoie true si la case est dans les limites du plateau , false sinon
  public checkCellInBoard(coordX: number, coordY: number): boolean {
    return 0 <= coordX && coordX < ROW && 0 <= coordY && coordY < COLUMNS;
  }
  public checkCellInBoardMove(coordX: number, coordY: number): boolean {
    return 0 <= coordX && coordX < ROW && 0 <= coordY && coordY < COLUMNS;
  }
  //Renvoie true si l'or est découvert, false sinon
  public checkGold(): boolean {
    const cardGold: Finish = this.tab[this.coordOrX][this.coordOrY] as Finish;
    return cardGold.discovered;
  }
  //Renvoie true si la case est occupée, false sinon
  public checkCellOccupied(coordX: number, coordY: number): boolean {
    return this.tab[coordX][coordY].cardId != 0;
  }
  //Retourn true si les coordonnées sont celles de l'or, false sinon
  public checkPlayerRevealOr(coordX: number, coordY: number): boolean {
    if (coordX == this.coordOrX && coordY == this.coordOrY) {
      return true;
    }
    return false;
  }
  //Renvoie true si un chemin peut être posé (vérifie pour chaque échelle)
  public checkPaths(cardPath: Path, coordX: number, coordY: number): boolean {
    let found: boolean = false;
    let indexLadder: number = 0;
    while (!found && indexLadder < this.ladderCoordsTab.length) {
      let curLadderX = this.ladderCoordsTab[indexLadder][0];
      let curLadderY = this.ladderCoordsTab[indexLadder][1];
      found = this.checkPath(cardPath, coordX, coordY, curLadderX, curLadderY);
      indexLadder++;
    }
    return found;
  }

  //Renvoie true si un chemin peut être posé en partant d'une certaine échelle, départ par défaut (dans le board,ne coupe pas les connections aux chemins adjacents
  //et est relié au départ )
  //False sinon
  public checkPath(
    cardPath: Path,
    coordX: number,
    coordY: number,
    coordLadderX: number = 3,
    coordLadderY: number = 1
  ): boolean {
    const start: number[] = [coordLadderX, coordLadderY]; //coords x,y de l'échelle
    let pathFound: boolean = false; //true si on peut poser Path, false sinon
    //Si on n'est pas dans le plateau , placement non valide
    if (this.checkCellInBoard(coordX, coordY)) {
      //Si la case est occupée, placement non valide
      if (!this.checkCellOccupied(coordX, coordY)) {
        //Si on ne peut pas connecter le chemin aux cartes adjacentes, placement non valide
        if (this.validConnectedPath(cardPath, coordX, coordY)) {
          let coordXStart: number = start[0];
          let coordYStart: number = start[1];
          let dfsPath: number[][] = this.dfsPath(coordXStart, coordYStart);
          dfsPath.forEach((coords) => {
            let curCoordX: number = coords[0];
            let curCoordY: number = coords[1];
            if (curCoordX == coordX && curCoordY == coordY) pathFound = true;
          });
        }
      }
    }
    return pathFound;
  }

  //                  END CHECK

  //Ajoute la carte path sur le board
  public addPath(path: Path, coordX: number, coordY: number) {
    this.tab[coordX][coordY] = path;
    if (path instanceof LadderPath) {
      this.ladderCoordsTab.push([coordX, coordY]);
    }
  }
  //Fait un éboulement aux coordonnées passées en argument
  public addCollapse(coordX: number, coordY: number) {
    if (this.tab[coordX][coordY] instanceof LadderPath) {
      let index: number = this.ladderCoordsTab.indexOf([coordX, coordY]);
      this.ladderCoordsTab.splice(index, 1);
    }
    this.tab[coordX][coordY] = new Card(IDEMPTY); //On remplace l'ancienne carte par une carte vide
  }

  //Retourne l'ensemble des cases accessibles (dont les cases vides) en partant de coordonnées données
  public dfsPath(coordXStart: number, coordYStart: number): number[][] {
    let stackPathDfs: number[][] = []; //Pile pour le parcours du chemin
    let visitedTab: boolean[][] = []; //Pour marquer les chemins visités
    let visitedTabSecondPath: boolean[][] = []; //Pour marquer les seconds chemins visités
    let coordsVisitedTab: number[][] = []; //Pour le retour des cellules visités par le dfs
    //On vérifie que la case de départ du DFS est bien dans le plateau
    if (this.checkCellInBoard(coordXStart, coordYStart)) {
      for (let i = 0; i < ROW; i++) {
        const row: boolean[] = []; //lignes
        for (let j = 0; j < COLUMNS; j++) {
          row.push(false);
        }
        visitedTab.push(row);
        visitedTabSecondPath.push(row);
      }
      stackPathDfs.push([coordXStart, coordYStart, FIRSTPATH]);
      //Tant qu'il reste des chemins à parcourir
      while (stackPathDfs.length != 0) {
        //On dépile la pile des coordonnées à parcourir
        let currentCoord: number[] = stackPathDfs.pop()!;
        let currentCoordX: number = currentCoord[0];
        let currentCoordY: number = currentCoord[1];
        let currentPath: number = currentCoord[2]; //1er chemin ou 2eme
        //Si la case n'a pas déjà été visité, on continue le parcours
        if (
          currentPath == FIRSTPATH &&
          !visitedTab[currentCoordX][currentCoordY]
        ) {
          //On actualise le tableau des cases visités
          visitedTab[currentCoordX][currentCoordY] = true;
          //On actualise le tableau des coords visités
          //coordsVisitedTab.push(currentCoord);
          //On ajoute à la pile les voisins valides de la case courante
          stackPathDfs = stackPathDfs.concat(
            this.validNeighbours(currentCoordX, currentCoordY, currentPath)
          );
        } else if (
          currentPath == SECONDPATH &&
          !visitedTabSecondPath[currentCoordX][currentCoordY]
        ) {
          //On actualise le tableau des cases visités
          visitedTabSecondPath[currentCoordX][currentCoordY] = true;
          //On actualise le tableau des coords visités
          //coordsVisitedTab.push(currentCoord);
          //On ajoute à la pile les voisins valides de la case courante
          stackPathDfs = stackPathDfs.concat(
            this.validNeighbours(currentCoordX, currentCoordY, currentPath)
          );
        }
      }
      //On crée le tableau des coordonnées des cases visitées
      for (let i = 0; i < ROW; i++) {
        const row: boolean[] = []; //lignes
        for (let j = 0; j < COLUMNS; j++) {
          if (visitedTab[i][j] || visitedTabSecondPath[i][j]) {
            coordsVisitedTab.push([i, j]);
          }
        }
      }
    }
    return coordsVisitedTab;
  }

  //retourne les coordonnées des cases accessibles vides (les cases disponibles)
  //Coordonnées en argument forcément déjà occupées
  public reachableEmptyCells(
    coordXStart: number,
    coordYStart: number
  ): number[][] {
    let dfsPath: number[][] = this.dfsPath(coordXStart, coordYStart);
    let emptyCells: number[][] = [];
    dfsPath.forEach((coordsCell) => {
      let curCordX: number = coordsCell[0];
      let curCordY: number = coordsCell[1];
      let curCard: Card = this.tab[curCordX][curCordY];
      if (curCard.cardId == 0) {
        emptyCells.push(coordsCell);
      }
    });
    return emptyCells;
  }

  //Retourne la liste des coordonnées des cases voisines accessible directement par la case de coordonnées coords
  //Renvoie aussi le chemin (1er ou 2eme) de la case voisine
  //Peut renvoyer des coordonnées de case vide
  //Ne renvoie pas de voisin pour une case vide (id=0)
  //CurrentPath désigne le premier chemin de la carte ou le second (s'il existe)
  public validNeighbours(
    coordX: number,
    coordY: number,
    currentPath: number = FIRSTPATH
  ): number[][] {
    const curCordX: number = coordX;
    const curCordY: number = coordY;
    const curCard: Card = this.tab[coordX][coordY]; //La carte étudiée
    //Les voisins de la carte (dans un ordre précis)
    const neighbours: number[][] = [
      [curCordX - 1, curCordY],
      [curCordX, curCordY + 1],
      [curCordX + 1, curCordY],
      [curCordX, curCordY - 1],
    ];
    let deadEnd: boolean = false;
    let result: number[][] = [];
    //Les cartes sont ouvertes de tout les côtes par défaut (Ladder,Finish,vide)
    let curCardOpenings: boolean[] = [true, true, true, true];
    //Si la carte est un chemin
    if (curCard instanceof Path) {
      //Si c'est une impasse, on n'actualise que deadEnd
      if (curCard.deadEnd) {
        deadEnd = true;
      }
      //on actualise la valeur de ses ouvertures
      else {
        if (currentPath == SECONDPATH) {
          curCardOpenings[0] = curCard.north2;
          curCardOpenings[1] = curCard.east2;
          curCardOpenings[2] = curCard.south2;
          curCardOpenings[3] = curCard.west2;
        } else {
          curCardOpenings[0] = curCard.north;
          curCardOpenings[1] = curCard.east;
          curCardOpenings[2] = curCard.south;
          curCardOpenings[3] = curCard.west;
        }
      }
    }
    //Si la carte est une impasse ou est une carte vide, elle n'a pas de voisins
    if (!deadEnd && curCard.cardId != 0) {
      //On lie chaque voisin à son index(qui correspond à l'ouverture qui sera vérifiée) et on itère
      neighbours.forEach((neighbour, index) => {
        //Si il y a une ouverture et que le voisin est dans le board
        if (
          curCardOpenings[index] &&
          this.checkCellInBoard(neighbour[0], neighbour[1])
        ) {
          let neighbourCard: Card = this.tab[neighbour[0]][neighbour[1]];

          //Vrai par défaut
          let validNeighbourFirst: boolean = true;
          //Faux par défaut
          let validNeighbourSecond: boolean = false;

          //Si c'est un chemin, on doit vérifier les 2 chemins s'il y en a 2 ou les cas spéciaux avec finish
          if (neighbourCard instanceof Path) {
            //Si la carte courante est une carte finale, il faut évaluer les situations exceptionnelles
            //(les cartes voisines peuvent couper le chemin)
            if (curCard instanceof Finish || neighbourCard.hasSecondPath) {
              let neighbourPath = neighbourCard as Path;
              switch (index) {
                case 0:
                  validNeighbourFirst = neighbourPath.south;
                  if (neighbourCard.hasSecondPath)
                    validNeighbourSecond = neighbourPath.south2;
                  break;
                case 1:
                  validNeighbourFirst = neighbourPath.west;
                  if (neighbourCard.hasSecondPath)
                    validNeighbourSecond = neighbourPath.west2;
                  break;
                case 2:
                  validNeighbourFirst = neighbourPath.north;
                  if (neighbourCard.hasSecondPath)
                    validNeighbourSecond = neighbourPath.north2;
                  break;
                case 3:
                  validNeighbourFirst = neighbourPath.east;
                  if (neighbourCard.hasSecondPath)
                    validNeighbourSecond = neighbourPath.east2;
                  break;
              }
            }
          }
          //Si le voisin est valide pour le premier chemin, on l'ajoute à la liste des voisins valides
          if (validNeighbourFirst) {
            result.push([neighbour[0], neighbour[1], FIRSTPATH]);
          }
          if (validNeighbourSecond) {
            result.push([neighbour[0], neighbour[1], SECONDPATH]);
          }
        }
      });
    }
    return result;
  }
  //Retourne vrai si une carte chemin posée à des coordonnées coords est connectée au chemin des cartes adjacentes
  public validConnectedPath(
    cardPath: Path,
    coordX: number,
    coordY: number
  ): boolean {
    let result: boolean = true;
    const curCoordX = coordX;
    const curCoordY = coordY;
    //Liste des voisins dans un ordre précis
    const neighbours: number[][] = [
      [curCoordX - 1, curCoordY],
      [curCoordX, curCoordY + 1],
      [curCoordX + 1, curCoordY],
      [curCoordX, curCoordY - 1],
    ];
    //Liste les ouvertures de la carte
    let curCardConnections: boolean[] = [];
    curCardConnections[0] = cardPath.north;
    curCardConnections[1] = cardPath.east;
    curCardConnections[2] = cardPath.south;
    curCardConnections[3] = cardPath.west;

    neighbours.forEach((neighbour, index) => {
      //Si un chemin pose problème, alors on ne peut pas poser la carte donc on sort de la boucle
      if (result != false) {
        //Si le voisin est hors du plateau
        if (!this.checkCellInBoard(neighbour[0], neighbour[1])) {
          //et que le chemin posé est ouvert vers un "mur" du plateau, on ne peut pas le placer ici

          if (curCardConnections[index]) {
            //result = false;
          }
        }
        //Si le voisin n'est pas une carte vide, on regarde l'état des connexions entre les chemins
        else if (this.tab[neighbour[0]][neighbour[1]].cardId != 0) {
          //Si c'est une échelle ou un charbon/or , le chemin est forcément ouvert
          let openNeighbourConnection: boolean = true;
          let neighbourCard = this.tab[neighbour[0]][neighbour[1]];
          //Sinon, c'est un chemin, on vérifie en fonctions de la position du voisin (index) par rapport au chemin placé
          if (neighbourCard instanceof Path) {
            let neighbourPath = neighbourCard as Path;
            switch (index) {
              case 0:
                openNeighbourConnection =
                  neighbourPath.south || neighbourPath.south2;
                break;
              case 1:
                openNeighbourConnection =
                  neighbourPath.west || neighbourPath.west2;
                break;
              case 2:
                openNeighbourConnection =
                  neighbourPath.north || neighbourPath.north2;
                break;
              case 3:
                openNeighbourConnection =
                  neighbourPath.east || neighbourPath.east2;
                break;
            }
          }
          //Si les deux connexions ne sont pas les mêmes alors il y a un problème (connexion fermé d'un côté mais pas de l'autre)

          if (openNeighbourConnection != curCardConnections[index]) {
            //Vérifie que le voisin n'est pas une carte Finale non découverte (car on pourrait alors placer une carte sans contrainte)
            if (
              !(
                neighbourCard instanceof Finish &&
                neighbourCard.discovered == false
              )
            ) {
              result = false;
            }
          }
        }
      }
    });
    return result;
  }
  //Actualise l'attribut discovered des cartes finales (or et charbons)
  //Retourne true si une carte a été actualisé, false sinon
  public updateDiscovered(): boolean {
    //Liste des cartes finales
    let updated: boolean = false;
    coordFinishX.forEach((finishCoordX) => {
      let finishCard: Finish = this.tab[finishCoordX][COORDSORTIEY] as Finish;
      //Si la carte n'a pas été découverte, on vérifie s'il existe un voisin valide qui n'est pas une carte vide ou une impasse à côté
      //Si la carte a déjà été découverte, il ne faut pas changer sa valeur
      if (finishCard.discovered != true) {
        let result: number[][] = this.validNeighbours(
          finishCoordX,
          COORDSORTIEY,
          FIRSTPATH
        ).concat(this.validNeighbours(finishCoordX, COORDSORTIEY, SECONDPATH));
        let discovered = false;
        result.forEach((neighbour) => {
          let neighbourCard: Card = this.tab[neighbour[0]][neighbour[1]];
          if (neighbourCard.cardId != 0) {
            let neighbourPath: Path = neighbourCard as Path;
            if (neighbourPath.deadEnd != true) discovered = true;
          }
        });

        if (discovered) {
          finishCard.discovered = discovered;
          updated = discovered;
          //Par défaut, carte charbon
          let newId: number = IDCOAL;
          let newType: number = TYPECOAL;
          //Si c'est l'or, attributs de l'or
          if (this.checkPlayerRevealOr(finishCoordX, COORDSORTIEY)) {
            newId = IDGOLD;
            newType = TYPEGOLD;
          }
          //On actualise les attributs de la carte finale
          finishCard.cardId = newId;
          finishCard.cardType = newType;
        }
      }
    });
    return updated;
  }
  //True si on peut lock/unlock la case (case dans le board, case vide et pas déjà locked/unlocked)
  public checkLock(lock: boolean, coordx: number, coordy: number): boolean {
    return (
      this.checkCellInBoard(coordx, coordy) &&
      this.tab[coordx][coordy].cardId == IDEMPTY &&
      this.tab[coordx][coordy].locked != lock
    );
  }

  public applyLock(coordx: number, coordy: number): void {
    this.tab[coordx][coordy].locked = !this.tab[coordx][coordy].locked;
  }
}
