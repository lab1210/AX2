import { UserProvider } from "@/app/Components/StudentDashBoard/context/UserProvider";
import React, { Suspense } from "react";
import styles from "../css/spinner.module.css";
import ChatItem from "@/app/Components/SuperAdminDashboard/Pages/ChatItem";

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
