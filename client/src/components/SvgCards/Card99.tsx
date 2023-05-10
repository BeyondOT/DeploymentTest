import { backgroundColor, pathVariants, strokeColor } from "./SvgCard";
const SVGComponent = () => (
  <svg
    width={46}
    height={70}
    viewBox="0 0 46 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width={46} height={70} rx={5} fill={backgroundColor} />
    <rect x={13} y={25} width={20} height={20} rx={2} fill={strokeColor} />
    <path
      d="M0 41h3l4 2h6.5M0 29h3l4-2h6.5M0 37h46M0 33h46m0-4h-3l-4-2h-6.5M46 41h-3l-4 2h-7M25 0v70m4-70v7l2 8v10.5M17 0v7l-2 8v10.5M21 0v70m8 0v-7l2-9v-9.5M17 70v-7l-2-9v-9.5"
      stroke={strokeColor}
      strokeWidth={2}
    />
    <rect
      x={17}
      y={29}
      width={12}
      height={12}
      rx={1}
      stroke={backgroundColor}
      strokeWidth={2}
    />
    <g clipPath="url(#a)">
      <path
        d="M20.745 35.667h1.472l-.304 2.873a.417.417 0 0 0 .753.286l2.912-4.16a.417.417 0 0 0-.333-.667h-1.802l.3-2.533a.417.417 0 0 0-.755-.289L20.41 35a.417.417 0 0 0 .333.667Z"
        fill="#000"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M19 31h8v8h-8z" />
      </clipPath>
    </defs>
  </svg>
);
export default SVGComponent;
