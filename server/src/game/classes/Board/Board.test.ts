import {
  Card,
  IDEMPTY,
  IDLADDER,
  IDCOAL,
  IDGOLD,
  TYPEGOLD,
  TYPECOAL,
} from "../Card/Card";
import { Collapse } from "../Card/Collapse";
import { Finish } from "../Card/Finish";
import { Ladder } from "../Card/Ladder";
import { LadderPath } from "../Card/LadderPath";
import { Path } from "../Card/Path";
import {
  Board,
  COLUMNS,
  COORDSORTIEX,
  COORDSORTIEY,
  FIRSTPATH,
  ROW,
  SECONDPATH,
} from "./Board";
//Chemins utilisés dans les tests

const crossPath: Path = new Path(100, false, true, true, true, true); //Croisement de 4, chemin par défaut
const voidPath: Path = new Path(101, false, false, false, false, false); //Chemin sans connexions
const straightHorizontal: Path = new Path(102, false, false, false, true, true);
const straightVertical: Path = new Path(102, false, true, true, false, false);
const deadEndCross: Path = new Path(1, true, true, true, true, true);
const ladderPath: LadderPath = new LadderPath(106, false, true, false, false);
//Croisement sur les 2 chemins
const doubleCross: Path = new Path(
  2,
  false,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true
);
//Croisement sur 2eme chemin seulement
const secondCross: Path = new Path(
  2,
  false,
  false,
  false,
  false,
  false,
  true,
  true,
  true,
  true
);
//chemin horizontal sur le deuxième chemin
const secondStraighthorizontal: Path = new Path(
  3,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  true,
  true
);
//Constantes utiles
const coordLadderX: number = 3;
const coordLadderY: number = 1;
//Fonction pour modifier le charbon comme s'il avait été découvert
function discoverCoal(coalCard: Finish) {
  coalCard.discovered = true;
  coalCard.cardId = IDCOAL;
  coalCard.cardType = TYPECOAL;
}
//Fonction pour entourer une case de carte non connectées
function isolateCard(board: Board, coordX: number, coordY: number) {
  const coordsChange: number[][] = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  coordsChange.forEach((change) => {
    let curX = coordX + change[0];
    let curY = coordY + change[1];
    if (board.checkCellInBoard(curX, curY)) board.addPath(voidPath, curX, curY);
  });
}
describe("Init board", () => {
  test("It should create a Board object", () => {
    const board = new Board();
    expect(board.tab[3][1]).toBeInstanceOf(Ladder); //on vérifie que l"echelle est a la bonne place
    expect(board.tab[3][1].cardId).toBe(IDLADDER); //On vérifie que l'id de la carte est bien celle de l'échelle
    expect(board.tab[COORDSORTIEX][COORDSORTIEY]).toBeInstanceOf(Finish); //on vérifie que la sortie est a la bonne place
    expect(board.tab[4][4]).toBeInstanceOf(Card); //On vérifie qu'il y a bien des objets Card dans le board
    expect(board.tab[4][4].cardId).toBe(0); //On vérifie qu'ils ont bien l'id 0 (= carte vide)
    let boolVerif: boolean = false;
    if (board.coordOrX == 3 || board.coordOrX == 1 || board.coordOrX == 5) {
      boolVerif = true;
    }
    expect(boolVerif).toBe(true);
    expect(board.coordOrY).toBe(9);
    expect(board.ladderCoordsTab).toContainEqual([coordLadderX, coordLadderY]);
    expect(board.ladderCoordsTab.length).toBe(1);
  });
});

describe("Fonction checkGold()", () => {
  test("Should return true if gold is discovered", () => {
    //Vérifie que l'or a été découvert
    const board = new Board();
    const cardGold = board.tab[board.coordOrX][board.coordOrY] as Finish;
    cardGold.discovered = true; //On dit que l'or a été découvert
    expect(board.checkGold()).toBe(true);
  });
  test("Should return false if gold is not discovered", () => {
    //On vérifie que l'or n'est pas découvert
    const board = new Board();
    const cardGold: Finish = board.tab[board.coordOrX][
      board.coordOrY
    ] as Finish;
    expect(cardGold.discovered).toBe(false); //On vérifie que l'or n'est pas découvert par défaut
    expect(board.checkGold()).toBe(false); //On vérifie qu'il reste caché après l'appel de checkGold
  });
});

