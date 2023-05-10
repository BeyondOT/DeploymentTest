import { Categorie, Tools } from "@shared/socket";
import { FC } from "react";
import { useBoundStore } from "../../stores/store";
import SvgPower from "../SvgCards/SvgPower";
import styles from "./PlayingCard.module.scss";
import useSelectCard from "./useSelectCard";

interface PowerProps {
  categorie: Categorie;
  targetTools: Tools;
}

const Power: FC<PowerProps> = ({ categorie, targetTools }) => {
  const { isSelected, handleSelectCard } = useSelectCard(
    100000,
    "",
    categorie,
    false,
    targetTools
  );

  const powerLeft = useBoundStore((state) => state.mainPlayer.powerLeft);

  const containerClassNames = `${styles.card} ${styles.container} ${styles.power} `;

  return (
    <div
      className={containerClassNames}
      onClick={() => {
        handleSelectCard(true);
      }}
    >
      <SvgPower powerLeft={powerLeft} isSelected={isSelected} />
    </div>
  );
};
export default Power;
