import { UserProvider } from "@/context/UserProvider";
import React, { Suspense } from "react";
import styles from "../../css/layout.module.css";
import Result from "@/Components/SchoolAdminDashBoard/Pages/Result";

const ResultPage = () => {
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
        <Result />
      </Suspense>
    </UserProvider>
  );
};

export default ResultPage;
