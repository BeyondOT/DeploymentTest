import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineSetting } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useBoundStore } from "../../stores/store";
import styles from "./InGameMenu.module.scss";

const InGameMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const playerState = useBoundStore((state) => state.playerState);
  const setPlayerState = useBoundStore((state) => state.setPlayerState);
  const navigate = useNavigate();

  const { t } = useTranslation(["home"]);

  const handleMainMenuClick = () => {
    setPlayerState("idle");
    navigate("/homepage");
  };

  const modalContainerClassNames = `${styles.menuModal} ${isOpen ? styles.open : ""}`;
  const overlayClassNames = `${styles.overlay} ${isOpen ? styles.openOverlay : ""}`;
  return (
    <>
      <div
        className={styles.menuButton}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <AiOutlineSetting size="32px" />
      </div>
      <div className={modalContainerClassNames}>
        <span>Menu</span>
        <button className="button" onClick={() => setIsOpen(false)}>
          {t("Resume")}
        </button>
        <button className="button">Options</button>
        <button className="button" onClick={handleMainMenuClick}>
          {t("Main Menu")}
        </button>
      </div>
      <div className={overlayClassNames} onClick={() => setIsOpen(false)}></div>
    </>
  );
};
export default InGameMenu;
