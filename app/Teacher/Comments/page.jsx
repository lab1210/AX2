"use client";
import React, { Suspense } from "react";
import styles from "../../css/layout.module.css";
import { UserProvider } from "../../context/UserProvider";
import Comment from "../../Components/TeacherDashBoard/Pages/TeacherComment";

const CommentPage = () => {
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
        <Comment />
      </Suspense>
    </UserProvider>
  );
};

export default CommentPage;
