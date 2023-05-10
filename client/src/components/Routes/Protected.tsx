import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { UserAPI } from "../../api/user.api";
import { useBoundStore } from "../../stores/store";

type Props = {
  children: JSX.Element;
};

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const Protected: React.FC<Props> = ({ children }) => {
  const [cookies] = useCookies(["jwt"]);
  const [loading, setLoading] = useState(true);

  const getUser = useBoundStore((state) => state.getUser);
  const getAllUsers = useBoundStore((state) => state.getAllUsers);
  const getFriends = useBoundStore((state) => state.getFriends);

  const navigate = useNavigate();
  useEffect(() => {
    const getToken = async () => {
      setLoading(true);
      let tk: string | null = null;
      if (window.api) {
        tk = await window.api.getToken();
      } else {
        tk = cookies.jwt;
      }

      UserAPI.defaults.headers.common["jwt"] = tk;
      console.log(UserAPI.defaults.headers.common);

      await getUser();
      await getAllUsers();
      await getFriends();
      setLoading(false);

      if (!tk) {
        navigate("/signup");
      }
    };
    getToken();
  }, []);

  if (loading) {
    return null;
  }

  return children;
};

export default Protected;
