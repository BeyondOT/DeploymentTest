import { motion } from "framer-motion";
import { backgroundColor, pathVariants, strokeColor } from "./SvgCard";
import { FC } from "react";

interface ISvgComponent{
  shouldAnimate: boolean
}
const SVGComponent:FC<ISvgComponent> = ({shouldAnimate}) => (
  <svg
    width={46}
    height={70}
    viewBox="0 0 46 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      width={46}
      height={70}
      rx={5}
      transform="matrix(1 0 0 -1 0 70)"
      fill={backgroundColor}
    />
    <motion.path
      d="M46 41h-6L29 61.714V70m17-33h-8L25 61.234V70m21-37H36L21 60.236V70m25-41H34L17 59.237V70"
      stroke={strokeColor}
      strokeWidth={2}
      variants={pathVariants}
      initial={shouldAnimate ? "hidden": "visible"}
      animate="visible"
    />
  </svg>
);
export default SVGComponent;
