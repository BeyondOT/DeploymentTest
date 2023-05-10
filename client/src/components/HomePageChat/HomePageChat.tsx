import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from "react";
import { AiOutlineCloseCircle, AiOutlineSend } from "react-icons/ai";
import { BsChatLeftDots } from "react-icons/bs";
import styles from "./HomePageChat.module.scss";
import { useTranslation } from "react-i18next";

interface MessageInterface {
  avatar: string;
  username: string;
  text: string;
}
interface ChatProps {
    OpenChat: boolean;
    toggleOpen : Dispatch<SetStateAction<boolean>>;
}


const messagesArray: MessageInterface[] = [
  {
    avatar: "./images/avatar.png",
    username: "Romain",
    text: "ceci est un message pour tester. Vous pouvez écrire vous aussi !",
  },
];

const HomePageChat : FC<ChatProps> = ({toggleOpen,OpenChat}) => {
  const [messages, setMessages] = useState<MessageInterface[]>(messagesArray);
  const [text, setText] = useState("");
  const scrollDiv = useRef<HTMLDivElement>(null);
  const {t}=useTranslation(['home']);

  // Handle the chat opening and closing
  const handleChat = () => {
    toggleOpen(!OpenChat);
  };

  // Scroll to the newest message recieved
  useEffect(() => {
    if (scrollDiv.current) {
      scrollDiv.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  // Handle sending a message
  const handleSubmit = () => {
    const newMessage = {
      avatar: "./images/avatar.png",
      username: "test",
      text,
    };
    const newMessages: MessageInterface[] = messages.concat(newMessage);
    setMessages(newMessages);
    setText("");
  };

  // Here we render the messages from the messages array
  const renderMessages = () => (
    <>
      {messages.map((message, index) => (
        <div className={styles.messagesWrapper} key={index}>
          <div className={styles.left}>
            <img src={message.avatar} alt="userAvatar" className={styles.avatar} />
          </div>
          <div className={styles.right}>
            <span>{message.username}</span>
            <p>{message.text}</p>
          </div>
        </div>
      ))}
    </>
  );

  // Here we define the class of the container depending on its state
  const containerClassNames = `${styles.container} ${OpenChat ? styles.open : styles.close}`;

  const chatClassNames = `${styles.chat} ${OpenChat ? styles.chatOpen : styles.chatClosed}`;

  return (
    <div className={styles.wrapper}>
      <div onClick={handleChat} className={chatClassNames}>
        <BsChatLeftDots size="32px" />
      </div>

      <div className={containerClassNames}>
        <div className={styles.closeContainer}>
          <AiOutlineCloseCircle onClick={handleChat} color="black" />
        </div>
        <div className={styles.messagesContainer}>
          {renderMessages()}
          <div ref={scrollDiv}></div>
        </div>
        <div className={styles.inputMessageContainer}>
          <input
            type="text"
            placeholder={t('Enter Text') as string}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
            value={text}
          />

          <div className={styles.send} onClick={handleSubmit}>
            <AiOutlineSend size="16px" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePageChat;
