import { useDrop } from "react-dnd";
import { BsTrash } from "react-icons/bs";
import styles from "./PlayingCard.module.scss";
import usePlayCard from "./usePlayCard";

const Discard = () => {
  const { handleClickDiscard } = usePlayCard();

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ["Path", "Bonus", "Collapse", "Reveal", "Malus"],
    drop: handleClickDiscard,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const containerClassNames = `${styles.container} ${styles.discard} ${
    isOver ? styles.isOver : ""
  }`;

  const iconClassNames = `${isOver ? styles.trashOver : ""}`;

  return (
    <div className={containerClassNames} onClick={handleClickDiscard} ref={drop}>
      <BsTrash className={iconClassNames} />
    </div>
  );
};
export default Discard;
