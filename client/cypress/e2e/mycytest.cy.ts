function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}
let roomName: string = "TestRoom" + getRandomInt(200).toString();

describe("creates a game", () => {
  it("it creates a party", () => {
    cy.visit("http://localhost:3000/");
    cy.get("a").contains("Create Party").click();
    cy.get('input[name="partyName"]').type(roomName);
    cy.get("button").contains("Create party !").click();
    cy.wait(1000);
  });
});

describe("joins a game 1", () => {
  it("it joins a party 1", () => {
    cy.visit("http://localhost:3000/");
    cy.get("li").contains("Join Party").click();
    cy.get('input[name="partyName"]').type(roomName);
    cy.get("button").contains("Join Party").click();
    cy.wait(1000);
    cy.get("div");
  });
});

describe("joins a game 2", () => {
  it("it joins a party 2", () => {
    cy.visit("http://localhost:3000/");
    cy.get("li").contains("Join Party").click();
    cy.get('input[name="partyName"]').type(roomName);
    cy.get("button").contains("Join Party").click();
    cy.wait(1000);
    cy.get("div");
  });
});
