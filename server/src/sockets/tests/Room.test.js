const io = require('socket.io-client');
const http = require('http');
const ioBack = require('socket.io');
const rModule = require('../Room');
const smModule = require('../SocketManager');

let s1, s2, s3;
let p1, p2, p3;
let httpServer;
let httpServerAddr;
let ioServer;
let room;
let sm;

/**
 * Setup WS & HTTP servers
 */
beforeAll((done) => {
  httpServer = http.createServer().listen();
  httpServerAddr = httpServer.address();
  ioServer = ioBack(httpServer);
  done();
});

/**
 *  Cleanup WS & HTTP servers
 */
afterAll((done) => {
  ioServer.close();
  httpServer.close();
  done();
});

/**
 * Run before each test
 */
beforeEach((done) => {
  // SocketManager init
  sm = new smModule.SocketManager(ioServer);
  sm.init();

  // sockets init
  s1 = io.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, {
    'reconnection delay': 0,
    'reopen delay': 0,
    'force new connection': true,
    transports: ['websocket'],
  });
  s2 = io.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, {
    'reconnection delay': 0,
    'reopen delay': 0,
    'force new connection': true,
    transports: ['websocket'],
  });
  s3 = io.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, {
    'reconnection delay': 0,
    'reopen delay': 0,
    'force new connection': true,
    transports: ['websocket'],
  });

  // room init
  room = new rModule.Room('test', 3, ioServer,'classic',false,1);

  s3.on('connect', () => {
    p1 = sm.getPlayers()[0];
    p1.authenticate('p1','0');
    p2 = sm.getPlayers()[1];
    p2.authenticate('p2','1');
    p3 = sm.getPlayers()[2];
    p3.authenticate('p3','2');

    room.join(p1);
    room.join(p2);
    done();
  });
});

/**
 * Run after each test
 */
afterEach((done) => {
  // Cleanup
  sm.getPlayers().forEach(player => {
    if (player.getSocket().connected) {
      player.getSocket().disconnect();
    }
  });
  room.getPlayers().clear();
  sm.getRooms().clear();
  done();
});

/* describe('test du join', () => {
  test('should be added in player map', (done) => {
    expect(room.getPlayers().get('p1')).toEqual(p1);
    done();
  });
  test('game should start', (done) => {
    expect(room.getGameManager().getGame()).not.toBeNull();
    done();
  });
  test('player shouldn\'t join', (done) => {
    try {
      room.join(p3); 
    } catch (error) {
      
    }
    expect(room.getPlayers().get('p3')).toBeUndefined();
    s3.disconnect();
    done();
  });
});

describe('test de l\'échange initial', () => {
  test('player 1 should receive player state', (done) => {
    s1.on('updatePlayerState', () => {
      done();
    });
  });
  test('player 1 should receive game state', (done) => {
    s1.on('updateGameState', () => {
      done();
    });
  });
  test('player 2 should receive player state', (done) => {
    s2.on('updatePlayerState', () => {
      done();
    });
  });
  test('player 2 should receive game state', (done) => {
    s2.on('updateGameState', () => {
      done();
    });
  });
});

describe('test des coups', () => {
  test('player 1 should receive updatePlayerState', (done) => {
    // setting mock move 
    let mv = {
      player: 0,
      carte: 4,
      x: 11,
      y: 3
    }

    // emit mv
    s1.emit('playerPlayed', mv, (response) => {});

    s1.on('updatePlayerState', () => {
      done();
    });
  });
  test('player 1 should receive updateGameState', (done) => {
    // setting mock move 
    let mv = {
      player: 0,
      carte: 4,
      x: 11,
      y: 3
    }

    // emit mv
    s1.emit('playerPlayed', mv, (response) => {});

    s1.on('updateGameState', () => {
      done();
    });
  });
  test('player 2 should receive updateGameState', (done) => {
    // setting mock move 
    let mv = {
      player: 0,
      carte: 4,
      x: 11,
      y: 3
    }

    // emit mv
    s1.emit('playerPlayed', mv, (response) => {});

    s2.on('updateGameState', () => {
      done();
    });
  });
}); */

describe('test des messages', () => {
  test('p3 should receive message', (done) => {
    room = new rModule.Room('test-message', 3, ioServer,'classic',false);

    try {
      room.join(p1);
      room.join(p2);
      room.join(p3);

      let msg = {}
      msg.from = "p2";
      msg.body = "salut";
      msg.to = "all";

      s2.emit('sendChatMessage', msg, (response) => {
        if (response.status == 'failed') console.log(response.message)
      });

      s3.on('receiveChatMessage', (msg) => {
        expect(msg.from).toEqual("p2");
        expect(msg.body).toEqual("salut");
        expect(msg.to).toEqual("all");
        done();
      });
    } catch (error) {
      //console.log(error);
    }
  });
  test('p2 (saboteur) should receive message', (done) => {
    room = new rModule.Room('test-message', 3, ioServer,'classic',false);

    try {
      room.join(p1);
      room.join(p2);
      room.join(p3);

      room.setSaboteurs_l([p1, p2]);

      let msg = {}
      msg.from = "p1";
      msg.body = "salut";
      msg.to = "saboteur";

      s1.emit('sendChatMessage', msg, (response) => {});

      s2.on('receiveChatMessage', (msg) => {
        if (msg.to == "saboteur") {
          expect(msg.from).toEqual("p1");
          expect(msg.body).toEqual("salut");
          done();
        }
      });
    } catch (error) {
      //console.log(error);
    }
  });
  test('p3 (mineur) shouldn\'t receive message', () => {
    room = new rModule.Room('test-message', 3, ioServer,'classic',false);

    try {
      room.join(p1);
      room.join(p2);
      room.join(p3);

      room.setSaboteurs_l([p1, p2]);

      let msg = {}
      msg.from = "p1";
      msg.body = "salut";
      msg.to = "saboteur";

      s1.emit('sendChatMessage', msg, (response) => {});

      s3.on('receiveChatMessage', (msg) => {
        fail();
      });
    } catch (error) {
      //console.log(error);
    }
  });
  test('p3 (mineur) shouldn\'t send message', (done) => {
    room = new rModule.Room('test-message', 3, ioServer,'classic',false);

    try {
      room.join(p1);
      room.join(p2);
      room.join(p3);

      room.setSaboteurs_l([p1, p2]);

      let msg = {}
      msg.from = "p3";
      msg.body = "salut";
      msg.to = "saboteur";

      s3.emit('sendChatMessage', msg, (response) => {
        expect(response.status).toEqual('failed');
        expect(response.message).toEqual('sender is not saboteur');
        done();
      });
    } catch (error) {
      //console.log(error);
    }
  });
  test('p2 should receive private message', (done) => {
    try {

      let msg = {}
      msg.from = "p1";
      msg.body = "salut";
      msg.to = "p2";

      s1.emit('sendChatMessage', msg, (response) => {
        expect(response.status).toEqual('ok');
      });

      s2.on('receiveChatMessage', (msg) => {
        expect(msg.from).toEqual("p1");
        expect(msg.body).toEqual("salut");
        expect(msg.to).toEqual("p2");
        done();
      });
    } catch (error) {
      console.log(error);
    }
  });
});