import { FC } from "react";
import * as SVGComponents from "../../components/SvgCards";

const SVG_COMPONENT_MAP = {
  "1": SVGComponents.Card1,
  "2": SVGComponents.Card2,
  "3": SVGComponents.Card3,
  "4": SVGComponents.Card4,
  "5": SVGComponents.Card5,
  "6": SVGComponents.Card6,
  "7": SVGComponents.Card7,
  "8": SVGComponents.Card8,
  "9": SVGComponents.Card9,
  "10": SVGComponents.Card10,
  "11": SVGComponents.Card11,
  "12": SVGComponents.Card12,
  "13": SVGComponents.Card13,
  "14": SVGComponents.Card14,
  "15": SVGComponents.Card15,
  "16": SVGComponents.Card16,
  "17": SVGComponents.Card17,
  "18": SVGComponents.Card18,
  // "19": SVGComponents.Card19,
  // "20": SVGComponents.Card20,
  "21": SVGComponents.Card21,
  "22": SVGComponents.Card22,
  "23": SVGComponents.Card23,
  "24": SVGComponents.Card24,
  "25": SVGComponents.Card25,
  "26": SVGComponents.Card26,
  "99": SVGComponents.Card99,
  "999": SVGComponents.Card999,
  "69": SVGComponents.Card69,
  "70": SVGComponents.Card70,
};

export type TCardType = keyof typeof SVG_COMPONENT_MAP;

interface ISvgCardProps {
  type: TCardType;
  shouldAnimate: boolean;
}
export const strokeColor = "var(--clr-card-stroke)";
export const backgroundColor = "var(--clr-card-bg)";

export const pathVariants = {
  hidden: {
    pathLength: 0,
  },
  visible: {
    pathLength: 1,
    transition: {
      pathLength: { duration: 2, ease: "easeInOut" },
    },
  },
};

const SvgCard: FC<ISvgCardProps> = ({ type, shouldAnimate }) => {
  const SvgComponent = SVG_COMPONENT_MAP[type];

  if (!SvgComponent) {
    return null;
  }

  return <SvgComponent shouldAnimate={shouldAnimate} />;
};

export default SvgCard;
