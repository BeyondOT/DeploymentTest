import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LanguageSelector.module.scss';

export default function LanguageSelector() {
    // *** Imported namespace home created on our i18n config file. ***
    const { t, i18n} = useTranslation(['home']);
    const [userLanguage, setUserLanguage] = React.useState('English');

    const traduction = (e: string) => {
      if (e === 'English') 
        return 'Francais' ; 
      else 
        return 'English';
    }

    const handleLanguageChange = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setUserLanguage(traduction(e.currentTarget.value));
      i18n.changeLanguage(traduction(e.currentTarget.value));
    };
    
    return (
      <div className={styles.languageselector}>
        <button className={styles.button} value={userLanguage} onClick={(event)=>handleLanguageChange(event)}>
          {userLanguage}
        </button>
      </div>
    );
};
