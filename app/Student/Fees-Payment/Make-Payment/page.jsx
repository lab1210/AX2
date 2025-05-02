import { UserProvider } from "../../../context/UserProvider";

import React, { Suspense } from "react";
import styles from "../../../css/layout.module.css";
import MakePaymentItem from "../../../Components/StudentDashBoard/Pages/MakePayment";

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
