import { motion } from "framer-motion";
import { backgroundColor, pathVariants, strokeColor } from "./SvgCard";
import { FC } from "react";

interface ISvgComponent{
  shouldAnimate: boolean
}

const SVGComponent:FC<ISvgComponent> = ({shouldAnimate}) => (
  <svg
    width="46"
    height="70"
    viewBox="0 0 46 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="46" height="70" rx="5" fill={backgroundColor} />
    <motion.path
      d="M29 62V0m-4 35V0m-4 55V0m-4 40V0"
      stroke-width="2"
      stroke={strokeColor}
      strokeWidth={2}
      variants={pathVariants}
      initial={shouldAnimate ? "hidden": "visible"}
      animate="visible"
    />
    <motion.path
      d="M27.5 63a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm-12-22a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm4 15a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm4-20a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
      stroke={strokeColor}
      strokeWidth={1}
      variants={pathVariants}
      initial={shouldAnimate ? "hidden": "visible"}
      animate="visible"
    />
  </svg>
);
export default SVGComponent;
