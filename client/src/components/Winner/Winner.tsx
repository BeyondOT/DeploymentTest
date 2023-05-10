import { IEnd } from "@shared/socket";
import { Dispatch, FC } from "react";
import { useNavigate } from "react-router-dom";
import { useBoundStore } from "../../stores/store";
import styles from "./Winner.module.scss";

interface IWinnerProps {
  setEndRound: Dispatch<React.SetStateAction<boolean>>;
  data: IEnd | null;
}

const Winner: FC<IWinnerProps> = ({ setEndRound, data }) => {
  const navigate = useNavigate();
  const playerState = useBoundStore((state) => state.playerState);
  const setPlayerState = useBoundStore((state) => state.setPlayerState);

  const roundWinnerClassNames = `${styles.roundWinner} ${
    data?.round_winner_team === 2 ? styles.saboteur : styles.miner
  }`;
  const renderButton = () => {
    if (data?.game_over) {
      return (
        <button
          onClick={() => {
            setPlayerState("idle");
            navigate("/");
          }}
        >
          Main menu
        </button>
      );
    } else {
      return <button onClick={() => setEndRound(false)}>Next Round</button>;
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <span>
          The{" "}
          <span className={roundWinnerClassNames}>
            {data?.round_winner_team === 2 ? "Saboteurs" : "Miners"}
          </span>{" "}
          won round{" "}
          <span className={styles.roundNumber}>
            {" "}
            {data?.next_round ? data.next_round - 1 : 2}
          </span>
          .
        </span>
        {renderButton()}
      </div>
    </div>
  );
};
export default Winner;
