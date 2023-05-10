import { motion } from "framer-motion";
import { FC } from "react";
import { backgroundColor, pathVariants, strokeColor } from "./SvgCard";

interface ISvgComponent {
  shouldAnimate: boolean;
}

const SVGComponent: FC<ISvgComponent> = ({ shouldAnimate }) => (
  <svg
    width={46}
    height={70}
    viewBox="0 0 46 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width={46} height={70} rx={5} fill={backgroundColor} />
    <motion.path
      d="M46 29h-5.353L29 8.286V0m17 33h-7.381L25 8.766V0m21 37h-9.4L21 9.764V0m25 41H34.586L17 10.762V0"
      stroke={strokeColor}
      strokeWidth={2}
      variants={pathVariants}
      initial={shouldAnimate ? "hidden" : "visible"}
      animate="visible"
    />
  </svg>
);
export default SVGComponent;
