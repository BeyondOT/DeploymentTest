import PlayerCard from "../../components/PlayerCard/PlayerCard";
import { useBoundStore } from "../../stores/store";
import styles from "./GameInterface.module.scss";

const OtherPlayersCards = () => {
  const otherPlayers = useBoundStore((state) => state.otherPlayers);
  const mainPlayerId = useBoundStore((state) => state.mainPlayer.userId);
  const playersRevealed = useBoundStore((state) => state.mainPlayer.playersRevealed);

  if (!otherPlayers) {
    return <div>No otherPlayers</div>;
  }
  return (
    <div className={`${styles.playerCardContainer} unselectable`}>
      {otherPlayers.map((otherPlayer, index) => {
        if (otherPlayer.userId !== mainPlayerId) {
          let theRevealedPlayer = playersRevealed.find(
            (player) => player.playerdId === otherPlayer.userId
          );
          if (theRevealedPlayer) {
            return (
              <PlayerCard
                userId={otherPlayer.userId}
                name={otherPlayer.username}
                isClient={false}
                nbCards={otherPlayer.nbCards}
                tools={otherPlayer.tools}
                key={index}
                role={theRevealedPlayer.saboteur ? "Saboteur" : "Miner"}
                job={theRevealedPlayer.role}
              />
            );
          }
          return (
            <PlayerCard
              userId={otherPlayer.userId}
              name={otherPlayer.username}
              isClient={false}
              nbCards={otherPlayer.nbCards}
              tools={otherPlayer.tools}
              key={index}
            />
          );
        }
        return null;
      })}
    </div>
  );
};

export default OtherPlayersCards;
