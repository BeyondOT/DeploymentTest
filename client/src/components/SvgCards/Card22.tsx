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
      d="M30.5 60a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm-4-7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm-4-4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm-4 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm11-12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm-5-4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm5-4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm9-4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm-20 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm-10-4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm10-4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm4-4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm8-12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm-4 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm-4-8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm-4 5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
      stroke={strokeColor}
      variants={pathVariants}
      initial={shouldAnimate ? "hidden": "visible"}
      animate="visible"
    />
    <motion.path
      d="M17 0v21m4-21v16m4-16v24m4-24v16m-8 54V50m4 20V54m4 16v-9m-12 9V54m29-17H24m22-4H29m17-4h-8m8 12H29M0 37h6m-6-4h16M0 29h20M0 41h16"
      stroke={strokeColor}
      strokeWidth={2}
      variants={pathVariants}
      initial={shouldAnimate ? "hidden": "visible"}
      animate="visible"
    />
  </svg>
);
export default SVGComponent;
