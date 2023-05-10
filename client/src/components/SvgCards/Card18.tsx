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
    xmlns="http://www.w3.org/2000/svg%22%3E"
  >
    <rect width={46} height={70} rx={5} fill={backgroundColor} />
    <motion.path
      d="M25.002.019v20m-4.004-20v16m-4.005-16v9m12.014-9v16M0 33.004h22M.004 37.012h16.992M.004 41.008s5.267.02 8.004-.004M0 29.004h16.996m29.005 4.015h-5.978M46 36.996H30.016M45.996 41H26.012m19.992-11.996-15.996.075"
      stroke={strokeColor}
      strokeWidth={2}
      variants={pathVariants}
      initial={shouldAnimate ? "hidden": "visible"}
      animate="visible"
    />
    <motion.path
      d="M15.51 10.12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm4 7a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm4 4a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm4-4a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm-11 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm5 4a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm-5 4a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm-9 4a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm20-12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm10 4a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm-10 4a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm-4 4a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
      stroke={strokeColor}
      variants={pathVariants}
      initial={shouldAnimate ? "hidden": "visible"}
      animate="visible"
    />
  </svg>
);
export default SVGComponent;
