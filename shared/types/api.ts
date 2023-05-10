export interface IUser {
  _id: string;
  pseudo: string;
  email: string;
  games: number;
  win: number;
  friends: string[];
  password: string;
  gold: number;
  createdAt: Date;
  updatedAt: Date;
}



export interface ResponseLayout {
  message: string;
}

export interface ResponseError extends ResponseLayout {
  body: Error;
}

export interface ResponseGetFriends extends ResponseLayout {
  body: IUser[];
}

export interface ResponseGetAllUsers extends ResponseLayout {
  body: IUser[];
}

export interface IUserRegister {
  pseudo: string;
  email: string;
  password: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}
