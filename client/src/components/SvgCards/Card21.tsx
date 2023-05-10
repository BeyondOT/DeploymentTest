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
      d="M40.5 41a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm-16-4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm5-4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm9-4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm-20 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm-10-4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm10-4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm-6-4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
      stroke={strokeColor}
      variants={pathVariants}
      initial={shouldAnimate ? "hidden": "visible"}
      animate="visible"
    />
    <motion.path
      d="M46 37H24m22-4H29m17-4h-8m8 12h-6M0 37h6m-6-4h16M0 29h9.5M0 41h16"
      stroke={strokeColor}
      strokeWidth={2}
      variants={pathVariants}
      initial={shouldAnimate ? "hidden": "visible"}
      animate="visible"
    />
  </svg>
);
export default SVGComponent;
