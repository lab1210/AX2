"use client";
import React from "react";
import { useRouter } from "next/navigation";
import styles from "../../css/StudentAuth.module.css";
import LeftAuth from "@/app/Components/LeftAuth";

const RegisterRole = () => {
  const router = useRouter();

  const handleRoleSelection = (role) => {
    localStorage.setItem("userRole", role);
    setTimeout(() => {
      router.push(`/Register/${role.toLowerCase()}/Registration-Form`);
    }, 500);
  };

  return (
    <div className={styles.Student_Auth_Container}>
      <LeftAuth />
      <div className={styles.Student_Right_Auth}>
        <div className={styles.Reg_box}>
          <div className={styles.Regtitle}>
            <h1>Register As</h1>
            <p>Select your role to continue the registration process</p>
          </div>
          <div className={styles.rolebtn}>
            <button
              onClick={() => handleRoleSelection("Teacher")}
              className={styles.teacher}
            >
              Teacher
            </button>
            <button
              onClick={() => handleRoleSelection("Student")}
              className={styles.student}
            >
              Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterRole;
