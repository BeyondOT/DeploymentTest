import { IInitialSend, ILobbyInfos } from "@shared/socket";
import { motion } from "framer-motion";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { useNavigate } from "react-router";
import { useBoundStore } from "../../stores/store";
import styles from "./Lobby.module.scss";

interface ILobbyProps {
  toggleOpen?: Dispatch<SetStateAction<boolean>>;
}

const Lobby: FC<ILobbyProps> = ({ toggleOpen }) => {
  const playerState = useBoundStore((state) => state.playerState);
  const socket = useBoundStore((state) => state.socket);
  const setPlayerState = useBoundStore((state) => state.setPlayerState);
  const [lobbyData, setLobbyData] = useState<ILobbyInfos | null>(null);
  const setMainPlayer = useBoundStore((state) => state.setMainPlayer);
  const setGameState = useBoundStore((state) => state.setGameState);
  const navigate = useNavigate();

  useEffect(() => {
    if (socket) {
      socket.on("lobbyInfos", (data: ILobbyInfos) => {
        setPlayerState("inQueue");
        setLobbyData(data);
        if (toggleOpen) toggleOpen(false);
      });
      socket.on("gameBegins", (data: IInitialSend) => {
        setPlayerState("inGame");
        setMainPlayer(data.mainPlayer);
        setGameState(data.gameState);
        if (toggleOpen) toggleOpen(false);
        setTimeout(() => navigate("/game"), 2500);
      });
    }
    return () => {
      socket?.off("lobbyInfos");
      socket?.off("gameBegins");
    };
  }, [navigate, setGameState, setMainPlayer, setPlayerState, socket]);

  if (playerState === "inQueue" || playerState === "inGame") {
    const roomSizeCircles = [];
    for (let i = 1; i <= lobbyData!.roomMaxSize; i++) {
      roomSizeCircles.push(
        <div
          key={i}
          className={`${styles.circle} ${
            i <= lobbyData!.roomCurrentSize ? styles.lit : styles.unlit
          }`}
        ></div>
      );
    }
    return (
      <div className={styles.container}>
        <motion.div
          className={styles.box}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {playerState === "inQueue" ? (
            <span>Waiting for other players to join...</span>
          ) : (
            <span>Joining the game...</span>
          )}

          <ImSpinner2 className={styles.spinner} />
          <span>
            <div className={styles.circlesContainer}>{roomSizeCircles}</div>
          </span>
        </motion.div>
      </div>
    );
  }

  return null;
};

export default Lobby;
