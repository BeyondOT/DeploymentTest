import { backgroundColor } from "./SvgCard";
const SVGComponent = () => (
  <svg
    width={46}
    height={70}
    viewBox="0 0 46 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width={46} height={70} rx={5} fill={backgroundColor} />
    <path stroke="#000" d="M16.5 48.5h13v2h-13zm2.5.5v-5m8 5v-5" />
    <rect x={6.5} y={20.5} width={33} height={18} rx={0.5} stroke="#000" />
    <rect x={6.5} y={38.5} width={33} height={5} rx={0.5} stroke="#000" />
    <circle cx={23} cy={41} r={1} fill="#0A0808" />
    <path d="M44 16 2 48m0-32 42 33" stroke="#000" strokeWidth={3} />
  </svg>
);
export default SVGComponent;
