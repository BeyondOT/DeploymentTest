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
      d="M46 29h-6.353L34.5 20M46 33h-8.381L28.5 17M46 37H35.6L28 23.5M46 41H33.586L19.5 17"
      stroke={strokeColor}
      strokeWidth={2}
      variants={pathVariants}
      initial={shouldAnimate ? "hidden": "visible"}
      animate="visible"
    />
    <motion.path
      d="M20.5 16a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm8 6a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm7-3a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm-6-3a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
      stroke={strokeColor}
      variants={pathVariants}
      initial={shouldAnimate ? "hidden": "visible"}
      animate="visible"
    />
  </svg>
);
export default SVGComponent;
