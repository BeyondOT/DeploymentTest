import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { IAuthSlice, createAuthSlice } from "./auth.slice";
import { GameStateClient, createGameSlice } from "./game.slice";
import { ISocketSlice, createSocketSlice } from "./socket.slice";
import { IUserSlice, createUserSlice } from "./user.slice";

export const useBoundStore = create<
  GameStateClient & ISocketSlice & IAuthSlice & IUserSlice
>()(
  devtools((...a) => ({
    ...createGameSlice(...a),
    ...createSocketSlice(...a),
    ...createAuthSlice(...a),
    ...createUserSlice(...a),
  }))
);
