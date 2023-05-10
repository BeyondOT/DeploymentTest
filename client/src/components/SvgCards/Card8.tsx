import { backgroundColor } from "./SvgCard";
const SVGComponent = () => (
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
    <path
      d="M32.5 39.5c0 4.203-1.044 7.068-2.656 8.878C28.238 50.18 26.011 51 23.5 51s-4.738-.82-6.344-2.622c-1.612-1.81-2.656-4.675-2.656-8.878s1.045-7.985 2.709-10.699c1.669-2.723 3.907-4.301 6.291-4.301 2.384 0 4.622 1.578 6.291 4.301C31.455 31.515 32.5 35.297 32.5 39.5ZM15 34h17"
      stroke="#000"
    />
    <path
      d="M23.5 33.5V24a3 3 0 0 0-3-3h-2.25a2.75 2.75 0 1 1 0-5.5h7.25a3 3 0 0 0 3-3V12"
      stroke="#000"
    />
    <path d="M44 18 2 50m0-32 42 33" stroke="#000" strokeWidth={3} />
  </svg>
);
export default SVGComponent;
