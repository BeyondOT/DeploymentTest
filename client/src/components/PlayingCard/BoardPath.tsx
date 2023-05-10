import { Categorie } from "@shared/socket";
import { motion as m } from "framer-motion";
import { FC } from "react";
import { useDrop } from "react-dnd";
import SvgCard, { TCardType } from "../SvgCards/SvgCard";
import styles from "./PlayingCard.module.scss";
import usePlayCard from "./usePlayCard";

interface BoardPathProps {
  type: string;
  id: number;
  coordX: number;
  coordY: number;
  categorie: Categorie;
  isFlipped: boolean;
  isReachable?: boolean;
  isRevealed?: boolean;
}

const BoardPath: FC<BoardPathProps> = ({
  type,
  id,
  coordX,
  coordY,
  categorie,
  isFlipped,
  isReachable,
  isRevealed,
}) => {
  const { handleClickBoardCell } = usePlayCard();
  const isRotated = isFlipped; // TODO: Rajouter rotated à CardType interface
  const typeTest: TCardType = type as TCardType;
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ["Collapse"],
    drop: () => handleClickBoardCell(coordX!, coordY!),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const containerClassNames = `${styles.card} ${styles[type]} ${styles.container} ${
    isOver ? styles.isOverBoardCell : ""
  }`;
  const wrapperClassNames = `${styles.svgWrapper} ${isRotated ? styles.isRotated : ""} ${
    canDrop ? styles.canDropBoardCell : ""
  }`;
  return (
    <div ref={drop}>
      <m.div
        className={containerClassNames}
        onClick={() => handleClickBoardCell(coordX, coordY)}
        initial={{ x: "-200px" }}
        animate={{ x: "0" }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={wrapperClassNames}>
          <SvgCard type={typeTest} shouldAnimate={true} />
        </div>
      </m.div>
    </div>
  );
};

export default BoardPath;
