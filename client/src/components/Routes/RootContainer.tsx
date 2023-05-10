import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router";
import AnimatedOutlet from "./AnimatedOutlet";

const RootContainer = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <AnimatedOutlet key={location.pathname} />
    </AnimatePresence>
  );
};

export default RootContainer;
