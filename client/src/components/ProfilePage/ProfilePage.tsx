import { Dispatch, FC, SetStateAction } from "react";
import styles from "./ProfilePage.module.scss";
import { motion } from "framer-motion";

interface ProfileProps {
  isOpen: boolean;
  toggleOpen: Dispatch<SetStateAction<boolean>>;
}

const ProfilePage: FC<ProfileProps> = ({ toggleOpen, isOpen }) => {
  const modalContainerClassNames = `${styles.profileModal} ${isOpen ? styles.open : ""}`;
  const overlayClassNames = `${styles.overlay} ${isOpen ? styles.openOverlay : ""}`;
  return (
    <>
      <motion.div className={modalContainerClassNames}
      initial={{ transform: "translate(-50%, -250%)" }}
      animate={{ transform: "translate(-50%, -50%)" }}
      exit={{ transform: "translate(-50%, 250%)" }} >
    
        <div className={styles.bannerProfile}>
          {" "}
        </div>
        <div className={styles.headerProfile}>
          <div className={styles.imageProfile}>
            {" "}
            <img className={styles.img} src="./images/avatar.png" />
          </div>
          <div className={styles.TitleProfile}>Profile</div>
        </div>
        <div className={styles.footerProfile}></div>
      </motion.div>
      <div className={overlayClassNames} onClick={() => toggleOpen(false)}></div>
    </>
  );
};

export default ProfilePage;
