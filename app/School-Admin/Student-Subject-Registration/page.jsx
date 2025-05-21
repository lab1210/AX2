import { UserProvider } from "@/context/UserProvider";
import React, { Suspense } from "react";
import styles from "../../css/layout.module.css";
import SubjectReg from "@/Components/SchoolAdminDashBoard/Pages/SubjectReg";

const SubjectControl = () => {
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
        <SubjectReg />
      </Suspense>
    </UserProvider>
  );
};

export default SubjectControl;
