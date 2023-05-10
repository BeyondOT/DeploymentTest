import { Categorie, Tools } from "@shared/socket";
import { FC } from "react";
import Bonus from "./Bonus";
import Collapse from "./Collapse";
import Path from "./Path";
import styles from "./PlayingCard.module.scss";

interface PlayingCardProps {
  type: string;
  id: number;
  categorie: Categorie;
  targetTools?: Tools;
  isFlipped?: boolean;
}

//TODO: Rendre les cartes de la main et celle du board indépendantes

const PlayingCard: FC<PlayingCardProps> = ({
  id,
  type,
  categorie,

  targetTools,
  isFlipped,
}) => {
  const renderCard = () => {
    if (categorie === "Bonus" || categorie === "Malus") {
      return (
        <Bonus id={id} categorie={categorie} type={type} targetTools={targetTools!} />
      );
    }
    if (categorie === "Path") {
      return <Path id={id} categorie={categorie} type={type} isFlipped={isFlipped!} />;
    }

    if (categorie === "Collapse") {
      return <Collapse id={id} categorie={categorie} type={type} />;
    }

    if (categorie === "Reveal") {
      return <Collapse id={id} categorie={categorie} type={type} />;
    }
    return null;
  };

  return <>{renderCard()}</>;
};
export default PlayingCard;
