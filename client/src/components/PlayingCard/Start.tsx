import { Categorie } from "@shared/socket";
import { FC } from "react";
import SvgCard, { TCardType } from "../SvgCards/SvgCard";
import styles from "./PlayingCard.module.scss";

interface IStartProps {
  type: string;
  id: number;
  coordX: number;
  coordY: number;
  categorie: Categorie;
}

const Start: FC<IStartProps> = ({ type, id, coordX, coordY, categorie }) => {
  const containerClassNames = `${styles.card} ${styles[type]} ${styles.container}`;
  const wrapperClassNames = `${styles.svgWrapper}`;
  const typeSvg: TCardType = type as TCardType;
  return (
    <div className={containerClassNames}>
      <div className={wrapperClassNames}>
        <SvgCard type={typeSvg} shouldAnimate={true}/>
      </div>
    </div>
  );
};

export default Start;
