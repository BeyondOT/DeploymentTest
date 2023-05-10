import { CreateRoomParams, IAuthSocket, IMessage } from "@shared/socket";
import { Server, Socket } from "socket.io";
import { Room } from "./Room";
import { SocketPlayer } from "./SocketPlayer";

export class SocketManager {
  private rooms: Map<string, Room> = new Map();
  private players: SocketPlayer[];
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    this.players = [];
  }

  /** Initialise la socket qui vient de se connecter. */
  public init(): void {
    this.io.on("connection", (socket: Socket) => {
      console.log("Un utilisateur s'est connecté");
      let p = new SocketPlayer(socket);
      this.players.push(p);

      // Appeler les fonctions pour gérer les événements
      this.handleAuthentication(p);
      this.handleCreateRoom(p);
      this.handleJoinRoom(p);
      this.handleCreateGameTest(p);
      this.handlePrivateMessage(p);
      this.handleDisconnect(p);
    });
  }

  /**
   * Ecoute sur la socket l'évènement authSuccess.
   * Lorsqu'il est reçu le SocketPlayer s'authentifie.
   */
  private handleAuthentication(player: SocketPlayer): void {
    const s: Socket = player.getSocket();
    s.on("authSuccess", (data: IAuthSocket, callback) => {
      player.authenticate(data.pseudo, data.userId);
      if (player.getPseudo() != "" && player.getId() != "" && player.isAuth())
        callback({ status: "ok" });
      else
        callback({
          status: "failed",
          message: "les données du joueurs n'ont pas pu être initialisées.",
        });
    });
  }

  /**
   * Ecoute sur la socket l'évènement createRoom.
   * Lorsqu'il est reçu, si possible la room est créée, et le SocketPlayer y
   * est ajouté.
   */
  private handleCreateRoom(player: SocketPlayer): void {
    const s: Socket = player.getSocket();
    s.on("createRoom", (roomParams: CreateRoomParams, callback) => {
      // deconstruct for easier access
      const { roomName, numberOfPlayers, gameMode, nbIA } = roomParams;
      // Check room size
      if (this.rooms.size > 90) {
        callback({
          status: "failed",
          message: "aucune room disponible",
        });
        return;
      }
      // Check if room exists
      if (this.checkRoomName(roomName)) {
        callback({
          status: "failed",
          message: "une room de ce nom existe déjà",
        });
        return;
      }
      try {
        let r: Room = 
          new Room(roomName, numberOfPlayers, this.io, gameMode, false, nbIA);
        this.rooms.set(roomName, r);
        r.join(player);
        callback({
          status: "ok",
        });
        return;
      } catch (error) {
        if (error instanceof Error) {
          callback({
            status: "failed",
            message: error.message,
          });
          return;
        }
      }
    });
    return;
  }

  /**
   * Ecoute sur la socket l'évènement joinRoom.
   * Lorsqu'il est reçu si la room existe, le SocketPlayer y est ajouté.
   */
  private handleJoinRoom(player: SocketPlayer): void {
    const s: Socket = player.getSocket();
    s.on("joinRoom", (roomParams: CreateRoomParams, callback) => {
      const { roomName, numberOfPlayers } = roomParams;
      // We try to join the game
      if (this.checkRoomName(roomName)) {
        this.rooms.get(roomName)?.join(player);
        callback({
          status: "ok",
        });
      } else {
        callback({
          status: "failed",
          message: "Cette room n'existe pas.",
        });
      }
    });
  }

  /**
   * Ecoute sur la socket l'évènement createGameTest.
   * Lorsqu'il est reçu si c'est possible, le SocketPlayer est ajouté à une 
   * GameTest.
   */
  private handleCreateGameTest(player: SocketPlayer): void {
    const s: Socket = player.getSocket();
    s.on("createGameTest", (roomParams: CreateRoomParams, callback) => {
      if (this.rooms.size > 90) {
        callback({
          status: "failed",
          message: "aucune room disponible",
        });
        return;
      }
      try {
        const { roomName, gameMode } = roomParams;
        let name: string = roomName === "" ? "TEST" : roomName;
        let r: Room = new Room(name, 3, this.io, gameMode, true);
        this.rooms.set(roomParams.roomName, r);
        this.rooms.get(roomParams.roomName)?.join(player);
        callback({
          status: "ok",
        });
        return;
      } catch (error) {
        if (error instanceof Error) {
          callback({
            status: "failed",
            message: error.message,
          });
          return;
        }
      }
    });
  }

  /**
   * Ecoute sur la socket l'évènement sendDM.
   * Lorsqu'il est reçu, si le destinataire est valide, le message est
   * retransmis.
   */
  private handlePrivateMessage(player: SocketPlayer ): void {
    const s: Socket = player.getSocket(); 
    s.on("sendDM",  (msg: IMessage, callback) => {
      // Check if player is a friend
      let receiver: Socket | undefined = player.findFriend(msg.to);
      if (receiver != undefined) {
        receiver.emit("recvDM", msg);
        callback({
          status: "ok",
        });
      } else {
        callback({
          status: "failed",
          message: "user isn't connected or isn't a friend",
        });
      }
    });
  }

  /**
   * Ecoute sur la socket l'évènement disconnecting.
   * Lorsqu'il est reçu le SocketPlayer est enlevé de la room à laquelle il
   * appartenait.
   */
  private handleDisconnect(player: SocketPlayer): void {
    const s: Socket = player.getSocket();
    s.on("disconnecting", (reason) => {
      this.rooms.forEach(r => {
        if (player.getSocket().rooms.has(r.getName())) {
          if (r.removePlayer(player)) {
            this.rooms.delete(r.getName());
          }
        }
      });
    });
  }

  /** Test d'existence d'une room. */
  private checkRoomName(roomName: string): boolean {
    return this.rooms.has(roomName);
  }
  
  // for testing
  /** Récupère toutes les rooms existantes. */
  public getRooms(): Map<string, Room> {
    return this.rooms;
  }
  /** Récupère tous les SocketPlayer connectés. */
  public getPlayers(): SocketPlayer[] {
    return this.players;
  }
}
