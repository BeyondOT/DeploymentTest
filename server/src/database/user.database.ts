import { ObjectId } from "mongodb";
import UserModel, { IUser } from "../models/user.model";
import { Error } from "mongoose";

export interface friend {
  id: string;
  pseudo: string;
}

export const userInsert = async (user: IUser): Promise<IUser | Error> => {
  try {
    let ifUser: IUser | null = await UserModel.findOne({
      $or: [{ pseudo: user.pseudo }, { email: user.email }],
    });
    if (ifUser == null) {
      let insertedUser: IUser = await UserModel.create(user);
      return insertedUser;
    } else {
      return new Error("Error: userInsert(user semblable deja existant)");
    }
  } catch (error) {
    return new Error("Error: userInsert(Error)");
  }
};

export const userFindById = async (id: ObjectId): Promise<IUser | null | Error> => {
  try {
    let user: IUser | null = await UserModel.findById({ _id: id });
    return user;
  } catch (error) {
    return new Error("Error: userFindById");
  }
};

export const userGetAll = async (): Promise<IUser[] | null | Error> => {
  try {
    let users: IUser[] | null = await UserModel.find();
    return users;
  } catch (error) {
    return new Error("Error: userGetAll");
  }
};

export const userRemoveById = async (id: ObjectId): Promise<number | Error> => {
  try {
    let users = await UserModel.deleteOne({ _id: id }, { new: true });
    return users.deletedCount;
  } catch (error) {
    return new Error("Error: userRemoveById");
  }
};

export const userAddFriend = async (
  ida: string,
  idb: string
): Promise<(IUser | null)[] | null | Error> => {
  try {
    let usera: IUser | null = await UserModel.findOneAndUpdate(
      { _id: ida },
      { $push: { friends: idb } },
      { new: true }
    );
    let userb: IUser | null = await UserModel.findOneAndUpdate(
      { _id: idb },
      { $push: { friends: ida } },
      { new: true }
    );
    let users: (IUser | null)[] = [usera, userb];
    return users;
  } catch (error) {
    return new Error("Error: userAddFriend");
  }
};

export const userRemoveFriend = async (
  ida: string,
  idb: string
): Promise<(IUser | null)[] | null | Error> => {
  try {
    let usera: IUser | null = await UserModel.findOneAndUpdate(
      { _id: ida },
      { $pull: { friends: idb } },
      { new: true }
    );
    let userb: IUser | null = await UserModel.findOneAndUpdate(
      { _id: idb },
      { $pull: { friends: ida } },
      { new: true }
    );
    let users: (IUser | null)[] = [usera, userb];
    return users;
  } catch (error) {
    return new Error("Error: userRemoveFriend");
  }
};

// Je ne suis pas sur que celle la donne le résultat attendu. (chercher comment utiliser populate)
export const userGetFriends = async (id: ObjectId): Promise<IUser[] | null | Error> => {
  try {
    let user: IUser = (await UserModel.findById(id).populate(
      "friends",
      "-password"
    )) as IUser;

    let userFriends: IUser[] = user.friends as IUser[];
    return userFriends;
  } catch (error) {
    return new Error("Error: userGetFriends");
  }
};

export const userGetAllFriends = async (
  id: ObjectId
): Promise<IUser[] | null | Error> => {
  try {
    let friends: IUser[] | null = await UserModel.findById(
      { _id: id },
      { _id: 0, friends: 1 }
    ).populate("friends");
    return friends;
  } catch (error) {
    return new Error("Error: userGetFriends");
  }
};

export const userLeaderBoardGold = async (): Promise<IUser[] | null | Error> => {
  try {
    let users: IUser[] | null = await UserModel.find().sort({ gold: -1 }).limit(10);
    return users;
  } catch (error) {
    return new Error("Error: userLeaderboardGold");
  }
};

export const userLeaderboardWin = async (): Promise<IUser[] | null | Error> => {
  try {
    let users: IUser[] | null = await UserModel.find().sort({ win: -1 }).limit(10);
    return users;
  } catch (error) {
    return new Error("Error: userLeaderboardWin");
  }
};

export function userLeaderBoardWin() {
  try {
    return UserModel.find().sort({ win: -1 }).limit(1);
  } catch (error) {
    console.log(error);
  }
}
export const checkFriend = async (ida: string, idb: string): Promise<boolean> => {
  try {
    const userA :IUser | null  = await UserModel.findOne({ _id: ida });
    const userB :IUser | null = await UserModel.findOne({ _id: idb });
    const friendsA :string[] = userA?.friends as string[];
    const friendsB :string[] = userB?.friends as string[];
    if (friendsA.includes(idb) && friendsB.includes(ida)) {
      return true;
    }else {
      return false;
    }
  } catch (error : any) {
    throw new Error(`Error checking friend: ${error.message}`);
  }
};




