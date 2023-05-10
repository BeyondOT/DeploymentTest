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
      transform="matrix(-1 0 0 1 46 0)"
      fill={backgroundColor}
    />
    <motion.path
      d="M21 70V0m-4 70V0m29 29h-7L29 9V0m17 41-7.107.007L29 61v9m17-36.993h-9.145L25 10V0m21 37h-5 .5H37L25.01 60.007 25 70"
      stroke={strokeColor}
      strokeWidth={2}
      variants={pathVariants}
      initial={shouldAnimate ? "hidden" : "visible"}
      animate="visible"
    />
  </svg>
);
export default SVGComponent;
