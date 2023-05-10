import React from "react";
import { useNavigate, useRouteLoaderData } from "react-router-dom";

type Props = {
  children: JSX.Element;
};

const Unprotected: React.FC<Props> = ({ children }) => {
  const token = useRouteLoaderData("root") as string;
  const navigate = useNavigate();

  return children;
};

export default Unprotected;
