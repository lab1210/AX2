"use client";
import { UserProvider } from "../../context/UserProvider";
import React, { Suspense } from "react";
import styles from "../../css/layout.module.css";
import ProfilePage from "../../Components/StudentDashBoard/Pages/Profile";

const Profile = () => {
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
        <ProfilePage />
      </Suspense>
    </UserProvider>
  );
};

export default Profile;
