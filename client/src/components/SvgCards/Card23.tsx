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
      d="M29 70V49m-4 21V54m-4 16V46m-4 24V36m8-36v8.5M21 0v16M17 0v9m12-9v16m17 17h-6m6 4H30m16 4H26m20-12H30"
      stroke={strokeColor}
      strokeWidth={2}
      variants={pathVariants}
      initial={shouldAnimate ? "hidden": "visible"}
      animate="visible"
    />
    <motion.path
      d="M15.5 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm4 7a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm4-7a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm4 7a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm10 4a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm-10 4a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm-4 4a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm-8-6a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm4 10a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm4 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm4-5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
      stroke={strokeColor}
      variants={pathVariants}
      initial={shouldAnimate ? "hidden": "visible"}
      animate="visible"
    />
  </svg>
);
export default SVGComponent;
