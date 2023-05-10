import React, { useState } from "react";
import styles from "./BanField.module.scss";
import { useTranslation } from "react-i18next";

type Operator = {
  id: number;
  name: string;
  image: string;
};

type BanFieldProps = {
  operators: Operator[];
  onBan?: (bannedOperators: Operator[]) => void;
};

const BanField: React.FC<BanFieldProps> = ({ operators, onBan }) => {
  const [selectedOperators, setSelectedOperators] = useState<Operator[]>([]);
  const {t} = useTranslation(['home']);

  const handleOperatorClick = (operator: Operator) => {
    if (selectedOperators.some((o) => o.id === operator.id)) {
      setSelectedOperators(selectedOperators.filter((o) => o.id !== operator.id));
    } else {
      setSelectedOperators([...selectedOperators, operator]);
    }
  };

  const handleBanClick = () => {
    //   onBan(selectedOperators);
  };

  return (
    <div className={styles.container}>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {operators.map((operator) => (
          <div
            key={operator.id}
            onClick={() => handleOperatorClick(operator)}
            className={styles.operator}
            style={{
              backgroundColor: selectedOperators.some((o) => o.id === operator.id)
                ? "rgba(235, 0, 0, 0.5)"
                : "inherit",
            }}
          >
            <img src={operator.image} alt={operator.name} />
            <p
              className={styles.title}
              style={{
                color: selectedOperators.some((o) => o.id === operator.id)
                  ? "red"
                  : "white",
              }}
            >
              {operator.name}
            </p>
          </div>
        ))}
        <button className={styles.Ban}>{t('Ban Operators')}</button>
      </div>
    </div>
  );
};

export default BanField;
