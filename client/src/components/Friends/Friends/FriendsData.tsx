import { useEffect, useState } from "react";
import { VscDebugBreakpointData } from "react-icons/vsc";
import { useBoundStore } from "../../../stores/store";
import styles from "./Friends.module.scss";

const FetchedFriendsData = () => {
  const [isConnected, setIsConnected] = useState(false);
  const userData = useBoundStore((state) => state.userData);
  const token = useBoundStore((state) => state.token);
  const friends = useBoundStore((state) => state.friends);
  const getFriends = useBoundStore((state) => state.getFriends);

  // const FriendsData = async () => {
  //   try {
  //     const user = await getUser();
  //     const res = await getFriends(user);
  //     console.log(res);
  //     setFetchedFriends(res.body);
  //   } catch (error) {
  //     const err: ResponseGetFriends = error as ResponseGetFriends;
  //     throw console.log(err.message);
  //   }
  // };

  useEffect(() => {
    getFriends();
  }, []);

  // Display "Friend" is connected or not
  const modalContainerClassNames = `${styles.ConnectionIcon} ${
    isConnected ? "" : styles.connected
  }`;

  if (!friends || friends.length === 0) {
    return null;
  }

  return (
    <>
      {friends.map((friend, index) => {
        return (
          <div className={styles.sideBartitle} key={index}>
            {friend.pseudo}
            <div className={modalContainerClassNames}>
              <VscDebugBreakpointData size={20} color="green" />
            </div>
          </div>
        );
      })}
    </>
  );
};

export default FetchedFriendsData;
