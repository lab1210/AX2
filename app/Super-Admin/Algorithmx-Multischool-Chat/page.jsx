import { UserProvider } from "../../context/UserProvider";
import React, { Suspense } from "react";
import styles from "../css/spinner.module.css";
import ChatItem from "../../Components/SuperAdminDashboard/Pages/ChatItem";

const ChatPage = () => {
  return (
    <UserProvider>
      <Suspense
        fallback={
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
          </div>
        }
      >
        <ChatItem />
      </Suspense>
    </UserProvider>
  );
};

export default ChatPage;
