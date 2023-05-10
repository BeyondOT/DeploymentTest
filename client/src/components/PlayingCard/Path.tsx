import { Categorie } from "@shared/socket";
import { FC, useState } from "react";
import { useDrag } from "react-dnd";
import { FiRotateCw } from "react-icons/fi";
import SvgCard, { TCardType } from "../SvgCards/SvgCard";
import styles from "./PlayingCard.module.scss";
import useSelectCard from "./useSelectCard";

interface PathProps {
  type: string;
  id: number;
  categorie: Categorie;
  isFlipped: boolean;
}

const Path: FC<PathProps> = ({ id, type, categorie, isFlipped }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isSelected, handleSelectCard, handleRotate, isRotated } = useSelectCard(
    id,
    type,
    categorie,
    isFlipped
  );
  // useEffect(() => {
  //   dragPreview(getEmptyImage(), { captureDraggingState: true });
  // }, []);

  const [{ opacity, height, isDragging }, drag] = useDrag(
    () => ({
      type: categorie!,
      item: {
        id,
        type,
        isFlipped,
      },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 1 : 1,
        height: monitor.isDragging() ? "" : "",
        isDragging: monitor.isDragging(),
      }),
    }),
    [categorie]
  );

  const containerClassNames = `${styles.card} ${styles[type]} ${styles.container} ${
    styles.hand
  } ${styles[categorie!]} ${isSelected ? `${styles.selectedCard}` : ""} ${
    isDragging ? styles.isDragged : ""
  }`;
  const imageClassNames = `${styles.cardImage} ${isRotated ? `${styles.isRotated}` : ""}`;
  const iconContainerClassNames = `${styles.iconContainer} ${
    isHovered ? styles.isHovered : ""
  }`;
  const wrapperClassNames = `${styles.svgWrapper} ${isRotated ? styles.isRotated : ""}`;
  const typeSvg: TCardType = type as TCardType;

  return (
    <div
      className={containerClassNames}
      id={id.toString()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={drag}
      draggable
      style={{ opacity, height }}
      onDragStart={() => {
        setIsHovered(false);
        if (!isSelected) {
          handleSelectCard();
        }
      }}
    >
      <div className={wrapperClassNames} onClick={() => handleSelectCard()}>
        <SvgCard type={typeSvg} shouldAnimate={false} />
      </div>
      {isHovered ? (
        <div
          className={iconContainerClassNames}
          onClick={() => {
            handleRotate();
          }}
        >
          <FiRotateCw />
        </div>
      ) : null}
    </div>
  );
};
export default Path;
