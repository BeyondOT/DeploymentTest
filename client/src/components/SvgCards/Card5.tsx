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
    <rect width={46} height={70} rx={5} fill={backgroundColor} />
    <motion.path
      d="M17 0v70m4-70v70m4-70v70m4-70v70"
      stroke={strokeColor}
      strokeWidth={2}
      variants={pathVariants}
      initial={shouldAnimate ? "hidden": "visible"}
      animate="visible"
    />
  </svg>
);
export default SVGComponent;
