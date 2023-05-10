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
      d="M25 0v20M21 0v5m-4-5v9m12-9v16M0 33h22M0 37h17M0 41s18.675.023 30 0M0 29h17"
      stroke={strokeColor}
      strokeWidth={2}
      variants={pathVariants}
      initial={shouldAnimate ? "hidden": "visible"}
      animate="visible"
    />
    <motion.path
      d="M19.5 6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm-4 4a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm8 11a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm4-4a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm-6 16a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm-5-4a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm13 4a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
      stroke={strokeColor}
      variants={pathVariants}
      initial={shouldAnimate ? "hidden": "visible"}
      animate="visible"
    />
  </svg>
);
export default SVGComponent;
