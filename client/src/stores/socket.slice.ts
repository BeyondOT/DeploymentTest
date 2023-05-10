import { IAuthSocket, ICallbackObject, IMessage, IMove } from "@shared/socket";
import { toast } from "react-toastify";
import io, { Socket } from "socket.io-client";
import { StateCreator } from "zustand";

export interface ISocketSlice {
  socket: Socket | null;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
  updateGame: (move: IMove) => void;
  sendAuthInfos: (data: IAuthSocket) => void;
  sendInGameMessage: (data: IMessage) => void;
}
export const createSocketSlice: StateCreator<
  ISocketSlice,
  [["zustand/devtools", never]],
  [],
  ISocketSlice
> = (set, get) => ({
  // Initialize the socket to null
  socket: null,
  error: null,

  connect() {
    // Create a new socket connection
    const socket = io("http://localhost:5000");

    socket.removeAllListeners();

    // Save the socket to the store
    set({ socket }, false, { type: "socket/connect" });

    // Add event listeners for incoming messages
    socket.on("connect", () => {
      console.log("Socket connected to server");
    });
  },
  disconnect() {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null }, false, { type: "socket/disconnect" });
    }
  },
  updateGame(move: IMove) {
    const { socket } = get();
    socket?.emit("playerPlayed", move, (response: ICallbackObject) => {
      if (response.status === "failed") {
        set({ error: response.message });
        setTimeout(() => set({ error: null }), 5000);
      } else if (response.status === "ok") {
        set({ error: null });
      }
    });
  },

  sendAuthInfos(data) {
    const { socket } = get();
    socket?.emit("authSuccess", data, (response: ICallbackObject) => {
      if (response.status === "failed") {
        set({ error: response.message });
        setTimeout(() => set({ error: null }), 5000);
      } else if (response.status === "ok") {
        set({ error: null });
      }
    });
  },
  sendInGameMessage(data) {
    const { socket } = get();
    socket?.emit("sendChatMessage", data, (response: ICallbackObject) => {
      console.log("Je teste");
      if (response.status === "failed") {
        set({ error: response.message });
        setTimeout(() => set({ error: null }), 5000);
      } else if (response.status === "ok") {
        set({ error: null });
      }
    });
  },
});
