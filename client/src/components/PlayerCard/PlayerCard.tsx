import { Tools } from "@shared/socket";
import { FC, useEffect, useState } from "react";
import { IoHandRightOutline } from "react-icons/io5";
import { useBoundStore } from "../../stores/store";
import usePlayCard from "../PlayingCard/usePlayCard";
import SVGKeyboard from "../SvgCards/SVGKeyboard";
import SVGMouse from "../SvgCards/SVGMouse";
import SVGScreen from "../SvgCards/SVGScreen";
import SVGWallet from "../SvgCards/SVGWallet";
import PlayerTool from "./PlayerTool";
import styles from "./playerCard.module.scss";

interface PlayerCardProps {
  userId: number;
  name: string;
  isClient: boolean;
  nbCards: number;
  tools: Tools;
  role?: string;
  job?: string;
}

const PlayerCard: FC<PlayerCardProps> = ({
  userId,
  name,
  isClient,
  nbCards,
  tools,
  role,
  job,
}) => {
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [shouldGlow, setShouldGlow] = useState(false);
  const playerTurn = useBoundStore((state) => state.playerTurn);
  const selectedCard = useBoundStore((state) => state.mainPlayer.selectedCard);
  const mainPlayerJob = useBoundStore((state) => state.mainPlayer.job);
  const { handleClickPlayer } = usePlayCard();

  useEffect(() => {
    if (selectedCard?.isPower && mainPlayerJob === "Admin" && !isClient) {
      setShouldGlow(true);
    } else {
      setShouldGlow(false);
    }
  }, [isClient, mainPlayerJob, selectedCard]);

  useEffect(() => {
    setIsPlayerTurn(false);
    if (playerTurn === userId) {
      setIsPlayerTurn(true);
    }
  }, [playerTurn, userId]);

  const containerClassNames = `${styles.container} ${
    shouldGlow ? styles.glowPlayerCard : ""
  } ${isPlayerTurn ? styles.playerTurn : ""}`;
  return (
    <div className={containerClassNames} onClick={() => handleClickPlayer(userId)}>
      <div className={styles.top}>
        <img src="./images/avatar.png" alt="avatar" className={styles.avatar} />
        <div className={styles.infos}>
          <span>{name}</span>
          {role ? <span className={styles.role}>{role}</span> : null}
          {job ? <span className={styles.role}>{job}</span> : null}
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.handWrapper}>
          <IoHandRightOutline />
          <span>{nbCards}</span>
        </div>
        <PlayerTool
          userId={userId}
          icon={<SVGKeyboard />}
          isBroken={!tools.lantern}
          type={{ lantern: true, cart: false, pickaxe: false }}
        />
        <PlayerTool
          userId={userId}
          icon={<SVGMouse />}
          isBroken={!tools.pickaxe}
          type={{ lantern: false, cart: false, pickaxe: true }}
        />
        <PlayerTool
          userId={userId}
          icon={<SVGScreen />}
          isBroken={!tools.cart}
          type={{ lantern: false, cart: true, pickaxe: false }}
        />
        {isClient ? (
          <>
            <PlayerTool
              userId={userId}
              icon={<SVGWallet />}
              isBroken={false}
              type={{ lantern: false, cart: false, pickaxe: false }}
            />
            <span>5</span>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default PlayerCard;
