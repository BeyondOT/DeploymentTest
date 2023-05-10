import { IAuthSocket } from "@shared/socket";
import { AnimatePresence, motion as m } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IoMdMenu } from "react-icons/io";
import { NavLink } from "react-router-dom";
import Friends from "../../components/Friends/Friends/Friends";
import JoinParty from "../../components/JoinParty/JoinParty";
import LanguageSelector from "../../components/Languages/LanguageSelector";
import Lobby from "../../components/Lobby/Lobby";
import ProfilePage from "../../components/ProfilePage/ProfilePage";
import LogoutNav from "../../features/authentication/logout/NavBar/LogoutNav";
import { useBoundStore } from "../../stores/store";
import styles from "./GameHomePage.module.scss";

export default function GameHomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenFriends, setIsOpenFriends] = useState(true);
  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const hoverAnimation = { scale: 1.2, color: "rgb(255,0,0)" };
  const socket = useBoundStore((state) => state.socket);
  const sendAuthInfos = useBoundStore((state) => state.sendAuthInfos);
  const userData = useBoundStore((state) => state.userData);
  const token = useBoundStore((state) => state.token);
  const { t } = useTranslation(["home"]);
  const getUser = useBoundStore((state) => state.getUser);

  // TODO: ATTENTION SI USER VA DIRECTEMENT SUR CREATE PARTy PROBLEME

  useEffect(() => {
    if (userData) {
      const data: IAuthSocket = {
        pseudo: userData?.pseudo,
        userId: userData?._id,
        friends: userData.friends,
      };
      sendAuthInfos(data);
    }
  }, []);

  const links = [
    {
      title: t("Create Party"),
      link: "/createParty",
    },
    {
      title: "Credits",
      link: "/Credits",
    },
  ];

  const listItems = links.map((link) => (
    <m.div whileHover={hoverAnimation} className={styles.links} key={link.title}>
      <NavLink to={link.link}>{link.title}</NavLink>
    </m.div>
  ));

  return (
    <m.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Lobby toggleOpen={setIsOpen} />
      <AnimatePresence>
        {isOpen ? (
          <JoinParty toggleOpen={setIsOpen} isOpen={isOpen} key={"JoinParty"} />
        ) : null}
      </AnimatePresence>
      <LogoutNav />
      <div className={styles.icon}>
        <div className={styles.NavIcon}>
          <IoMdMenu size={50} onClick={() => setIsOpenFriends(!isOpenFriends)} />
        </div>
      </div>
      <LanguageSelector />
      <AnimatePresence>
        {isOpenFriends ? (
          <Friends toggleOpen={setIsOpenFriends} isOpen={isOpenFriends} />
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {isOpenProfile ? (
          <ProfilePage toggleOpen={setIsOpenProfile} isOpen={isOpenProfile} />
        ) : null}
      </AnimatePresence>
      <div className={styles.list}>
        <m.div whileHover={hoverAnimation} className={styles.links}>
          <li onClick={() => setIsOpen(true)}>{t("Join Party")}</li>
        </m.div>
        {listItems}
        <m.div whileHover={hoverAnimation} className={styles.links}>
          <li onClick={() => setIsOpenProfile(true)}>Profile</li>
        </m.div>
      </div>
    </m.div>
  );
}
