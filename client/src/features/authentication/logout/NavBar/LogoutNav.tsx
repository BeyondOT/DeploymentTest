import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import { useBoundStore } from "../../../../stores/store";
import styles from "./LogoutNav.module.scss";

const LogoutNav = () => {
  const { logout } = useBoundStore();
  const navigate = useNavigate();
  const { t } = useTranslation(["home"]);

  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);

  const handleLogout = () => {
    toast.promise(
      async () => {
        try {
          if (window.api) {
            const test = await window.api.setToken("");
            console.log(test);
          } else {
            removeCookie("jwt");
          }
          setTimeout(() => navigate("/signup"), 1500);
          return;
        } catch (error) {
          throw console.log(error);
        }
      },
      {
        pending: { render: t("Loading"), position: "top-center" },
        success: {
          render: t("Toast Logout Success"),
          position: "top-center",
          autoClose: 1500,
        },
        error: { render: t("Error"), position: "top-center" },
      }
    );
  };
  return (
    <>
      <ToastContainer />
      <div className={styles.container} onClick={handleLogout}>
        <ul className={styles.menu}>
          <li>
            <a href="#">{t("Log out")}</a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default LogoutNav;
