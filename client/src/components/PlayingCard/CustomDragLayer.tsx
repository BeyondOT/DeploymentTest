import type { CSSProperties, FC } from "react";
import type { XYCoord } from "react-dnd";
import { useDragLayer } from "react-dnd";
import BoardCell from "./BoardCell";

const layerStyles: CSSProperties = {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 100,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
};

function getItemStyles(initialOffset: XYCoord | null, currentOffset: XYCoord | null) {
  if (!initialOffset || !currentOffset) {
    return {};
  }

  let { x, y } = currentOffset;

  const transform = `translate(${x}px, ${y}px)`;
  return {
    opacity: 0.9,
    width: 100,
    transform,
    WebkitTransform: transform,
  };
}

interface CustomDragLayerProps {
  width: number;
}
export const CustomDragLayer: FC<CustomDragLayerProps> = ({ width }) => {
  const { itemType, isDragging, item, initialOffset, currentOffset } = useDragLayer(
    (monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    })
  );

  if (!isDragging) {
    return null;
  }
  return (
    <div style={{ ...layerStyles, width }}>
      <div style={getItemStyles(initialOffset, currentOffset)}>
        <BoardCell
          id={item.id}
          categorie={"Path"}
          type={item.type}
          coordX={-10}
          coordY={-10}
          isFlipped={item.isFlipped}
        />{" "}
      </div>
      <h1>I am {item?.toString()}</h1>
    </div>
  );
};