describe("Function checkPlayerReveal", () => {
  test("checks if the specified coordinates is the gold card   ", () => {
    //On vérifie qu'on recoit bien true si les coordonnées sont celles de l'or, et faux sinon
    const board = new Board();
    board.coordOrX = 5;
    board.coordOrY = 5;
    expect(board.checkPlayerRevealOr(5, 5)).toBe(true);
    expect(board.checkPlayerRevealOr(5, 6)).toBe(false);
    expect(board.checkPlayerRevealOr(6, 5)).toBe(false);
  });
});
describe("Function checkCollapse", () => {
  test("verify if checkCollapse returns the right values   ", () => {
    const board = new Board();
    board.addPath(crossPath, 3, 2);
    expect(board.checkCollapse(3, 2)).toBe(true);
    expect(board.checkCollapse(2, 5)).toBe(false); //should not work if there is no path card
    expect(board.checkCollapse(COORDSORTIEX, COORDSORTIEY)).toBe(false); //should not work on the gold
    board.addCollapse(3, 2);
    expect(board.checkCollapse(3, 2)).toBe(false);
    board.addPath(ladderPath, 4, 5);
    expect(board.checkCollapse(4, 5)).toBe(true);
  });
});
describe("Function checkRevealSubBoard", () => {
  test("verify if checkRevealSubBoard returns the right values   ", () => {
    const board = new Board();
    board.addPath(crossPath, 5, 5);
    expect(board.checkRevealSubBoard(5, 5)).toBe(false); //cannot reveal a path
    expect(board.checkRevealSubBoard(2, 5)).toBe(false); //should not work if there is no  card
    //should work on coals and gold
    expect(board.checkRevealSubBoard(COORDSORTIEX, COORDSORTIEY)).toBe(true);
    expect(board.checkRevealSubBoard(COORDSORTIEX - 2, COORDSORTIEY)).toBe(
      true
    );
    expect(board.checkRevealSubBoard(COORDSORTIEX + 2, COORDSORTIEY)).toBe(
      true
    );
  });
});

describe("Fonction checkCellOcupied", () => {
  test("It should return false on empty Cell", () => {
    //On vérifie le retour de la fonction sur une case vide
    const board = new Board();
    expect(board.checkCellOccupied(0, 0)).toBe(false);
  });
  test("It should return true on an occupied cell", () => {
    //On ajoute une carte dans le board et on vérifie la valeur de la fonction sur les coordonnées de cette carte
    const board = new Board();
    const cardAny = new Card(1);
    board.tab[0][0] = cardAny;
    expect(board.checkCellOccupied(0, 0)).toBe(true);
  });
});

describe("Fonction checkCellInBoard", () => {
  test("It should return false when cell is out of board", () => {
    //Vérifie que les coordonnées ne sont pas dans le plateau
    const board = new Board();
    //Cas classique
    expect(board.checkCellInBoard(-1, -1)).toBe(false);
    //Cas limite
    expect(board.checkCellInBoard(ROW, COLUMNS)).toBe(false);
  });
  test("It should return true when cell is in the board", () => {
    //Vérifie que les coordonnées sont dans le plateau
    const board = new Board();
    //Cas classique
    expect(board.checkCellInBoard(1, 1)).toBe(true);
    //Cas limite
    expect(board.checkCellInBoard(ROW - 1, COLUMNS - 1)).toBe(true);
  });
});
describe("Function addPath", () => {
  test("It add the path to the board at specified coord ", () => {
    //On vérifie que la fonction ajoute bien le chemin dans le board aux bonnes coordonnées
    const board = new Board();
    board.addPath(crossPath, 5, 5);
    expect(board.tab[5][5]).toBeInstanceOf(Path); //On vérifie qu'on a bien un objet Path à ces coordonnées
    expect(board.tab[5][5].cardId).toBe(crossPath.cardId); //On vérifie que c'est bien celui qu'on a ajouté
  });
  test("It adds the LadderPath to the board and to ladderCoordsTab", () => {
    //On vérifie que la fonction ajouté bien le chemin dans le board aux bonnes coordonnées et dans la liste des échelles
    const board = new Board();
    board.addPath(ladderPath, 4, 5);
    expect(board.tab[4][5]).toBeInstanceOf(LadderPath); //On vérifie qu'on a bien un objet Path à ces coordonnées
    expect(board.ladderCoordsTab).toContainEqual([4, 5]);
  });
});
describe("Function addCollapse", () => {
  test("It collapses  a specified card in the board with its coordinates   ", () => {
    //On vérifie qu'on a bien enlevé une carte après l'éboulement
    const board = new Board();
    board.addPath(crossPath, 5, 5);
    board.addCollapse(5, 5); //On lance l'éboulement
    expect(board.tab[5][5]).toBeInstanceOf(Card); //On vérifie bien qu'il reste un objet Card
    expect(board.tab[5][5].cardId).toBe(IDEMPTY); //On vérifie qu'il reste la carte vide
  });
  test("It collapses a LadderPath and removes it from list ", () => {
    //On vérifie qu'on a bien enlevé la carte après l'éboulement
    const board = new Board();
    board.addPath(ladderPath, 4, 5);
    board.addPath(ladderPath, 6, 5);
    //On vérifie que la longeur est bonne
    expect(board.ladderCoordsTab.length).toBe(3);
    board.addCollapse(6, 5);
    //On vérifie qu'un élément a été enlevé
    expect(board.ladderCoordsTab.length).toBe(2);
    expect(board.ladderCoordsTab).not.toContainEqual([6, 5]);
  });
});

