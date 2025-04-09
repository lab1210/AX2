"use client";
import { UserProvider } from "@/app/Components/StudentDashBoard/context/UserProvider";
import FeesPaymentItem from "@/app/Components/StudentDashBoard/Pages/FeesPaymentItem";
import React, { Suspense } from "react";
import styles from "../../css/layout.module.css";

const Fees_Payment = () => {
  return (
    <UserProvider>
      <Suspense
        fallback={
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div> {/* New: Spinner element */}
          </div>
        }
      >
        <FeesPaymentItem />
      </Suspense>
    </UserProvider>
  );
};

export default Fees_Payment;
