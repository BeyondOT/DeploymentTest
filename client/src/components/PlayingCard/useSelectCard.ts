import { Categorie, IMove, Tools } from "@shared/socket";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useBoundStore } from "../../stores/store";

const useSelectCard = (
  id: number,
  type: string,
  categorie: Categorie,
  isFlipped?: boolean,
  targetTools?: Tools
) => {
  const [isSelected, setIsSelected] = useState(false);
  const [isRotated, setIsRotated] = useState(isFlipped);
  const selectedCard = useBoundStore((state) => state.mainPlayer.selectedCard);
  const selectCard = useBoundStore((state) => state.selectCard);
  const mainPlayerJob = useBoundStore((state) => state.mainPlayer.job);
  const mainPlayerId = useBoundStore((state) => state.mainPlayer.userId);
  const powerLeft = useBoundStore((state) => state.mainPlayer.powerLeft);
  const updateGame = useBoundStore((state) => state.updateGame);
  const playerTurn = useBoundStore((state) => state.playerTurn);

  const handleSelectCard = (isPower?: boolean) => {
    // If card is already selected unselect it
    toast.dismiss();
    if (isSelected) {
      selectCard(null);
      return;
    }
    if (isPower && powerLeft === 0) {
      toast("You have no power uses left.", { autoClose: false });
      selectCard(null);
      return;
    }
    if (selectedCard) {
      // If power is selected and it's the Debrouillard then send the event
      if (selectedCard.isPower && mainPlayerJob === "Debrouillard") {
        const move: IMove = {
          cardId: id,
          playerId: mainPlayerId,
          target: "Power",
        };
        if (mainPlayerId !== playerTurn) {
          toast("Ce n'est pas encore votre tour.");
          return;
        }
        updateGame(move);
        selectCard(null);
        return;
      }
    }
    //If none of the above just select the card
    selectCard({
      cardId: id,
      cardType: parseInt(type),
      categorie: categorie,
      isFlipped: isRotated,
      targetTools: targetTools,
      isPower: isPower,
    });

    // Send a custom toast depending on the player job
    if (isPower && mainPlayerJob === "Debrouillard") {
      toast("Select a card from you hand to discard it.", { autoClose: false });
      return;
    }
    if (isPower && mainPlayerJob === "Fixeur") {
      toast("Select a tool to repair by clicking on its icon.", { autoClose: false });
      return;
    }
    if (isPower && mainPlayerJob === "Briseur") {
      toast("Select a tool to break by clicking on its icon.", { autoClose: false });
      return;
    }
    if (isPower && mainPlayerJob === "Admin") {
      toast("Select one of the players to reveal his role.", { autoClose: false });
      return;
    }
    if (isPower && mainPlayerJob === "Hacker") {
      toast("Select one of the players to exchange your role with them.", {
        autoClose: false,
      });
      return;
    }
  };

  const handleRotate = () => {
    if (isSelected) {
      selectCard({
        cardId: id,
        cardType: parseInt(type),
        categorie: categorie,
        isFlipped: !isRotated,
      });
    }
    setIsRotated(!isRotated);
  };

  useEffect(() => {
    if (id === selectedCard?.cardId) {
      setIsSelected(true);
    } else {
      if (isSelected) {
        setIsSelected(false);
      }
    }
  }, [selectedCard, id, isSelected]);

  return { isSelected, handleSelectCard, isRotated, handleRotate };
};

export default useSelectCard;
