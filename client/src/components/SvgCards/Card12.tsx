import { backgroundColor } from "./SvgCard";
const SVGComponent = () => (
  <svg
    width={46}
    height={70}
    viewBox="0 0 46 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#b)">
      <rect width={46} height={70} rx={5} fill={backgroundColor} />
      <rect x={6.5} y={29.5} width={31} height={14} rx={3} stroke="#0E1116" />
      <rect x={8.5} y={31.5} width={2} height={2} rx={0.5} stroke="#0E1116" />
      <rect x={12.5} y={31.5} width={2} height={2} rx={0.5} stroke="#0E1116" />
      <rect x={16.5} y={31.5} width={2} height={2} rx={0.5} stroke="#0E1116" />
      <rect x={20.5} y={31.5} width={2} height={2} rx={0.5} stroke="#0E1116" />
      <rect x={24.5} y={31.5} width={2} height={2} rx={0.5} stroke="#0E1116" />
      <rect x={28.5} y={31.5} width={2} height={2} rx={0.5} stroke="#0E1116" />
      <rect x={32.5} y={31.5} width={2} height={2} rx={0.5} stroke="#0E1116" />
      <rect x={10.5} y={35.5} width={2} height={2} rx={0.5} stroke="#0E1116" />
      <rect x={14.5} y={35.5} width={2} height={2} rx={0.5} stroke="#0E1116" />
      <rect x={18.5} y={35.5} width={2} height={2} rx={0.5} stroke="#0E1116" />
      <rect x={22.5} y={35.5} width={2} height={2} rx={0.5} stroke="#0E1116" />
      <rect x={26.5} y={35.5} width={2} height={2} rx={0.5} stroke="#0E1116" />
      <rect x={30.5} y={35.5} width={2} height={2} rx={0.5} stroke="#0E1116" />
      <rect x={8.5} y={39.5} width={2} height={2} rx={0.5} stroke="#0E1116" />
      <rect x={12.5} y={39.5} width={2} height={2} rx={0.5} stroke="#0E1116" />
      <rect x={28.5} y={39.5} width={2} height={2} rx={0.5} stroke="#0E1116" />
      <rect x={32.5} y={39.5} width={2} height={2} rx={0.5} stroke="#0E1116" />
      <rect x={16.5} y={39.5} width={10} height={2} rx={0.5} stroke="#0E1116" />
      <path
        stroke="#0E1116"
        d="M19.5 27.5h5v2h-5zM22 27v-1a2 2 0 0 0-2-2h-9.75a1.75 1.75 0 1 1 0-3.5H29.5A1.5 1.5 0 0 0 31 19v-3"
      />
      <path d="M44 17 2 49m0-32 42 33" stroke="#000" strokeWidth={3} />
    </g>
    <defs>
      <clipPath id="b">
        <path fill="#fff" d="M0 0h46v70H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SVGComponent;
