import { Tools } from "@shared/socket";
import { FC, ReactElement, useEffect, useState } from "react";
import { useBoundStore } from "../../stores/store";
import usePlayCard from "../PlayingCard/usePlayCard";
import styles from "./playerCard.module.scss";

interface PlayerToolProps {
  userId: number;
  type: Tools;
  isBroken: boolean;
  icon: ReactElement;
}

const PlayerTool: FC<PlayerToolProps> = ({ userId, icon, isBroken, type }) => {
  const [shouldGlowBonus, setShouldGlowBonus] = useState(false);
  const [shouldGlowMalus, setShouldGlowMalus] = useState(false);
  const selectedCard = useBoundStore((state) => state.mainPlayer.selectedCard);
  const mainPlayerId = useBoundStore((state) => state.mainPlayer.userId);
  const powerLeft = useBoundStore((state) => state.mainPlayer.powerLeft);
  const { handleClickTool } = usePlayCard();

  const toolContainerClassNames = `${styles.toolContainer} ${
    isBroken ? styles.broken : ""
  } ${shouldGlowBonus ? styles.glowBonus : ""} ${
    shouldGlowMalus ? styles.glowMalus : ""
  }`;

  const checkType = () => {
    if (type.cart && selectedCard!.targetTools?.cart) {
      return true;
    }
    if (type.lantern && selectedCard!.targetTools?.lantern) {
      return true;
    }
    if (type.pickaxe && selectedCard!.targetTools?.pickaxe) {
      return true;
    }
  };

  const handleGlow = () => {
    setShouldGlowBonus(false);
    setShouldGlowMalus(false);

    if (!selectedCard) {
      return;
    }
    if (selectedCard.isPower && powerLeft === 0) {
      return;
    }

    if (selectedCard.categorie === "Bonus") {
      if (!isBroken) {
        setShouldGlowBonus(false);
        return;
      }
      if (checkType()) {
        setShouldGlowBonus(true);
        return;
      }
    }
    if (selectedCard.categorie === "Malus") {
      if (isBroken) {
        setShouldGlowMalus(false);
        return;
      }
      if (userId === mainPlayerId) {
        setShouldGlowMalus(false);
        return;
      }
      if (checkType()) {
        setShouldGlowMalus(true);
        return;
      }
    }
    return;
  };
  useEffect(() => {
    handleGlow();
  }, [selectedCard]);

  return (
    <div
      className={toolContainerClassNames}
      onClick={() => handleClickTool(userId, type)}
    >
      {icon}
    </div>
  );
};
export default PlayerTool;
