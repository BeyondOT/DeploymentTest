import { CreateRoomParams, ICallbackObject } from "@shared/socket";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flip, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackButton from "../../components/BackButton/BackButton";
import BanField from "../../components/Ban/BanField";
import Lobby from "../../components/Lobby/Lobby";
import { useBoundStore } from "../../stores/store";
import styles from "./CreateParty.module.scss";
import { useTranslation } from "react-i18next";

const CreateParty = () => {
  const [dropDownValue, setDropDownValue] = useState(3);
  const [roomName, setRoomName] = useState("");
  const [isTestParty, setIsTestParty] = useState(false);
  const [gameMode, setGameMode] = useState("classic");
  const navigate = useNavigate();
  const { socket } = useBoundStore();
  const [nbIA, setNbIA] = useState(0);
  const { t, i18n } = useTranslation(['home']);


  const getBackgroundSize = () => {
    return { backgroundSize: `${(nbIA * 100) / (dropDownValue - 1)}% 100%` };
  };

  useEffect(() => {
    if (socket) {
      socket.on("roomCreated", () => {
        console.log("Halleluja");
      });
      socket.on("error", (error) => {
        console.log(error);
      });
    }
  }, [socket]);

  const operators = [
    {
      id: 32,
      name: "Jett",
      image: "/images/avatar.png",
    },
    {
      id: 31,
      name: "Phoenix",
      image: "/images/avatar.png",
    },
    {
      id: 45,
      name: "Jett",
      image: "/images/avatar.png",
    },
    {
      id: 6,
      name: "Phoenix",
      image: "/images/avatar.png",
    },
    {
      id: 4,
      name: "Jett",
      image: "/images/avatar.png",
    },
    {
      id: 3,
      name: "Phoenix",
      image: "/images/avatar.png",
    },
    {
      id: 2,
      name: "Jett",
      image: "/images/avatar.png",
    },
    {
      id: 1,
      name: "Phoenix",
      image: "/images/avatar.png",
    },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!socket) {
      return console.log("Error la socket n'est pas défini");
    }
    const createRoomParams: CreateRoomParams = {
      username: "JeanTeste",
      roomName: roomName,
      numberOfPlayers: dropDownValue,
      gameMode: "classic",
      nbIA: nbIA,
    };
    if (isTestParty) {
      socket.emit("createGameTest", createRoomParams, (response: ICallbackObject) => {
        if (response.status === "ok") {
          toast.success("La room a été crée. Redirection en cours...", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setTimeout(() => navigate("/game"), 1500);
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
    } else {
      socket.emit("createRoom", createRoomParams, (response: ICallbackObject) => {
        if (response.status === "ok") {
          toast.success("La room a été crée. Redirection en cours...", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          // setTimeout(() => navigate("/game"), 1500);
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
    }
  };



  return (
    <motion.div
      className={styles.Box}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className={styles.container}>
        <Lobby />
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

        <BackButton />
        <div className={styles.BorderContainer}>
          <div className={styles.titleContainer}>
            {i18n.language === "en" ? (
              <>
                <h1>{t("Custom")}</h1>
                <h1 className={styles.titlebottomEn}>{t("Party")}</h1>
              </>
            ) : (
              <>
                <h1>{t("Party")}</h1>
                <h1 className={styles.titlebottom}>{t("Custom")}</h1>
                
              </>
            )}
          </div>
          <div>
            <form action="" className={styles.formContainer}>
              <div className={styles.inputs}>
                <label htmlFor="partyName">{t("Party Name")}: </label>
                <input
                  type="text"
                  name="partyName"
                  id="partyName"
                  onChange={(e) => setRoomName(e.target.value)}
                />

                <label htmlFor="nbPlayers">{t("Number of players")}:</label>
                <select
                  name="nbPlayers"
                  id="nbPlayers"
                  value={dropDownValue}
                  onChange={(e) => {
                    setNbIA(0);
                    setDropDownValue(parseInt(e.target.value));
                  }}
                >
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                </select>
                <label htmlFor="nbIA">{t("Number of AI")}: {nbIA} </label>
                <div className={styles.Range}>
                  <input
                    type="range"
                    min={0}
                    max={dropDownValue - 1}
                    onChange={(e) => setNbIA(e.target.valueAsNumber)}
                    style={getBackgroundSize()}
                    value={nbIA}
                  />
                </div>
                <label htmlFor="gameMode">{t("Game Mode")}:</label>
                <select
                  name="gameMode"
                  id="gameMode"
                  value={gameMode}
                  onChange={(e) => setGameMode(e.target.value)}
                >
                  <option value="classic">{t("Classic")}</option>
                  <option value="speed">{t("Elimination")}</option>
                </select>
              </div>

              <div className={styles.checkbox}>
                <label htmlFor="testParty">Test Party?</label>
                <input
                  type="checkbox"
                  onChange={(e) => setIsTestParty(e.target.checked)}
                  checked={isTestParty}
                  name="testParty"
                />
              </div>
              <button type="submit" className="button" onClick={(e) => handleSubmit(e)}>
                {t("Create Party")}
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className={styles.BanField}>
        <BanField operators={operators} />
      </div>
    </motion.div>
  );
};
export default CreateParty;
