import { UserProvider } from "../../../context/UserProvider";
import React, { Suspense } from "react";
import styles from "../../../css/layout.module.css";
import ReceiptItem from "../../../Components/StudentDashBoard/Pages/Receipt";

const Receipt = () => {
  return (
    <UserProvider>
      <Suspense
        fallback={
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div> {/* New: Spinner element */}
          </div>
        }
      >
        <ReceiptItem />
      </Suspense>
    </UserProvider>
  );
};

export default Receipt;
