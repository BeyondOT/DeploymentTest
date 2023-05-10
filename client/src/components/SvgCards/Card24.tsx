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
      d="M26.5 53a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0-36a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm-8 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm4 23a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm-4 5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm12-44a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm-8 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm8 46a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
      stroke={strokeColor}
      variants={pathVariants}
      initial={shouldAnimate ? "hidden": "visible"}
      animate="visible"
    />
    <motion.path
      d="M17 0v24m4-24v16m4-16v16m4-16v8M17 70V54m4 16V49m4 21V54m4 16v-6"
      stroke={strokeColor}
      strokeWidth={2}
      variants={pathVariants}
      initial={shouldAnimate ? "hidden": "visible"}
      animate="visible"
    />
  </svg>
);
export default SVGComponent;
