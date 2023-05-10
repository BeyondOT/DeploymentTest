import { Categorie } from "@shared/socket";
import { FC } from "react";
import { useDrag } from "react-dnd";
import SvgCard, { TCardType } from "../SvgCards/SvgCard";
import styles from "./PlayingCard.module.scss";
import useSelectCard from "./useSelectCard";

interface CollapseProps {
  type: string;
  id: number;
  categorie: Categorie;
}

const Collapse: FC<CollapseProps> = ({ id, type, categorie }) => {
  const { isSelected, handleSelectCard } = useSelectCard(id, type, categorie);

  const [{ opacity, height, isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: categorie!,
      item: {
        id,
        type,
      },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 1 : 1,
        height: monitor.isDragging() ? "" : "",
        isDragging: monitor.isDragging(),
      }),
    }),
    [categorie]
  );

  const containerClassNames = `${styles.card} ${styles.container} ${styles[type]} ${
    styles.hand
  } ${isSelected ? `${styles.selectedCard}` : ""}`;
  const imageClassNames = `${styles.cardImage}`;
  const wrapperClassNames = `${styles.svgWrapper}`;
  const typeSvg: TCardType = type as TCardType;

  return (
    <div
      className={containerClassNames}
      id={id.toString()}
      ref={drag}
      style={{ opacity, height }}
      draggable
      onDragStart={() => {
        if (!isSelected) {
          handleSelectCard();
        }
      }}
    >
      <div className={wrapperClassNames} onClick={() => handleSelectCard()}>
        <SvgCard type={typeSvg} shouldAnimate={false} />
      </div>
    </div>
  );
};
export default Collapse;
