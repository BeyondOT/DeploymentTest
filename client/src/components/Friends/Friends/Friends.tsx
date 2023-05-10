import styles from "./Friends.module.scss"
import { IoMdMenu } from "react-icons/io"
import { IconContext } from "react-icons";
import { Dispatch, FC, SetStateAction, useState, useEffect } from "react";
import FetchedFriendsData from "./FriendsData";
import HomePageChat from "../../HomePageChat/HomePageChat";
import { useBoundStore } from "../../../stores/store";
import { FiUserPlus } from 'react-icons/fi';
import AddFriend from "../AddFriend/AddFriend";
import { useTranslation } from "react-i18next";
import { AnimatePresence, m, motion } from "framer-motion";


// TODO : implement the sidebar Data with the map function ideally
interface FriendsProps {
    isOpen: boolean;
    toggleOpen: Dispatch<SetStateAction<boolean>>;
}

const Friends: FC<FriendsProps> = ({ toggleOpen, isOpen }) => {
    const [OpenChat, setIsOpen] = useState(false);
    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const { socket } = useBoundStore();
    const {t}=useTranslation(['home']);
    //   const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {

    }, [socket]);

    const showSideBar = () => {
        toggleOpen(!isOpen);
    };

    const handleClick = () => {
        setIsOpen(true);
    };

    const handleAddFriendClick = () => {
        setIsOpenAdd(true);
    };
    

    const modalContainerClassNames = `${styles.sidebarNav} ${isOpen ? styles.open : ""}`;
    return (
        <>
            <AnimatePresence>
                {isOpenAdd ?(
                <AddFriend toggleOpen={setIsOpenAdd} isOpen={isOpenAdd}/>
                ) : null}
            </AnimatePresence>
            <IconContext.Provider value={{ color: '#fff' }}>
                <motion.div className={modalContainerClassNames}
                    initial={{ transform: "translate(100%, 0%)" }}
                    animate={{ transform: "translate(-0%, 0%)" }}
                    exit={{ transform: "translate(100%, 0%)" }}
                    transition={{ duration: 0.5 }}
                >
                    <div className={styles.sidebarWrap}>
                        <div className={styles.NavIcon}>
                            <IoMdMenu size={50} onClick={showSideBar} />
                        </div>
                        <div>
                            <HomePageChat toggleOpen={setIsOpen} OpenChat={OpenChat} />
                        </div>
                        <div className={styles.friendscontainer} onDoubleClick={handleClick}>
                            <FetchedFriendsData />
                        </div>
                        <div className={styles.addFriend} onClick={handleAddFriendClick}>
                            {t('Add Friends')}
                            <div className={styles.addFriendButton}> 
                                <FiUserPlus size={25}/>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </IconContext.Provider>
        </>
    )
}

export default Friends;