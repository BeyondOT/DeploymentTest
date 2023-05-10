import { execPath } from "process";
import { Card } from "../Card/Card";
import { Admin } from "./admin";
import { Player } from "./Player";
import { IPLayersRevealed } from "@shared/socket";
import { Briseur } from "./briseur";
import { Debrouillard } from "./debrouillard";
import { Fixeur } from "./fixeur";
import { Hackeur } from "./hackeur";
import { Game } from "../Game/Game";

describe("Roles powerLeft", () => {
  let p = new Player(0);

  test("Admin", () => {
    let admin = new Admin(1);
    admin.power(p);
    expect(admin.powerLeft).toBe(0);
  });

  test("Briseur", () => {
    let briseur = new Briseur(2);
    briseur.power(p, true, false, false);
    expect(briseur.powerLeft).toBe(0);
  });

  test("Debrouillard", () => {
    let debrouillard = new Debrouillard(3);
    debrouillard.power();
    expect(debrouillard.powerLeft).toBe(2);
  });

  test("Fixeur", () => {
    let fixeur = new Fixeur(4);
    p.pickaxe = false;
    fixeur.power(p, true, false, false);
    expect(fixeur.powerLeft).toBe(0);
  });
});

describe("Role admin", () => {
  let rtn;
  let admin = new Admin(0);
  let p = new Player(1);
  const playerRevealed: IPLayersRevealed = {
    playerdId: p.playerId,
    saboteur: p.saboteur,
  };
  test("admin power on anotther player", () => {
    rtn = admin.power(p);
    expect(rtn).toBe(true);
    expect(admin.playersRevealed).toContainEqual(playerRevealed);
  });
  test("admin power on himself", () => {
    rtn = admin.power(admin);
    expect(rtn).toBe(false);
  });
});

describe("Role briseur", () => {
  let rtn;
  let briseur = new Briseur(0);
  let p = new Player(1);
  test("briseur can break tool", () => {
    rtn = briseur.power(p, true, false, false);
    expect(rtn).toBe(true);
    expect(briseur.powerLeft).toBe(0);
    expect(p.pickaxe).toBe(false);
  });
  test("briseur can't break a broken tool", () => {
    briseur.powerLeft = 1;
    rtn = briseur.power(p, true, false, false);
    expect(rtn).toBe(false);
    expect(briseur.powerLeft).toBe(1);
  });
  test("briseur can't break more than one tool", () => {
    rtn = briseur.power(p, true, true, false);
    expect(rtn).toBe(false);
    expect(briseur.powerLeft).toBe(1);
  });
  test("briseur can't break any tool", () => {
    briseur.powerLeft = 1;
    rtn = briseur.power(p, false, false, false);
    expect(rtn).toBe(false);
    expect(briseur.powerLeft).toBe(1);
  });
});

describe("Role Fixeur", () => {
  let rtn;
  let fixeur = new Fixeur(0);
  let p = new Player(1);
  test("frixeur can fix tool", () => {
    p.pickaxe = false;
    rtn = fixeur.power(p, true, false, false);
    expect(rtn).toBe(true);
    expect(fixeur.powerLeft).toBe(0);
    expect(p.pickaxe).toBe(true);
  });
  test("fixeur can't fix a unbroken tool", () => {
    fixeur.powerLeft = 1;
    rtn = fixeur.power(p, true, false, false);
    expect(rtn).toBe(false);
    expect(fixeur.powerLeft).toBe(1);
  });
  test("fixeur can't fix more than one tool", () => {
    rtn = fixeur.power(p, true, true, false);
    expect(rtn).toBe(false);
    expect(fixeur.powerLeft).toBe(1);
  });
  test("fixeur can't fix any tool", () => {
    fixeur.powerLeft = 1;
    rtn = fixeur.power(p, false, false, false);
    expect(rtn).toBe(false);
    expect(fixeur.powerLeft).toBe(1);
  });
});

describe("Role Hackeur", () => {
  let game = new Game([0, 1, 2]);
  let hackeur = new Hackeur(0);
  let rtn;
  test("hackeur can swap role with another role", () => {
    let hackedPlayer = new Admin(1);
    game.players[0] = hackeur;
    game.players[1] = hackedPlayer;
    hackedPlayer.powerLeft = 0;
    rtn = hackeur.power(hackedPlayer, game.players);
    expect(rtn).toBe(true);
    expect(game.players[0]).toBeInstanceOf(Admin);
    expect(game.players[0].powerLeft).toBe(0);
    expect(game.players[1]).not.toBeInstanceOf(Admin);
    expect(game.players[1]).not.toBeInstanceOf(Hackeur);
    expect(game.players[1]).toBeInstanceOf(Player);
  });
  test("hackeur can't swap with himself", () => {
    rtn = hackeur.power(hackeur, game.players);
    expect(rtn).toBe(false);
  });
});
