const io = require('socket.io-client');
const http = require('http');
const ioBack = require('socket.io');
const smModule = require('../SocketManager');

let socket, s2;
let httpServer;
let httpServerAddr;
let ioServer;
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
  sm = new smModule.SocketManager(ioServer);
  sm.init();
  socket = io.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, {
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
  socket.on('connect', () => {
    done();
  });
});

/**
 * Run after each test
 */
afterEach((done) => {
  // Cleanup
  if (socket.connected) {
    socket.disconnect();
  }
  if (s2.connected) {
    s2.disconnect();
  }
  sm.getRooms().clear();
  done();
});

describe('test de connection', () => {
  test('socket should be connected and should be added as a player', (done) => {
    expect(socket.connected).toBeTruthy();
    expect(sm.players[0]).toBeDefined();
    done();
  })
  test('should communicate client to server', (done) => {
    socket.emit('msg', 'Salut!');

    setTimeout(() => {
      ioServer.on('msg', (msg) => {
        expect(msg).toBe('Salut!');
      })
      done();
    }, 50);
  });
  test('should communicate server to client', (done) => {
    ioServer.emit('msg', 'Salut!');

    setTimeout(() => {
      socket.on('msg', (msg) => {
        expect(msg).toBe('Salut!');
      })
      done();
    }, 50);
  });
});

describe('test des handlers', () => {
  test('should create room', (done) => {
    // Client emit createRoom
    let roomParam = {
      roomName: 'partie1',
      numberOfPlayers: 5,
      gameMode: 'classic'
    }
    socket.emit('createRoom', roomParam, (response) => {});

    setTimeout(() => {
      expect(sm.getRooms().get(roomParam.roomName)).toBeDefined();
      done();
    }, 50);
  });
  test('should join room', (done) => {
    let roomParam = {
      roomName: 'partie1',
      numberOfPlayers: 5,
      gameMode: 'classic'
    }
    sm.getPlayers()[0].authenticate('p1','0')

    // Client emit createRoom
    socket.emit('createRoom', roomParam, (response) => {});

    // 2eme client emit joinRoom
    let s2 = io.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, {
      'reconnection delay': 0,
      'reopen delay': 0,
      'force new connection': true,
      transports: ['websocket'],
    });
    s2.on("connect", () => { 
      sm.getPlayers()[1].authenticate('p2','1')
      s2.emit('joinRoom', roomParam, (response) => {});

      setTimeout(() => {
        expect(sm.getRooms().get('partie1')?.getPlayers().size).toBe(2);
        s2.disconnect();
        done();
      }, 50);
    });
  });
  test('should init player\'s name and id', (done) => {
    socket.emit('authSuccess', {pseudo:'test', userId:'deadbeef'}, (response) => {});

    setTimeout(() => {
      const p_l = sm.getPlayers();
      const name = p_l[0].getPseudo();
      const id = p_l[0].getId();
      expect(name).toEqual('test');
      expect(id).toEqual('deadbeef');
      expect(p_l[0].isAuth()).toBeTruthy();
      done();
    }, 50);
  });
});

describe('test du chat privé', () => {
  test('p2 should receive dm', (done) => {
    sm.getPlayers()[0].authenticate('p1','0');
    sm.getPlayers()[1].authenticate('p2','1');
    sm.getPlayers()[0].addFriend(sm.getPlayers()[1]);

    let msg = {
      from:'p1',
      body:'salut',
      to:'p2'
    }

    socket.emit("sendDM", msg, (response) => {});

    s2.on("recvDM", (chat) => {
      expect(chat).toEqual(msg);
      done();
    })
  });
  test('should fail with error', (done) => {
    let msg = {
      from:'p1',
      body:'salut',
      to:'ghost'
    }

    socket.emit("sendDM", msg, (response) => {
      expect(response.status).toEqual('failed');
      expect(response.message).toEqual('user isn\'t connected or isn\'t a friend');
      done();
    });
  });
  test('p2 shouldn\'t receive dm', (done) => {
    sm.getPlayers()[0].authenticate('p1','0');
    sm.getPlayers()[1].authenticate('p2','1');

    let msg = {
      from:'p1',
      body:'salut',
      to:'p2'
    }

    socket.emit("sendDM", msg, (response) => {
      expect(response.status).toEqual('failed');
      expect(response.message).toEqual('user isn\'t connected or isn\'t a friend');
      done();
    });
  });
})