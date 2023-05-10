import { Dispatch, FC, SetStateAction, useState } from 'react';
import styles from './AddFriend.module.scss';
import AddFriendData from './AddFriendData';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';



interface AddFriendProps {
    isOpen: boolean;
    toggleOpen: Dispatch<SetStateAction<boolean>>;
}


const AddFriend: FC<AddFriendProps> = ({ toggleOpen, isOpen }) => {
  const [searchValue, setSearchValue] = useState('');
  const {t}=useTranslation(['home']);


  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  
  const modalContainerClassNames = `${styles.menuModal} ${isOpen ? styles.open : ""}`;
  const overlayClassNames = `${styles.overlay} ${isOpen ? styles.openOverlay : ""}`;
  return (
    <>
  <motion.div 
    className={modalContainerClassNames}
    initial={{ transform: "translate(-50%, -250%)" }}
    animate={{ transform: "translate(-50%, -50%)" }}
    exit={{ transform: "translate(-50%, 250%)" }} >
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{t('Add Friends')}</h2>
          <button className={styles.closeButton} onClick={() => toggleOpen(false)}>
            X
          </button>
        </div>
        <div className={styles.content}
        
        >
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchInputChange}
            placeholder={t('Search for a friend') as string}
            className={styles.searchInput}
          />
          <AddFriendData searchValue={searchValue}/>
        </div>
      </div>
    </motion.div>
      <div className={overlayClassNames} onClick={() => toggleOpen(false)}></div>
    </>
  );
};

export default AddFriend;
