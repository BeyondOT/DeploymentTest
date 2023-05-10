import { Categorie } from "@shared/socket";
import { FC } from "react";
import Blank from "./Blank";
import BoardPath from "./BoardPath";
import EmptyCell from "./EmptyCell";
import Finish from "./Finish";
import Start from "./Start";

interface BoardCellProps {
  type: string;
  id: number;
  coordX: number;
  coordY: number;
  categorie: Categorie;
  isFlipped: boolean;
  isReachable?: boolean;
  isRevealed?: boolean;
}

const BoardCell: FC<BoardCellProps> = ({
  type,
  id,
  coordX,
  coordY,
  categorie,
  isFlipped,
  isReachable,
  isRevealed,
}) => {
  if (id === 0 && isReachable) {
    return <EmptyCell coordX={coordX} coordY={coordY} isReachable={isReachable} />;
  }
  if (id === 0 && !isReachable) {
    return <Blank />;
  }

  if (categorie === "Start") {
    return (
      <Start id={id} categorie={categorie} type={type} coordX={coordX} coordY={coordY} />
    );
  }

  if (categorie === "Finish") {
    return (
      <Finish
        id={id}
        categorie={categorie}
        type={type}
        coordX={coordX}
        coordY={coordY}
        isRevealed={isRevealed!}
      />
    );
  }

  return (
    <BoardPath
      id={id}
      categorie={categorie}
      type={type}
      coordX={coordX}
      coordY={coordY}
      isRevealed={isRevealed!}
      isFlipped={isFlipped}
    />
  );
};
export default BoardCell;
