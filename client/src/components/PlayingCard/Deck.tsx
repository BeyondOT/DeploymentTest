import { FC } from "react";
import styles from "./PlayingCard.module.scss";

interface IDeckProps {
  deckSize: number;
}

const Deck: FC<IDeckProps> = ({ deckSize }) => {
  const containerClassNames = `${styles.container} ${styles.deck}`;

  return (
    <div className={containerClassNames} style={{ color: "white" }}>
      <span>{deckSize}</span>
    </div>
  );
};
export default Deck;
