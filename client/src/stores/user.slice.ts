import { StateCreator } from "zustand";

import produce from "immer";

import { IUser } from "@shared/api";
import * as userAPI from "../api/user.api";

export const getUser = async () => {
  const res = await userAPI.getUser(); // The value we return becomes the `fulfilled` action payload
  return res.data;
};

export const getAllUsers = async () => {
  const res = await userAPI.getAllUsers(); // The value we return becomes the `fulfilled` action payload
  return res.data;
};

export const AddFriends = async (friend: IUser, user: IUser) => {
  const res = await userAPI.AddFriends(friend, user); // The value we return becomes the `fulfilled` action payload
  return res.data;
};

export const getFriends = async () => {
  const res = await userAPI.getFriends(); // The value we return becomes the `fulfilled` action payload
  return res.data;
};

export interface IUserSlice {
  userData: IUser | null;
  usersData: IUser[];
  friends: IUser[] | null;
  loading: boolean;
  error: string | null;
  getUser: () => Promise<1 | null>;
  getFriends: () => Promise<1 | null>;
  getAllUsers: () => Promise<1 | null>;
}
export const createUserSlice: StateCreator<
  IUserSlice,
  [["zustand/devtools", never]],
  [],
  IUserSlice
> = (set, get) => ({
  userData: null,
  friends: null,
  usersData: [] as IUser[],
  loading: false,
  error: null,

  async getUser() {
    try {
      let user = await getUser();
      set(
        produce((state: IUserSlice) => {
          state.userData = user;
        }),
        false,
        { type: "user/getUser", user }
      );
      return 1;
    } catch (error) {
      return null;
    }
  },
  async getFriends() {
    try {
      let friends = await getFriends();
      set(
        produce((state: IUserSlice) => {
          state.friends = friends.body;
        }),
        false,
        { type: "user/getFriends", friends }
      );
      return 1;
    } catch (error) {
      return null;
    }
  },
  async getAllUsers() {
    try {
      let users = await getAllUsers();
      set(
        produce((state: IUserSlice) => {
          state.usersData = users;
        }),
        false,
        { type: "user/userGetAll", users }
      );
      return 1;
    } catch (error) {
      return null;
    }
  },
});
