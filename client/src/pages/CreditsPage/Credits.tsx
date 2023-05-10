import React, { useEffect, useState } from 'react';
import styles from './Credits.module.scss';
import BackButton from "../../components/BackButton/BackButton";


interface CreditsProps {
  credits: string[];
}

const Credits: React.FC<CreditsProps> = ({ credits }) => {
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const scrollSpeed = 2; 
  const scrollDelay = 50; 


  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.pageYOffset;
      setScrollPosition(currentPosition);
    };
    

    window.addEventListener('scroll', handleScroll);

    const scrollTimer = setInterval(() => {
      const currentPosition = window.pageYOffset;
      const newPosition = currentPosition + scrollSpeed;
      window.scrollTo(0, newPosition);
      setScrollPosition(newPosition);
    }, scrollDelay);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(scrollTimer);
    };
  }, []);

  return (
    <>
      <BackButton />
    <div className={styles.creditsContainer}>
      <div className={styles.creditsText} >
        {credits.map((credit: string, index: number) => (
          <p key={index}>{credit}</p>
        ))}
      </div>
    </div>
    </>
  );
};

export default Credits;
