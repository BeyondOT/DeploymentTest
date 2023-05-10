import { IMove, Tools } from "@shared/socket";
import { toast } from "react-toastify";
import { useBoundStore } from "../../stores/store";

const usePlayCard = () => {
  const selectedCard = useBoundStore((state) => state.mainPlayer.selectedCard);
  const mainPlayerId = useBoundStore((state) => state.mainPlayer.userId);
  const updateGame = useBoundStore((state) => state.updateGame);
  const selectCard = useBoundStore((state) => state.selectCard);

  const handleClickPlayer = (userId: number) => {
    toast.dismiss();
    if (!selectedCard) {
      return console.log("No selected Card.");
    }
    if (selectedCard.isPower) {
      //updateBoardCell(coordX, coordY, selectedCard);
      const move: IMove = {
        cardId: selectedCard.cardId,
        playerId: mainPlayerId,
        target: "Power",
        targetPlayerId: userId,
      };
      updateGame(move);
      selectCard(null);
      return;
    }
    return;
  };
  const handleClickTool = (userId: number, targetTool?: Tools) => {
    toast.dismiss();
    if (!selectedCard) {
      return console.log("No selected Card.");
    }
    if (selectedCard.categorie === "Bonus" || selectedCard.categorie === "Malus") {
      //updateBoardCell(coordX, coordY, selectedCard);
      const move: IMove = {
        cardId: selectedCard.cardId,
        playerId: mainPlayerId,
        target: selectedCard.isPower ? "Power" : "Player",
        targetPlayerId: userId,
        targetTool: targetTool,
      };
      updateGame(move);
      selectCard(null);
      return;
    }
    return;
  };

  const handleClickFinish = (coordX: number, coordY: number) => {
    toast.dismiss();
    if (!selectedCard) {
      return console.log("No selected Card.");
    }
    if (selectedCard.categorie === "Collapse" || selectedCard.categorie === "Reveal") {
      const move: IMove = {
        cardId: selectedCard.cardId,
        playerId: mainPlayerId,
        target: "Board",
        coordX: coordX,
        coordY: coordY,
      };
      updateGame(move);
      selectCard(null);
      return;
    }

    return;
  };

  const handleClickBoardCell = (coordX: number, coordY: number) => {
    toast.dismiss();
    if (!selectedCard) {
      return console.log("No selected Card.");
    }
    if (selectedCard.categorie === "Collapse" || selectedCard.categorie === "Reveal") {
      const move: IMove = {
        cardId: selectedCard.cardId,
        playerId: mainPlayerId,
        target: "Board",
        coordX: coordX,
        coordY: coordY,
      };
      updateGame(move);
      selectCard(null);
      return;
    }

    return;
  };

  const handleClickEmptyCell = (coordX: number, coordY: number) => {
    toast.dismiss();
    if (!selectedCard) {
      return console.log("No selected Card.");
    }
    if (selectedCard.categorie !== "Path") {
      console.log("The selected card is not a path card.");
      console.log(selectedCard);
      return;
    }
    if (coordX === undefined) {
      return console.log("The clicked cell has no coord X.");
    }
    if (coordY === undefined) {
      return console.log("The clicked cell has no coord Y.");
    }

    //updateBoardCell(coordX, coordY, selectedCard);
    const move: IMove = {
      cardId: selectedCard.cardId,
      playerId: mainPlayerId,
      target: "Board",
      coordX: coordX,
      coordY: coordY,
      flip: selectedCard.isFlipped!, // A revoir
    };
    updateGame(move);
    selectCard(null);
  };

  const handleClickDiscard = () => {
    toast.dismiss();
    if (!selectedCard) {
      return console.log("No selected Card.");
    }
    const move: IMove = {
      cardId: selectedCard.cardId,
      playerId: mainPlayerId,
      target: "Discard",
    };

    updateGame(move);
    selectCard(null);
  };

  return {
    handleClickDiscard,
    handleClickEmptyCell,
    handleClickPlayer,
    handleClickFinish,
    handleClickBoardCell,
    handleClickTool,
  };
};

export default usePlayCard;
