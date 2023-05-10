import { motion as m } from "framer-motion";
import { FC } from "react";
import { useDrop } from "react-dnd";
import styles from "./PlayingCard.module.scss";
import usePlayCard from "./usePlayCard";

interface EmptyCellProps {
  coordX?: number;
  coordY?: number;
  isReachable?: boolean;
}

const EmptyCell: FC<EmptyCellProps> = ({ coordX, coordY, isReachable }) => {
  const { handleClickEmptyCell } = usePlayCard();

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ["Path"],
    drop: () => handleClickEmptyCell(coordX!, coordY!),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const containerClassNames = `${styles.container} ${
    isOver && canDrop && isReachable
      ? styles.isPlayable
      : canDrop && isReachable
      ? styles.canDropBoardCell
      : ""
  } ${isReachable ? styles.isReachable : ""}`;

  return (
    <div ref={drop}>
      <m.div
        className={containerClassNames}
        onClick={() => handleClickEmptyCell(coordX!, coordY!)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
      ></m.div>
    </div>
  );
};
export default EmptyCell;
