import PlayerCard from "../../components/PlayerCard/PlayerCard";
import { useBoundStore } from "../../stores/store";
import styles from "./GameInterface.module.scss"

const MainPlayerCard = () => {

  const mainPlayer = useBoundStore((state) => state.mainPlayer);
  if (!mainPlayer.cardsHeld) {
    return <div>Main Player undefined</div>;
  }

  return (
    <div className={styles.currentUserContainer}>
      <PlayerCard
        userId={mainPlayer.userId}
        name={mainPlayer.username}
        isClient={true}
        nbCards={mainPlayer.cardsHeld?.length}
        tools={mainPlayer.tools}
        role={mainPlayer.role}
        job={mainPlayer.job}
      />
    </div>
  );
};

export default MainPlayerCard;
