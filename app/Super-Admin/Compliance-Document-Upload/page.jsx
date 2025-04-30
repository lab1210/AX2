import { UserProvider } from "../../context/UserProvider";
import React, { Suspense } from "react";
import styles from "../css/spinner.module.css";
import ComplianceDocumentUploadItem from "../../Components/SuperAdminDashboard/Pages/ComplianceDocumentUploadItem";

const ComplianceDocUpload = () => {
  return (
    <UserProvider>
      <Suspense
        fallback={
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
          </div>
        }
      >
        <ComplianceDocumentUploadItem />
      </Suspense>
    </UserProvider>
  );
};

export default ComplianceDocUpload;
