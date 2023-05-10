import { useNavigate } from "react-router-dom";
import {BsFillArrowLeftSquareFill} from "react-icons/bs";
import styles from "./BackButton.module.scss";

const BackButton = () => {
  const history = useNavigate();

  const handleClick = () => {
    history(-1);
  };

  return (
    <div onClick={handleClick} className={styles.Back}>
        <BsFillArrowLeftSquareFill className={styles.button} size={30}/>
    </div>
  );
};

export default BackButton;
