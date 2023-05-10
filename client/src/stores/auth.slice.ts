import { StateCreator } from "zustand";

import { AxiosError } from "axios";
import produce from "immer";

import {
  IUserLoginResponse,
  IUserRegisterResponse,
  UserLogin,
  UserRegister,
} from "../features/authentication/auth.types";

import * as authAPI from "../api/auth.api";

export const getToken = async () => {
  const res = await authAPI.fetchToken(); // The value we return becomes the `fulfilled` action payload
  return res.data;
};

export const logout = async () => {
  const res = await authAPI.logout(); // The value we return becomes the `fulfilled` action payload
  return res.data;
};

export const register = async (data: UserRegister) => {
  let errData: IUserRegisterResponse = {} as IUserRegisterResponse;
  try {
    await authAPI.register(data);
    return errData;
  } catch (error) {
    if (error instanceof AxiosError) {
      errData = error.response?.data;
      errData.error = true;
    } else {
      errData.message = "An unexpected error happened.";
      errData.error = true;
    }
    return errData;
  }
};

export const signIn = async (data: UserLogin) => {
  let errData: IUserLoginResponse = {} as IUserLoginResponse;
  errData.error = false;
  try {
    const response = await authAPI.login(data);
    errData.token = response.data;
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      errData = error.response?.data;
      errData.error = true;
    } else {
      errData.message = "An Unexcpected error happened.";
      errData.error = true;
    }
    throw errData;
  }
};

export interface IAuthSlice {
  token: string | null;
  loading: boolean;
  error: string | null;
  signIn: (data: UserLogin) => Promise<IUserLoginResponse | string>;
  register: (data: UserRegister) => Promise<IUserRegisterResponse>;
  logout: () => void;
  getToken: () => Promise<string | void>;
  setToken: (token: string) => void;
}
export const createAuthSlice: StateCreator<
  IAuthSlice,
  [["zustand/devtools", never]],
  [],
  IAuthSlice
> = (set, get) => ({
  token: null,
  loading: false,
  error: null,

  async signIn(data) {
    try {
      const token = await signIn(data);
      set({ token: token });
      return token;
    } catch (error) {
      throw error;
    }
  },
  async register(data) {
    return await register(data);
  },
  async logout() {
    return await logout();
  },
  setToken(token: string) {
    set({ token });
  },
  async getToken() {
    try {
      let tk = await getToken();
      set(
        produce((state: IAuthSlice) => {
          state.token = tk;
          state.loading = false;
        }),
        false,
        { type: "auth/getToken", tk }
      );
      return tk;
    } catch (error) {
      return console.log("error");
    }
  },
});
