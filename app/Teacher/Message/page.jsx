"use client";
import React, { Suspense } from "react";
import styles from "../../css/layout.module.css";
import { UserProvider } from "../../context/UserProvider";
import MessagePage from "../../Components/TeacherDashBoard/Pages/MessageItem";

const MessageItem = () => {
  return (
    <UserProvider>
      <Suspense
        fallback={
          <div className={styles.loadingContainer}>
            {" "}
            <div className={styles.spinner}></div> {/* New: Spinner element */}
          </div>
        }
      >
        <MessagePage />
      </Suspense>
    </UserProvider>
  );
};

export default MessageItem;
