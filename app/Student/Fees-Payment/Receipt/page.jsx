import { UserProvider } from "@/app/Components/StudentDashBoard/context/UserProvider";
import React, { Suspense } from "react";
import styles from "../../../css/layout.module.css";
import ReceiptItem from "@/app/Components/StudentDashBoard/Pages/Receipt";

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
