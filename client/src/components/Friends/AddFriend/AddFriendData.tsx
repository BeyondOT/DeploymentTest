import { IUser, ResponseError } from "@shared/api";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useBoundStore } from "../../../stores/store";
import { AddFriends } from "../../../stores/user.slice";
import styles from "./AddFriend.module.scss";

const AddFriendData = ({ searchValue }: { searchValue: string }) => {
  const [fetchedUsers, setFetchedUsers] = useState<IUser[]>([]);
  const [userNow, setUserNow] = useState<IUser>(); // define userNow as a state variable
  const getFriends = useBoundStore((state) => state.getFriends);
  const getAllUsers = useBoundStore((state) => state.getAllUsers);
  const allUsers = useBoundStore((state) => state.usersData);
  const currentUser = useBoundStore((state) => state.userData);
  const getUser = useBoundStore((state) => state.getUser);
  const token = useBoundStore((state) => state.token);
  const { t } = useTranslation(["home"]);

  const AddFriendsData = async () => {
    setUserNow(currentUser!);
    setFetchedUsers(allUsers);
  };
  useEffect(() => {
    AddFriendsData();
  }, []);

  const handleAddButtonClick = async (user: IUser) => {
    toast.promise(
      async () => {
        try {
          await AddFriends(user, userNow!);
          getFriends();
        } catch (error) {
          const err: ResponseError = error as ResponseError;
          throw console.log(err.message);
        }
      },
      {
        pending: { render: "Loading...", position: "top-center" },
        success: {
          render: " Friend Added succesfully",
          position: "top-center",
        },
        error: { render: "There was an error.", position: "top-center" },
      }
    );
  };

  const filteredUsers = searchValue
    ? fetchedUsers
        .filter(
          (user) => user.pseudo.toLowerCase().includes(searchValue.toLowerCase()) // filter search by pseudo
        )
        .filter((user) => user.pseudo !== userNow!.pseudo) // exclude own user data
    : [];

  return (
    <>
      <ul className={styles.results}>
        {filteredUsers.map((user) => (
          <li key={user._id}>
            <span>{user.pseudo}</span>
            <button onClick={() => handleAddButtonClick(user)}>{t("Add")}</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default AddFriendData;
