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
      x={46}
      y={70}
      width={46}
      height={70}
      rx={5}
      transform="rotate(-180 46 70)"
      fill={backgroundColor}
    />
    <motion.path
      d="M25 0v20M21 0v16M17 0v35M29 0v8m17 25h-6m6 4H30m16 4.003H24M46 29H30"
      stroke={strokeColor}
      strokeWidth={2}
      variants={pathVariants}
      initial={shouldAnimate ? "hidden": "visible"}
      animate="visible"
    />
    <motion.path
      d="M19.5 17a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm4 4a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm-8 15a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm12-27a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 20a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm10 4a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm-10 4a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm-6 4a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
      stroke={strokeColor}
      variants={pathVariants}
      initial={shouldAnimate ? "hidden": "visible"}
      animate="visible"
    />
  </svg>
);
export default SVGComponent;
