import { Variants, motion, useAnimation } from "framer-motion";
import { FC, useEffect } from "react";

export const powerVariants: Variants = {
  hidden: {
    strokeDasharray: 1000,
    strokeDashoffset: 1000,
  },
  visible: {
    strokeDashoffset: 0,
    transition: {
      pathLength: { duration: 2, ease: "easeInOut" },
      strokeDashoffset: { duration: 4, ease: "easeInOut" },
    },
  },
  selected: {
    scale: [1, 1.2],
    // fill: "var(--clr-accent-light)",

    transition: {
      scale: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      },
    },
  },
  deselected: {
    scale: 1,
    // fill: "#D9D9D9",

    transition: {
      fill: { duration: 0.5, ease: "easeInOut" },
    },
  },
};

export const textVariants: Variants = {
  hidden: {},
  visible: {},
  selected: {
    fill: "#ffffff",
  },
  deselected: {
    fill: "var(--clr-accent-light)",
  },
};

interface ISvgPowerProps {
  powerLeft: number;
  isSelected: boolean;
}

export const gradientVariants: Variants = {
  hidden: {
    offset: "0",
  },
  visible: {
    offset: "0",
  },
  selected: {
    offset: "100%",
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
  deselected: {
    offset: "0",
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};
const SvgPower: FC<ISvgPowerProps> = ({ powerLeft, isSelected }) => {
  const controls = useAnimation();
  const insidePathControls = useAnimation();
  const gradientControls = useAnimation();

  useEffect(() => {
    controls.start("visible");
    insidePathControls.start("visible");
  }, [controls, insidePathControls]);

  useEffect(() => {
    if (isSelected && powerLeft > 0) {
      insidePathControls.start("selected");
      gradientControls.start("selected");
    } else if (isSelected && powerLeft === 0) {
      insidePathControls.start("dead");
    } else {
      insidePathControls.start("deselected");
      gradientControls.start("deselected");
    }
  }, [gradientControls, insidePathControls, isSelected, powerLeft]);

  return (
    <motion.svg
      width="46"
      height="70"
      viewBox="0 0 46 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.rect x="0.5" y="0.5" width="45" height="69" rx="4.5" />
      <motion.path
        d="M20.1581 51.9554L30.134 38.7116L35.84 31.4406L38.5088 27.9351C39.01 27.2768 38.5406 26.3294 37.7132 26.3294H31.2903C30.5925 26.3294 30.1092 25.6326 30.3537 24.9789L33.4972 16.577C33.7417 15.9234 33.2585 15.2266 32.5606 15.2266H16.3089C15.8973 15.2266 15.5278 15.4788 15.3777 15.8621L6.79819 37.7781C6.54271 38.4307 7.02039 39.1369 7.72121 39.1426L18.3982 39.2299C18.9839 39.2347 19.4402 39.7397 19.3857 40.3229L18.3637 51.2608C18.2699 52.2643 19.5516 52.7605 20.1581 51.9554Z"
        stroke="black"
        strokeWidth="1"
        variants={powerVariants}
        initial="hidden"
        animate={insidePathControls}
        fill="url(#gradient)"
        filter={isSelected && powerLeft > 0 ? "url(#glow)" : ""}
      />
      <motion.text
        x="50%"
        y="45%"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="10"
        fontWeight="bold"
        fill="blue"
        variants={textVariants}
        initial="hidden"
        animate={insidePathControls}
      >
        {powerLeft}
      </motion.text>

      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
          <feOffset in="blur" dx="0" dy="0" result="offsetBlur" />
          <feMerge>
            <feMergeNode in="offsetBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="gradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <motion.stop
            offset="0%"
            stopColor="var(--clr-accent-light)"
            variants={gradientVariants}
            initial="hidden"
            animate={gradientControls}
          />
          <motion.stop
            offset="100%"
            stopColor="var(--clr-main-light)"
            stopOpacity={1}
            variants={gradientVariants}
            initial="hidden"
            animate={gradientControls}
          />
        </linearGradient>
      </defs>
    </motion.svg>
  );
};
export default SvgPower;
