import { Categorie } from "@shared/socket";
import { FC } from "react";
import { useDrop } from "react-dnd";
import SvgCard, { TCardType } from "../SvgCards/SvgCard";
import styles from "./PlayingCard.module.scss";
import usePlayCard from "./usePlayCard";

interface IFinishProps {
  type: string;
  id: number;
  coordX: number;
  coordY: number;
  categorie: Categorie;
  isRevealed: boolean;
}

const Finish: FC<IFinishProps> = ({
  type,
  id,
  coordX,
  coordY,
  categorie,
  isRevealed,
}) => {
  const { handleClickFinish } = usePlayCard();

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ["Reveal"],
    drop: () => handleClickFinish(coordX!, coordY!),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  const containerClassNames = `${styles.card} ${styles[type]} ${styles.container} ${
    styles.finishContainer
  } ${isOver && !isRevealed ? styles.isOverBoardCell : ""} ${
    isRevealed ? styles.finishContainerRevealed : ""
  }`;
  const imageClassNamesFront = `${styles.svgWrapper} ${styles.cardImage} ${
    styles.finishImageFront
  } ${canDrop && !isRevealed ? styles.canDropBoardCell : ""}`;

  const imageClassNamesBack = `${styles.svgWrapper} ${styles.cardImage} ${
    styles.finishImageBack
  } ${canDrop && !isRevealed ? styles.canDropBoardCell : ""}`;

  const typeSvg: TCardType = type as TCardType;
  return (
    <div className={styles.finishWrapper}>
      <div
        className={containerClassNames}
        onClick={() => handleClickFinish(coordX, coordY)}
        ref={drop}
      >
        <div className={imageClassNamesFront}>
          <SvgCard type="999" shouldAnimate={false} />
        </div>
        <div className={imageClassNamesBack}>
          <SvgCard type={typeSvg} shouldAnimate={false} />
        </div>
      </div>
    </div>
  );
};

export default Finish;
