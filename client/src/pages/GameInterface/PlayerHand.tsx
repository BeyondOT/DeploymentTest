import { AnimatePresence, motion as m } from "framer-motion";
import PlayingCard from "../../components/PlayingCard/PlayingCard";
import { useBoundStore } from "../../stores/store";
import styles from "./GameInterface.module.scss";

const PlayerHand = () => {
  const cardsHeld = useBoundStore((state) => state.mainPlayer.cardsHeld);

  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
    },
  };

  if (!cardsHeld) {
    return <div>No cards</div>;
  }
  return (
    <m.div
      className={styles.userCards}
      initial="hidden"
      animate="visible"
      variants={container}
    >
      <AnimatePresence mode="sync">
        {cardsHeld.map((card, index) => {
          return index === cardsHeld.length - 1 ? (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              key={`${card.cardId}-motion`}
              variants={item}
            >
              <PlayingCard
                type={card.cardType.toString()}
                id={card.cardId}
                key={`${card.cardId}`}
                categorie={card.categorie}
                targetTools={card.targetTools}
                isFlipped={card.isFlipped}
              />
            </m.div>
          ) : (
            <m.div
              key={`${card.cardId}-motion`}
              variants={item}
              exit={{ opacity: 0, height: 0 }}
            >
              <PlayingCard
                type={card.cardType.toString()}
                id={card.cardId}
                key={`${card.cardId}-${index}`}
                categorie={card.categorie}
                targetTools={card.targetTools}
                isFlipped={card.isFlipped}
              />
            </m.div>
          );
        })}
      </AnimatePresence>
    </m.div>
  );
};

export default PlayerHand;
