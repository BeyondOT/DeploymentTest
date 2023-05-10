import { Categorie, GameState, IEnd, MainPlayer, Tools } from "@shared/socket";
import { AnimatePresence, m } from "framer-motion";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ToastContainer, toast } from "react-toastify";
import { Board } from "../../components/Board/Board";
import InGameChat from "../../components/InGameChat/InGameChat";
import InGameMenu from "../../components/InGameMenu/InGameMenu";
import Deck from "../../components/PlayingCard/Deck";
import Discard from "../../components/PlayingCard/Discard";
import Power from "../../components/PlayingCard/Power";
import Winner from "../../components/Winner/Winner";
import { useBoundStore } from "../../stores/store";
import styles from "./GameInterface.module.scss";
import MainPlayerCard from "./MainPlayerCard";
import OtherPlayersCards from "./OtherPlayersCards";
import PlayerHand from "./PlayerHand";

const GameInterface = () => {
  const socket = useBoundStore((state) => state.socket);
  const error = useBoundStore((state) => state.error);
  const deckSize = useBoundStore((state) => state.deckSize);
  const winner = useBoundStore((state) => state.winner);
  const setMainPlayer = useBoundStore((state) => state.setMainPlayer);
  const setGameState = useBoundStore((state) => state.setGameState);
  const job = useBoundStore((state) => state.mainPlayer.job);
  const powerTarget = useBoundStore((state) => state.mainPlayer.powerTarget);
  const [endRound, setEndRound] = useState(false);
  const [endRoundData, setEndRoundData] = useState<IEnd | null>(null);

  let categorie: Categorie = "Finish";
  const targetTools: Tools = {
    cart: true,
    lantern: true,
    pickaxe: true,
  };
  if (powerTarget === "Tools" && job === "Briseur") {
    categorie = "Malus";
  }
  if (powerTarget === "Player" && job === "Admin") {
    categorie = "PlayerReveal";
  }

  if (powerTarget === "Tools" && job === "Fixeur") {
    categorie = "Bonus";
  }

  useEffect(() => {
    if (socket) {
      socket.on("updatePlayerState", (data: MainPlayer) => {
        setMainPlayer(data);
      });
      socket.on("updateGameState", (data: GameState) => {
        setGameState(data);
      });
      socket.on("error", (error) => {
        console.log(error);
      });
      socket.on("endOfRound", (data: IEnd) => {
        console.log("this is end of round");
        setEndRound(true);
        setEndRoundData(data);
      });
    }
    return () => {
      socket?.off("updatePlayerState");
      socket?.off("updateGameState");
      socket?.off("error");
    };
  }, [setGameState, setMainPlayer, socket]);

  useEffect(() => {
    if (error) {
      toast(error);
    }
  }, [error]);

  const renderWinner = () => {
    if (endRound) {
      return <Winner setEndRound={setEndRound} data={endRoundData} />;
    }
  };
  // const container = {
  //   hidden: { opacity: 1, scale: 0 },
  //   visible: {
  //     opacity: 1,
  //     scale: 1,
  //     transition: {
  //       delayChildren: 0.3,
  //       staggerChildren: 0.2,
  //     },
  //   },
  // };

  return (
    <DndProvider backend={HTML5Backend}>
      {/* <CustomDragLayer width={100} /> */}
      <m.div className={styles.container}>
        {renderWinner()}
        <ToastContainer />
        <div className={styles.gameContainer}>
          <div className={styles.menuContainer}>
            <InGameMenu />
          </div>
          <div className={styles.chatContainer}>
            <InGameChat />
          </div>
          <OtherPlayersCards />
          <AnimatePresence>
            <Board />
          </AnimatePresence>
          <div className={`${styles.bottom} unselectable`}>
            <MainPlayerCard />
            <PlayerHand />
            <div className={styles.deckAndDiscard}>
              <Power targetTools={targetTools} categorie={categorie} />
              <Deck deckSize={deckSize} />
              <Discard />
            </div>
          </div>
        </div>
      </m.div>
    </DndProvider>
  );
};

export default GameInterface;
