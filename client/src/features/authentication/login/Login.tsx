import { Dispatch, FC, SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { signIn } from "../../../stores/auth.slice";
import { useBoundStore } from "../../../stores/store";
import { IUserLoginResponse, UserLogin } from "../auth.types";
import styles from "./login.module.scss";

interface ILoginProps {
  setShouldRegister: Dispatch<SetStateAction<boolean>>;
}

const Login: FC<ILoginProps> = ({ setShouldRegister }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const getUser = useBoundStore((state) => state.getUser);
  const { t, i18n } = useTranslation(["home"]);

  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);

  const checkErrors = () => {
    if (email === "") {
      setEmailError("Veuillez saisir votre e-mail.");
    }
    if (password === "") {
      setPasswordError("Veuillez remplir ce champ.");
    }
    if (email === "" || password === "") {
      return true;
    }
    return false;
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const err = checkErrors();
    if (err) return;

    const data: UserLogin = { email, password };

    toast.promise(
      async () => {
        try {
          // try to sign
          const tk = await signIn(data);

          // if on electron
          if (window.api) {
            const test = await window.api.setToken(tk);
            console.log(test);
          } else {
            setCookie("jwt", tk);
          }

          setTimeout(() => navigate("/homepage"), 1000);

          return;
        } catch (error) {
          const err: IUserLoginResponse = error as IUserLoginResponse;
          setEmailError(i18n.language === "Francais" ? err.emailFr : err.emailEn);
          setPasswordError(
            i18n.language === "Francais" ? err.passwordFr : err.passwordEn
          );
          throw console.log(err.message);
        }
      },
      {
        pending: { render: t("Loading"), position: "top-center" },
        success: {
          render: t("Toast Login Success"),
          position: "top-center",
          autoClose: 1500,
        },
        error: { render: t("Error"), position: "top-center" },
      }
    );
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.container} onSubmit={handleLogin}>
        <h1>SABOTEUR</h1>
        <div className={styles.inputContainer}>
          <label htmlFor="email">{t("Email")}</label>
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
        <span>
          {t("New Here")}{" "}
          <span className={styles.linkToRegister} onClick={() => setShouldRegister(true)}>
            {t("Sign Up")}
          </span>
        </span>
        <button type="submit">{t("Login")}</button>
      </form>
    </div>
  );
};
export default Login;
