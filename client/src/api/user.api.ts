import { IUser, ResponseGetFriends } from "@shared/api";
import axios from "axios";

export const UserAPI = axios.create({
  baseURL: `http://localhost:5000/api`,
  withCredentials: true,
});

export const getAllUsers = async () => await UserAPI.get<IUser[]>(`/users/getAllUsers`);

export const getUser = async () => await UserAPI.get<IUser>(`/users/getUser`);

export const AddFriends = async (friend: IUser, user: IUser) =>
  await UserAPI.patch<IUser[]>(`/users/addFriend`, {
    id_friend: friend._id,
    id_user: user._id,
  });

export const getFriends = async () =>
  await UserAPI.get<ResponseGetFriends>(`/users/getFriends`);
