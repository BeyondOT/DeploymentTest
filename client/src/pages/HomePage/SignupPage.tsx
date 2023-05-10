import { AnimatePresence, motion } from "framer-motion";

import { useState } from "react";
import { ToastContainer } from "react-toastify";
import Login from "../../features/authentication/login/Login";
import Register from "../../features/authentication/register/Register";
import styles from "./HomePage.module.scss";
import LanguageSelector from "../../components/Languages/LanguageSelector";

export default function SignupPage() {
  const [shouldRegister, setShouldRegister] = useState(false);

  return (
    <motion.div
      className={styles.containerSign}
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: "0" }}
      exit={{ opacity: 0, x: "-100%" }}
      transition={{ duration: 0.2 }}
    >
      <ToastContainer />
      <LanguageSelector/>
      <AnimatePresence mode="popLayout">
        {shouldRegister ? (
          <motion.div
            className={styles.signup}
            initial={{ height: "0", x: "100%" }}
            animate={{ height: "100%", x: "0" }}
            exit={{ height: "0", x: "100%" }}
            transition={{ duration: 0.5 }}
            key={"Register"}
          >
            <Register setShouldRegister={setShouldRegister} />
          </motion.div>
        ) : (
          <motion.div
            className={styles.login}
            initial={{ x: "-100%" }}
            animate={{ x: "0" }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.5 }}
            key={"Login"}
          >
            <Login setShouldRegister={setShouldRegister} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