describe("Fonction validConnectedPath", () => {
  test("should return true when placed surrounded by empty spaces", () => {
    //On vérifie que les cartes vides ne posent pas problème pour poser une carte en posant une carte sans connexions
    const board = new Board();
    expect(board.validConnectedPath(voidPath, 5, 5)).toBe(true);
  });
  test("should return false when it does not fit with an adjacent path", () => {
    //On vérifie qu'on ne peut pas poser une carte si elle coupe un chemin proche
    const board = new Board();
    board.tab[3][3] = straightHorizontal;
    expect(board.validConnectedPath(straightVertical, 3, 4)).toBe(false);
  });
  test("It should return true when path from Finish to Path is blocked and coal is not discovered", () => {
    //On vérifie qu'on peut poser une carte non connectée au charbon si celui-ci est encore caché
    const board = new Board();
    const coalCard: Finish = new Finish(3, 7);
    board.tab[3][7] = coalCard;
    expect(board.validConnectedPath(voidPath, 3, 6)).toBe(true);
  });
  test("It should return true when path from Finish to Path is connected and coal is discovered", () => {
    //On vérifie qu'on peut poser une carte connectée au charbon si celui-ci est découvert
    const board = new Board();
    //On décale l'or
    board.coordOrX = 0;
    board.coordOrY = 0;
    //On simule le charbon découvert
    const coalCard: Finish = board.tab[COORDSORTIEX][COORDSORTIEY] as Finish;
    discoverCoal(coalCard);
    expect(
      board.validConnectedPath(crossPath, COORDSORTIEX - 1, COORDSORTIEY)
    ).toBe(true);
  });
  test("It should return false when path from Finish to Path is blocked and coal is discovered", () => {
    //On vérifie qu'on ne peut pas poser une carte non connectée au charbon si celui-ci est découvert
    const board = new Board();
    //On décale l'or
    board.coordOrX = 0;
    board.coordOrY = 0;
    //On simule le charbon découvert
    const coalCard: Finish = board.tab[COORDSORTIEX][COORDSORTIEY] as Finish;
    discoverCoal(coalCard);
    expect(
      board.validConnectedPath(voidPath, COORDSORTIEX, COORDSORTIEY - 1)
    ).toBe(false);
  });
  test("It should return true when connected to the wall of the board", () => {
    //On vérifie qu'un chemin ne peut pas être connecté au mur du board
    const board = new Board();
    //On positionne un croisement à 4 chemins près d'un mur
    expect(board.validConnectedPath(crossPath, 0, 0)).toBe(true);
  });
});
describe("Function validNeighbours", () => {
  describe("Tests for simple Path, no second Path card", () => {
    test("It should return nothing on empty cell", () => {
      const board = new Board();
      expect(board.validNeighbours(5, 5, FIRSTPATH)).toStrictEqual([]);
      expect(board.validNeighbours(5, 5, SECONDPATH)).toStrictEqual([]);
    });
    test("It should return 4 coords next to Ladder", () => {
      const board = new Board();
      const expectedResult = [
        [coordLadderX - 1, coordLadderY, FIRSTPATH],
        [coordLadderX, coordLadderY + 1, FIRSTPATH],
        [coordLadderX + 1, coordLadderY, FIRSTPATH],
        [coordLadderX, coordLadderY - 1, FIRSTPATH],
      ];
      const result = board.validNeighbours(coordLadderX, coordLadderY);
      expect(result.length).toBe(4);
      expect(result).toEqual(expect.arrayContaining(expectedResult));
    });
    test("It should return coords of Path on top of Coal", () => {
      const board = new Board();
      //On décale l'or
      board.coordOrX = 0;
      board.coordOrY = 0;
      //On simule le charbon découvert
      const coalCard: Finish = board.tab[COORDSORTIEX][COORDSORTIEY] as Finish;
      discoverCoal(coalCard);
      isolateCard(board, COORDSORTIEX, COORDSORTIEY);
      board.addPath(crossPath, COORDSORTIEX - 1, COORDSORTIEY);
      let result = board.validNeighbours(COORDSORTIEX, COORDSORTIEY);
      expect(result.length).toBe(1);
      expect(result).toContainEqual([
        COORDSORTIEX - 1,
        COORDSORTIEY,
        FIRSTPATH,
      ]);
    });
    test("It should return 2 coords on straight Path", () => {
      const board = new Board();
      const expectedResult = [
        [5, 4, FIRSTPATH],
        [5, 6, FIRSTPATH],
      ];
      board.addPath(straightHorizontal, 5, 5);
      const result = board.validNeighbours(5, 5);
      expect(result.length).toBe(expectedResult.length);
      expect(result).toEqual(expect.arrayContaining(expectedResult));
    });
    test("It should return 4 coords next to discovered Coal", () => {
      const board = new Board();
      //On simule le charbon découvert
      const coalCard: Finish = board.tab[COORDSORTIEX][COORDSORTIEY] as Finish;
      discoverCoal(coalCard);
      const expectedResult = [
        [COORDSORTIEX - 1, COORDSORTIEY, FIRSTPATH],
        [COORDSORTIEX, COORDSORTIEY + 1, FIRSTPATH],
        [COORDSORTIEX - 1, COORDSORTIEY, FIRSTPATH],
        [COORDSORTIEX, COORDSORTIEY - 1, FIRSTPATH],
      ];
      const result = board.validNeighbours(COORDSORTIEX, COORDSORTIEY);
      expect(result.length).toBe(expectedResult.length);
      expect(result).toEqual(expect.arrayContaining(expectedResult));
    });
    test("It should return 2 coords on straight Path near discovered Coal", () => {
      const board = new Board();
      const expectedResult = [
        [COORDSORTIEX, COORDSORTIEY - 2, FIRSTPATH],
        [COORDSORTIEX, COORDSORTIEY, FIRSTPATH],
      ];
      //On simule le charbon découvert
      const coalCard: Finish = board.tab[COORDSORTIEX][COORDSORTIEY] as Finish;
      discoverCoal(coalCard);
      board.addPath(straightHorizontal, COORDSORTIEX, COORDSORTIEY - 1);
      const result = board.validNeighbours(COORDSORTIEX, COORDSORTIEY - 1);
      expect(result.length).toBe(expectedResult.length);
      expect(result).toEqual(expect.arrayContaining(expectedResult));
    });
  });
  describe("Tests for double Path only", () => {
    //Tests pour les cartes type pont et courbes doubles
    //Si les tests ne passent pas, il est mieux de retirer les cartes de ce type
    //Coordonnées d'un point au milieu du plateau (entouré de vide)
    const coordMiddleX: number = coordLadderX;
    const coordMiddleY: number = coordLadderY + 3;

    test("It should return the right coords twice but on a different path", () => {
      const board = new Board();
      const expectedResult = [
        [coordMiddleX, coordMiddleY + 1, FIRSTPATH],
        [coordMiddleX, coordMiddleY + 1, SECONDPATH],
        [coordMiddleX, coordMiddleY - 1, FIRSTPATH],
        [coordMiddleX, coordMiddleY - 1, SECONDPATH],
      ];
      isolateCard(board, coordMiddleX, coordMiddleY);
      board.addPath(straightHorizontal, coordMiddleX, coordMiddleY);
      board.addPath(doubleCross, coordMiddleX, coordMiddleY - 1);
      board.addPath(doubleCross, coordMiddleX, coordMiddleY + 1);
      let result = board.validNeighbours(coordMiddleX, coordMiddleY);
      expect(result.length).toBe(4);
      expect(result).toEqual(expect.arrayContaining(expectedResult));
    });
    test("It should return the coordinates of the second Path", () => {
      const board = new Board();
      const expectedResult = [
        [coordMiddleX, coordMiddleY + 1, SECONDPATH],
        [coordMiddleX, coordMiddleY - 1, SECONDPATH],
      ];
      isolateCard(board, coordMiddleX, coordMiddleY);
      board.addPath(straightHorizontal, coordMiddleX, coordMiddleY);
      board.addPath(secondCross, coordMiddleX, coordMiddleY - 1);
      board.addPath(secondCross, coordMiddleX, coordMiddleY + 1);
      let result = board.validNeighbours(coordMiddleX, coordMiddleY);
      expect(result.length).toBe(2);
      expect(result).toEqual(expect.arrayContaining(expectedResult));
    });
    test("It should return coordinates of adjacent path when done on second path", () => {
      const board = new Board();
      const expectedResult = [
        [coordMiddleX, coordMiddleY + 1, SECONDPATH],
        [coordMiddleX, coordMiddleY - 1, SECONDPATH],
      ];
      isolateCard(board, coordMiddleX, coordMiddleY);
      board.addPath(secondStraighthorizontal, coordMiddleX, coordMiddleY);
      board.addPath(secondCross, coordMiddleX, coordMiddleY - 1);
      board.addPath(secondCross, coordMiddleX, coordMiddleY + 1);
      let result = board.validNeighbours(
        coordMiddleX,
        coordMiddleY,
        SECONDPATH
      );
      expect(result.length).toBe(2);
      expect(result).toEqual(expect.arrayContaining(expectedResult));
    });
  });
});
describe("Function checkPaths", () => {
  const board = new Board();
  board.addPath(ladderPath, 5, 5);
  test("It should work with another ladder", () => {
    expect(board.checkPaths(crossPath, 6, 5)).toBe(true);
    expect(board.checkPaths(crossPath, 7, 5)).toBe(false);
  });
  test("It should still work with first ladder", () => {
    expect(board.checkPaths(crossPath, 3, 2)).toBe(true);
  });
});
describe("Fonction checkPath", () => {
  test("checkPath on unreachable cell should return false", () => {
    //On vérifie qu'on ne peut pas poser un chemin non valide
    const board = new Board();
    //On vérifie pour un chemin au milieu du plateau, connecté à aucunes cartes
    expect(board.checkPath(crossPath, 5, 5)).toBe(false);
  });

  test("checkPath should return true when the path is valid", () => {
    //On vérifie qu'on peut poser un chemin valide
    const board = new Board();
    //On vérifie pour un croisement à 4 directions près de l'échelle
    expect(board.checkPath(crossPath, coordLadderX, coordLadderY + 1)).toBe(
      true
    );
  });
  test("checkPath should return false on testIssue1", () => {
    //On vérifie que checkPath retourne bien false pour le test de l'issue 17
    //Impasse posé alors que non connecté
    const board = new Board();
    const deadEndNorthEast = new Path(2, true, true, false, true, false);
    //Avant ajout croisement à 4 chemins
    expect(board.checkPath(deadEndNorthEast, 3, 3)).toBe(false);
    board.addPath(crossPath, coordLadderX, coordLadderY);
    //Après ajour croisement à 4 chemins
    expect(board.checkPath(deadEndNorthEast, 3, 3)).toBe(false);
  });
  test("checkPath should return false on testIssue2", () => {
    //On vérifie le 2eme cas d'erreur dans l'issue 17
    const board = new Board();
    const threeWay = new Path(1, false, true, false, true, true);
    const cornerRight = new Path(2, false, false, true, true, false);
    board.addPath(threeWay, 3, 2);
    board.addPath(threeWay, 3, 3);
    board.addPath(cornerRight, 2, 2);
    expect(board.checkPath(cornerRight, 2, 3)).toBe(false);
  });
  test("checkPath should return true on testIssue3", () => {
    const board = new Board();
    const crossSection = new Path(1, false, true, true, true, true);
    const straightHorizontal = new Path(2, false, false, false, true, true);
    const threeCrossNotDown = new Path(3, false, true, false, true, true);
    const threeCrossNotWest = new Path(4, false, true, true, true, false);
    board.addPath(crossSection, 3, 2);
    board.addPath(straightHorizontal, 3, 3);
    board.addPath(threeCrossNotWest, 2, 2);
    expect(board.checkPath(threeCrossNotDown, 2, 3)).toBe(true);
  });
  test("checkPath should return true for Path near Coal", () => {
    const board = new Board();
    //On enlève l'or
    board.coordOrX = 0;
    board.coordOrY = 0;
    //On ajoute un chemin jusqu'à une carte finale
    board.addPath(straightHorizontal, coordLadderX, coordLadderY + 1);

    //On simule le charbon découvert
    const coalCard: Finish = new Finish(coordLadderX, coordLadderY + 2);
    discoverCoal(coalCard);
    board.tab[coordLadderX][coordLadderY + 2] = coalCard;
    //On vérifie au-dessus du charbon
    expect(board.checkPath(crossPath, COORDSORTIEX - 1, coordLadderY + 2)).toBe(
      true
    );
  });
  test("Test should return true when path goes through a second path", () => {
    const board = new Board();
    board.addPath(secondStraighthorizontal, coordLadderX, coordLadderY + 1);
    expect(
      board.checkPath(straightHorizontal, coordLadderX, coordLadderY + 2)
    ).toBe(true);
  });
  test("You shouldn't be able to place a path near an unconnected LadderPath", () => {
    const board = new Board();
    board.addPath(ladderPath, 5, 5);
    expect(board.checkPath(crossPath, 4, 5, 5, 5)).toBe(false);
  });
});
describe("Function reachableEmptyCells", () => {
  test("It should return start's neighbours", () => {
    const board: Board = new Board();
    const expectedReturn: number[][] = [
      [coordLadderX + 1, coordLadderY],
      [coordLadderX - 1, coordLadderY],
      [coordLadderX, coordLadderY + 1],
      [coordLadderX, coordLadderY - 1],
    ];
    const reachableCellsReturn: number[][] = board.reachableEmptyCells(
      coordLadderX,
      coordLadderY
    );
    expect(reachableCellsReturn.length).toBe(expectedReturn.length);
    expect(reachableCellsReturn).toEqual(
      expect.arrayContaining(expectedReturn)
    );
  });
});
describe("Function dfsPath", () => {
  test("It should return start and its 4 neighbours", () => {
    const board: Board = new Board();
    const expectedReturn: number[][] = [
      [coordLadderX, coordLadderY],
      [coordLadderX + 1, coordLadderY],
      [coordLadderX - 1, coordLadderY],
      [coordLadderX, coordLadderY + 1],
      [coordLadderX, coordLadderY - 1],
    ];
    const dfsReturn: number[][] = board.dfsPath(coordLadderX, coordLadderY);
    expect(dfsReturn.length).toBe(expectedReturn.length);
    expect(dfsReturn).toEqual(expect.arrayContaining(expectedReturn));
  });
  test("It should return the empty cell coords when done on an empty cell", () => {
    const board: Board = new Board();
    const dfsReturn: number[][] = board.dfsPath(
      coordLadderX + 1,
      coordLadderY + 1
    );
    expect(dfsReturn.length).toBe(1);
    expect(dfsReturn).toContainEqual([coordLadderX + 1, coordLadderY + 1]);
  });
  test("It works with dead ends", () => {
    const board: Board = new Board();
    const expectedReturn: number[][] = [
      [coordLadderX, coordLadderY],
      [coordLadderX + 1, coordLadderY],
      [coordLadderX - 1, coordLadderY],
      [coordLadderX, coordLadderY + 1],
      [coordLadderX, coordLadderY - 1],
    ];
    isolateCard(board, coordLadderX, coordLadderY);
    board.addPath(deadEndCross, coordLadderX, coordLadderY + 1);
    board.addPath(crossPath, coordLadderX, coordLadderY + 2);
    //Vérifie que ne cherche pas un chemin apres une impasse
    let dfsReturn: number[][] = board.dfsPath(coordLadderX, coordLadderY);
    expect(dfsReturn.length).toBe(expectedReturn.length);
    expect(dfsReturn).toEqual(expect.arrayContaining(expectedReturn));
    //vérifie que le chemin s'arrête sur l'impasse
    dfsReturn = board.dfsPath(coordLadderX, coordLadderY + 1);
    expect(dfsReturn.length).toBe(1);
    expect(dfsReturn).toContainEqual([coordLadderX, coordLadderY + 1]);
  });
  test("Return should include coords of Path on top of Coal", () => {
    const board = new Board();
    //On enlève l'or
    board.coordOrX = 0;
    board.coordOrY = 0;
    //On ajoute un chemin jusqu'à une carte finale
    board.addPath(crossPath, coordLadderX, coordLadderY + 1);
    //On simule le charbon découvert
    const coalCard: Finish = new Finish(coordLadderX, coordLadderY + 2);
    board.tab[coordLadderX][coordLadderY + 2] = coalCard;
    discoverCoal(coalCard);
    //On ajoute le chemin au-dessus du charbon
    board.addPath(crossPath, coordLadderX, coordLadderY + 2);
    expect(board.dfsPath(coordLadderX, coordLadderY)).toContainEqual([
      coordLadderX - 1,
      coordLadderY + 2,
    ]);
  });
});
describe("Fonction updateDiscovered()", () => {
  test("updateDiscovered should work if gold has been reached", () => {
    //Vérifie que la carte finale est découverte si il existe un chemin connecté à celle-ci
    const board = new Board();
    const finish: Finish = board.tab[COORDSORTIEX][COORDSORTIEY] as Finish;
    //On met l'or à ces coordonnées
    board.coordOrX = COORDSORTIEX;
    //On place un croisement à 4 directions à côté de la fin
    board.tab[COORDSORTIEX - 1][COORDSORTIEY] = crossPath;
    //On vérifie que le retour est bien true (une carte a été découverte)
    expect(board.updateDiscovered()).toBe(true);
    //On vérifie que discovered a été modifié en conséquence
    expect(finish.discovered).toBe(true);
    //On vérifie que l'id de la carte est bien modifié à IDGOLD
    expect(finish.cardId).toBe(IDGOLD);
    expect(finish.cardType).toBe(TYPEGOLD);
  });
  test("discovered should work if a coal has been reached", () => {
    //Vérifie que la carte finale est découverte si il existe un chemin connecté à celle-ci
    const board = new Board();
    const finish: Finish = board.tab[COORDSORTIEX][COORDSORTIEY] as Finish;
    //On déplace l'or au cas où
    board.coordOrX = COORDSORTIEX + 2;
    //On place un croisement à 4 directions à côté de la fin
    board.tab[COORDSORTIEX - 1][COORDSORTIEY] = crossPath;
    //On vérifie que le retour est bien true (une carte a été découverte)
    expect(board.updateDiscovered()).toBe(true);
    //On vérifie que discovered a été modifié en conséquence
    expect(finish.discovered).toBe(true);
    //On vérifie que l'id de la carte est bien modifié à IDCOAL
    expect(finish.cardId).toBe(IDCOAL);
    expect(finish.cardType).toBe(TYPECOAL);
  });
  test("updateDiscovered should return false and discovered should remain false if there are no cards connected to Finish", () => {
    //On vérifie que la carte reste caché si elle n'a pas été découverte pas un joueur
    const board = new Board();
    const finish: Finish = board.tab[COORDSORTIEX][COORDSORTIEY] as Finish;
    //On vérifie que le retour est bien false (aucune carte n'a été découverte)
    expect(board.updateDiscovered()).toBe(false);
    //On vérifie que discovered n'a pas été modifié
    expect(finish.discovered).toBe(false);
  });
});
describe("Lock/Unlock", () => {
  let board = new Board();
  board.tab[3][2] = crossPath;
  describe("Function checkLock", () => {
    test("on ladder card", () => {
      expect(board.checkLock(true, 3, 1)).toBe(false);
    });
    test("on finish card", () => {
      expect(board.checkLock(true, 5, 9)).toBe(false);
      expect(board.checkLock(true, 3, 9)).toBe(false);
      expect(board.checkLock(true, 1, 9)).toBe(false);
    });
    test("on empty card", () => {
      expect(board.checkLock(true, 3, 3)).toBe(true);
    });
    test("on path card", () => {
      expect(board.checkLock(true, 3, 2)).toBe(false);
    });
  });
  describe("Function applyLock", () => {
    test("on unlocked card", () => {
      board.tab[5][5].locked = false;
      board.applyLock(5, 5);
      expect(board.tab[5][5].locked).toBe(true);
    });
    test("on locked card", () => {
      board.tab[5][5].locked = true;
      board.applyLock(5, 5);
      expect(board.tab[5][5].locked).toBe(false);
    });
  });
});
