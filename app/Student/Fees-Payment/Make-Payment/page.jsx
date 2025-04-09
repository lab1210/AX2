import { UserProvider } from "@/app/Components/StudentDashBoard/context/UserProvider";
import React, { Suspense } from "react";
import styles from "../../../css/layout.module.css";
import MakePaymentItem from "@/app/Components/StudentDashBoard/Pages/MakePayment";

const MakePayment = () => {
  return (
    <UserProvider>
      <Suspense
        fallback={
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div> {/* New: Spinner element */}
          </div>
        }
      >
        <MakePaymentItem />
      </Suspense>
    </UserProvider>
  );
};

export default MakePayment;
