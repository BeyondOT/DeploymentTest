import { ResponseGetFriends, ResponseLayout } from "@shared/api";
import { Request, Response } from "express";
import {
  userAddFriend,
  userGetAll,
  userGetFriends,
  userRemoveFriend,
  checkFriend
} from "../database/user.database";
import { IGetUserAuthInfoRequest } from "../middlewares/user.middlewares";
import UserModel from "../models/user.model";
import { addFriendErrors, getFriendsErrors, removeFriendErrors } from "../utils/erros";

export const getFriends = async (req: IGetUserAuthInfoRequest, res: Response) => {
  if (!req.user) {
    return res.status(400).json({ message: "You are not supposed to be here." });
  }
  try {
    const userId = req.user.id;
    let friends: any = await userGetFriends(userId);

    let rep: ResponseGetFriends = {
      message: "getFriends success",
      body: friends,
    };

    return res.status(200).json(rep);
  } catch (error: any) {
    const err = getFriendsErrors(error);
    return res.status(400).json(err);
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    let users: any = await userGetAll();
    return res.status(200).json(users);
  } catch (error: any) {
    const err = getFriendsErrors(error);
    return res.status(400).json(err);
  }
};

export const addFriend = async (req: Request, res: Response) => {
  try {
    let user_id: string = req.body.id_user;
    let friend_id: string = req.body.id_friend;
    //todo check if friend_id exist
    //todo check if friend_id is not already in friends
    if(await checkFriend(user_id, friend_id)){
      throw new Error("already friend");
    }
    await userAddFriend(user_id, friend_id);
    let rep: ResponseLayout = { message: "addFriend success" };
    return res.status(200).json(rep);
  } catch (error: any) {
    const err = addFriendErrors(error);
    return res.status(400).json(err);
  }
};

export const removeFriend = async (req: Request, res: Response) => {
  try {
    let user_id: string = req.body.id_user;
    let friend_id: string = req.body.id_friend;
    await userRemoveFriend(user_id, friend_id);
    let rep: ResponseLayout = { message: "addFriend success" };
    return res.status(200).json(rep);
  } catch (error: any) {
    const err = removeFriendErrors(error);
    return res.status(400).json(err);
  }
};

// Get user.
export const getUser = async (req: IGetUserAuthInfoRequest, res: Response) => {
  if (!req.user) {
    return res.status(400).json({ message: "You are not supposed to be here." });
  }
  try {
    const user = await UserModel.findById(req.user.id).select("-password");
    // console.log(req.user!.id);
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};
