import { Card } from "./Card";
describe("Init Card", () => {
  test("It should create a Card object", () => {
    const card = new Card(100);
    expect(card.cardId).toBe(100); //on vérifie que c'est le bon id
    expect(card).toBeInstanceOf(Card); //on vérifie que c'est bien une carte
  });
});

import { Path } from "../Card/Path";
describe("Init Path", () => {
  test("It should create a Path object", () => {
    const path = new Path(100, true, true, true, true, true);
    //On vérifie que l'id est le même
    expect(path.cardId).toBe(100);
    //On vérifie que les valeurs des booléens sont les mêmes
    expect(path.deadEnd).toBe(true);
    expect(path.north).toBe(true);
    expect(path.south).toBe(true);
    expect(path.east).toBe(true);
    expect(path.isFlipped).toBe(false);
  });
  test("It should create a simple Path", () => {
    const path = new Path(100, true, true, true, true, true, true, true);
    expect(path.hasSecondPath).toBe(false);
    expect(path.north2).toBe(false);
  });
  test("It should create a second path", () => {
    const path = new Path(
      100,
      false,
      true,
      true,
      false,
      false,
      false,
      false,
      true,
      true
    );
    expect(path.hasSecondPath).toBe(true);
    expect(path.west2).toBe(true);
    expect(path.east2).toBe(true);
    expect(path.north2).toBe(false);
    expect(path.south2).toBe(false);
  });
});
describe("Function flip", () => {
  test("Path is flipped", () => {
    //Vérifie que les valeurs des connexions sont actualisées quand le chemin est retourné
    const connexions: boolean[] = [true, false, true, false]; //Ouvert en haut et à droite
    const path: Path = new Path(
      10,
      false,
      connexions[0],
      connexions[1],
      connexions[2],
      connexions[3]
    );
    const connexionsFlipped: boolean[] = [
      connexions[1],
      connexions[0],
      connexions[3],
      connexions[2],
    ];
    expect(path.isFlipped).toBe(false);
    path.flip();
    const pathFlippedVAlues: boolean[] = [
      path.north,
      path.south,
      path.east,
      path.west,
    ];
    expect(pathFlippedVAlues).toStrictEqual(connexionsFlipped);
    expect(path.isFlipped).toBe(true);
    path.flip();
    expect(path.isFlipped).toBe(false);
  });
});
