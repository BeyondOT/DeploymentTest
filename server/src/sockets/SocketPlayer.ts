import { Socket } from "socket.io";

export class SocketPlayer {
  private pseudo: string;
  private id_bdd: string;
  private inGameId: number;
  private socket: Socket;
  private auth: boolean;
  private friends: SocketPlayer[];

  constructor(socket: Socket) {
    this.socket = socket;
    this.pseudo = "";
    this.id_bdd = "";
    this.inGameId = -1;
    this.auth = false;
    this.friends = [];
  }

  /** Initialise le pseudo et l'id de la bdd */
  public authenticate(pseudo: string, id_bdd: string): void {
    this.pseudo = pseudo;
    this.id_bdd = id_bdd;
    this.auth = true;
  }

  /** Vérifie que le joueur est connecté. */
  public isAuth(): boolean {
    return this.auth;
  }

  /** Modifie l'id dans une partie. */
  public setInGameId(id: number): void {
    this.inGameId = id;
  }
  /** Modifie le pseudo. */
  public setPseudo(pseudo: string): void {
    this.pseudo = pseudo;
  }
  /** Ajoute un ami à la liste. */
  public addFriend(p: SocketPlayer): void {
    this.friends.push(p);
  }

  /** Retourne le pseudo. */
  public getPseudo(): string {
    return this.pseudo;
  }
  /** Retourne l'id de la bdd. */
  public getId(): string {
    return this.id_bdd;
  }
  /** Retourne l'id dans la partie. */
  public getInGameId(): number {
    return this.inGameId;
  }
  /** Retourne la socket. */
  public getSocket(): Socket {
    return this.socket;
  }
  /** Retourne la liste des amis. */
  public getFriends(): SocketPlayer[] {
    return this.friends;
  }

  /** 
   * Recherche un ami par pseudo.
   * @returns la Socket de l'ami s'il est trouvé, sinon undefined.
   */
  public findFriend(pseudo: string): Socket | undefined {
    let s: Socket | undefined;
    for (let i = 0; i < this.friends.length; i++) {
      const f = this.friends[i];
      if (f.getPseudo() === pseudo) s = f.getSocket();
    }
    return s;
  }

  public toString(): string {
    return this.pseudo + "#" + this.getId();
  }
}
