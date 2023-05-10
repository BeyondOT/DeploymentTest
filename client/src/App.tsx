import { motion } from "framer-motion";
import { useEffect } from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Protected from "./components/Routes/Protected";
import RootContainer from "./components/Routes/RootContainer";
import Unprotected from "./components/Routes/Unprotected";
import CreateParty from "./pages/CreateParty/CreateParty";
import Credits from "./pages/CreditsPage/Credits";
import GameHomePage from "./pages/GameHomePage/GameHomePage";
import GameInterface from "./pages/GameInterface/GameInterface";
import SignupPage from "./pages/HomePage/SignupPage";
import "./sass/main.scss";
import { useBoundStore } from "./stores/store";

const App = () => {
  const connect = useBoundStore((state) => state.connect);
  const socket = useBoundStore((state) => state.socket);
  const disconnect = useBoundStore((state) => state.disconnect);

  const router2 = createHashRouter([
    {
      element: <RootContainer />,
      id: "root",
      children: [
        {
          path: "/",
          element: (
            <Protected>
              <GameHomePage />
            </Protected>
          ),
        },
        {
          path: "/signup",

          element: (
            <Unprotected>
              <SignupPage />
            </Unprotected>
          ),
        },
        {
          path: "/game",
          element: (
            <Protected>
              <GameInterface />
            </Protected>
          ),
        },
        {
          path: "/createParty",
          element: (
            <Protected>
              <CreateParty />
            </Protected>
          ),
        },
        {
          path: "/Credits",
          element: (
            <Protected>
              <Credits
                credits={[
                  "Director: John Smith",
                  "Producer: Jane Doe",
                  "Lead Actor: Tom Hanks",
                  "Director: John Smith",
                  "Producer: Jane Doe",
                  "Lead Actor: Tom Hanks",
                  "Director: John Smith",
                  "Producer: Jane Doe",
                  "Lead Actor: Tom Hanks",
                  "Director: John Smith",
                  "Producer: Jane Doe",
                  "Lead Actor: Tom Hanks",
                  "Director: John Smith",
                  "Producer: Jane Doe",
                  "Lead Actor: Tom Hanks",
                  "Director: John Smith",
                  "Producer: Jane Doe",
                  "Lead Actor: Tom Hanks",
                  "Director: John Smith",
                  "Producer: Jane Doe",
                  "Lead Actor: Tom Hanks",
                  "Director: John Smith",
                  "Producer: Jane Doe",
                  "Lead Actor: Tom Hanks",
                  "Director: John Smith",
                  "Producer: Jane Doe",
                  "Lead Actor: Tom Hanks",
                  "Director: John Smith",
                  "Producer: Jane Doe",
                  "Lead Actor: Tom Hanks",
                  "Director: John Smith",
                  "Producer: Jane Doe",
                  "Lead Actor: Tom Hanks",
                ]}
              />
            </Protected>
          ),
        },
        {
          path: "/homepage",
          element: (
            <Protected>
              <GameHomePage />
            </Protected>
          ),
        },
      ],
    },
  ]);

  useEffect(() => {
    if (!socket) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, []);

  return (
    <motion.div
      className="App"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <RouterProvider router={router2} />
    </motion.div>
  );
};

export default App;
