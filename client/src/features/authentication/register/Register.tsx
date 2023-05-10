import { Dispatch, FC, SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useBoundStore } from "../../../stores/store";
import { UserRegister } from "../auth.types";
import styles from "./register.module.scss";
import { useTranslation } from "react-i18next";

interface IRegisterProps {
  setShouldRegister: Dispatch<SetStateAction<boolean>>;
}

const Register: FC<IRegisterProps> = ({ setShouldRegister }) => {
  const [pseudo, setPseudo] = useState("");
  const [pseudoError, setPseudoError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const {t,i18n} = useTranslation(['home']);

  const { register } = useBoundStore();

  const navigate = useNavigate();

  const checkErrors = () => {
    if (pseudo === "") {
      setPseudoError(t("Cannot be empty Pseudo") as string);
    }
    if (email === "") {
      setEmailError(t("Cannot be empty Email") as string);
    }
    if (password === "") {
      setPasswordError(t("Cannot be empty Password") as string);
    }
    if (confirmPassword === "") {
      setConfirmPasswordError(t("Cannot be empty Confirm Password") as string);
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError(t("passwords not identical") as string);
    }
    if (
      pseudo === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === "" ||
      password !== confirmPassword
    ) {
      return true;
    }
    return false;
  };



  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const err = checkErrors();
    if (err) return;
    console.log(i18n.language);


    const data: UserRegister = { pseudo, email, password };
    const res = await register(data);
    if (res.error) {
      setEmailError((i18n.language === "Francais") ? res.emailFr  : res.emailEn);
      setPseudoError((i18n.language === "Francais") ? res.pseudoFr : res.pseudoEn);
      setPasswordError((i18n.language === "Francais") ? res.passwordFr : res.passwordEn);
      return ; 
    }
    toast.promise(
      async () => {
        setTimeout(() => setShouldRegister(false), 1000);
        return;
      },
      {
        pending: { render: t("Loading"), position: "top-center" },
        success: {
          render: t("Toast Register Success"),
          position: "top-center",
        },
        error: { render: t("Error"), position: "top-center" },
      });

  };

  return (
    <>
      <ToastContainer />
      <div className={styles.wrapper}>
        <form className={styles.container} onSubmit={handleRegister}>
          <h1>SABOTEUR</h1>
          <div className={styles.inputContainer}>
            <label htmlFor="pseudo">Pseudo</label>
            <input
              type="text"
              placeholder="Pseudo..."
              onChange={(e) => {
                setPseudo(e.target.value);
                setPseudoError("");
              }}
            />
            <label htmlFor="pseudo">{pseudoError}</label>
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              placeholder="E-mail..."
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
              }}
            />
            <label htmlFor="email">{emailError}</label>
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="password">{t("Password")}</label>
            <input
              type="password"
              placeholder={t("Password") as string}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
              }}
            />
            <label htmlFor="password">{passwordError}</label>
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="cpassword">{t("Confirm Password")}</label>
            <input
              type="password"
              placeholder={t("Confirm Password") as string}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setConfirmPasswordError("");
              }}
            />
            <label htmlFor="confirmPassword">{confirmPasswordError}</label>
          </div>
          <span>
            {t("Already User")}
            <span
              className={styles.linkToRegister}
              onClick={() => setShouldRegister(false)}
            >
              {t("Login")}
            </span>
          </span>
          <button type="submit">{t("Register")}</button>
        </form>
      </div>
    </>
  );
};

export default Register;
