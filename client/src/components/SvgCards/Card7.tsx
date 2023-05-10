import { backgroundColor } from "./SvgCard";
const SVGComponent = () => (
  <svg
    width={45}
    height={70}
    viewBox="0 0 45 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      width={45}
      height={70}
      rx={5}
      transform="matrix(-1 0 0 1 45 0)"
      fill={backgroundColor}
    />
    <path
      d="M31.5 42.5c0 4.203-1.044 7.068-2.656 8.878C27.238 53.18 25.011 54 22.5 54s-4.738-.82-6.344-2.622c-1.612-1.81-2.656-4.675-2.656-8.878s1.045-7.985 2.709-10.699c1.669-2.723 3.907-4.301 6.291-4.301 2.384 0 4.622 1.578 6.291 4.301C30.455 34.515 31.5 38.297 31.5 42.5ZM14 37h17"
      stroke="#000"
    />
    <path
      d="M22.5 36.5V27a3 3 0 0 0-3-3h-2.25a2.75 2.75 0 1 1 0-5.5h7.25a3 3 0 0 0 3-3V15"
      stroke="#000"
    />
  </svg>
);
export default SVGComponent;
