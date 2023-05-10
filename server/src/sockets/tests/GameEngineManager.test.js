const gemModule = require('../GameEngineManager');
const spModule = require('../SocketPlayer');
const playerModule = require('../../game/classes/Player/Player');
const { execPath } = require('process');

let gem;
let players;
let p;

beforeAll((done) => {
  // setting the player
  let s = 'mock-socket'
  let sp = new spModule.SocketPlayer(s);
  sp.authenticate('joueur-test','deadbeef');
  sp.setInGameId(0);
  // setting game-engine manager
  players = new Map();
  players.set(sp.getPseudo(),sp);
  gem = new gemModule.GameEngineManager();
  gem.init(players,'classic');
  
  // setting test player
  p = gem.getGame().players[0];
  p.cart = true;
  p.pickaxe = false;
  p.torch = false;
  p.saboteur = true;
  done();
});

describe('On vérifie que les informations récupérées sont les bonnes', () =>{
	test('test des player infos', (done) => {
		let pi = gem.getPlayerInfos(0);

		expect(pi.tools.cart).toBe(true);
		expect(pi.tools.pickaxe).toEqual(false);
		expect(pi.tools.lantern).toEqual(false);
		expect(pi.userId).toEqual(0);
		expect(pi.role).toEqual('Saboteur');
		expect(pi.cardsHeld).toEqual(p.cardsInHand);

		done();
	});
	test('test du game state', (done) => {
		let gs = gem.getGameState();

		let pi = gs.players[0];
		expect(pi.tools.cart).toBe(true);
		expect(pi.tools.pickaxe).toEqual(false);
		expect(pi.tools.lantern).toEqual(false);
		expect(pi.userId).toEqual(0);
		expect(pi.nbCards).toEqual(p.cardsInHand.length);

		let b_src = gem.getGame().gameBoard;
		let b_dst = gs.board;
		for (let i = 0; i < b_src.tab.length; i++) {
			for(let j = 0; j < b_src.tab[i].length; j++) {
				let card_src = b_src.tab[i][j];
				let card_dst = b_dst[i][j];
				expect(card_src.cardId).toEqual(card_dst.cardId);
				expect(card_src.cardType).toEqual(card_dst.cardType);
			}
		}

		done();
	});
});