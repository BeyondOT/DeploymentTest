import { ICallbackObject } from "@shared/socket";
import { motion } from "framer-motion";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { useNavigate } from "react-router";
import { Flip, ToastContainer, toast } from "react-toastify";
import { useBoundStore } from "../../stores/store";
import styles from "./JoinParty.module.scss";
import { useTranslation } from "react-i18next";

interface JoinPartyProps {
  isOpen: boolean;
  toggleOpen: Dispatch<SetStateAction<boolean>>;
}

interface JoinRoomParams {
  username: string;
  roomName: string;
}

// TODO: Creer un callback pour "joinRoom" et envoyer le joueur sur une page d'attente

const JoinParty: FC<JoinPartyProps> = ({ toggleOpen, isOpen }) => {
  const [roomName, setRoomName] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const {t} = useTranslation(['home']);

  const { socket } = useBoundStore();
  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!socket) {
      return console.log("Error la socket n'est pas défini");
    }
    const joinRoomParams: JoinRoomParams = {
      username: username,
      roomName: roomName,
    };
    socket.emit("joinRoom", joinRoomParams, (response: ICallbackObject) => {
      if (response.status === "ok") {
        toast.success("La room a été trouvée. Redirection en cours...", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setTimeout(() => console.log("lol"));
        // navigate("/game");
      } else {
        toast.error(response.message, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    });
  };
  const modalContainerClassNames = `${styles.menuModal} ${isOpen ? styles.open : ""}`;
  const overlayClassNames = `${styles.overlay} ${isOpen ? styles.openOverlay : ""}`;
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Flip}
      />
      <motion.form
        className={modalContainerClassNames}
        action=""
        initial={{ transform: "translate(-50%, -250%)" }}
        animate={{ transform: "translate(-50%, -50%)" }}
        exit={{ transform: "translate(-50%, 250%)" }}
      >
        <label htmlFor="partyName">{t("Party Name")}:</label>
        <input
          type="text"
          name="partyName"
          onChange={(e) => setRoomName(e.target.value)}
        />

        <button onClick={(e) => handleSubmit(e)}>{t("Join Party")}</button>
      </motion.form>

      <div className={overlayClassNames} onClick={() => toggleOpen(false)}></div>
    </>
  );
};
export default JoinParty;
