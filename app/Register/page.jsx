"use client";
import { useState } from "react";
import styles from "../css/StudentAuth.module.css";
import Link from "next/link";
import { PiEyeLight } from "react-icons/pi";
import { IoEyeOffOutline } from "react-icons/io5";
import dummy from "../Components/dummy";
import LeftAuth from "@/app/Components/LeftAuth";
import Modal from "react-modal";
import custommodal from "../Components/modal";
import Get_token from "../Components/get-token";

Modal.setAppElement(".app");
const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [schoolid, setSchoolid] = useState("");
  const [Pin, setPin] = useState("");
  const [schooliderror, setSchooliderror] = useState("");
  const [pinerror, setPinerror] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [token, setToken] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  //Handle Form Submission

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSchooliderror("");
    setPinerror("");

    let valid = true;
    if (!schoolid) {
      setSchooliderror("School ID is required");
      valid = false;
    }

    if (!Pin) {
      setPinerror("Pin is required");
      valid = false;
    }

    if (!valid) {
      return;
    }
    // try {
    //   const response = await fetch("/api/login", {
    //     method: "POST",
    //     headers: { "content-type": "application/json" },
    //     body: JSON.stringify({ schoolid, Pin }),
    //   });
    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     if (errorData.error === "School ID does not exist") {
    //       setSchooliderror(errorData.message);
    //     } else if (errorData.error === "Invalid Pin or used OTP") {
    //       setPinerror(errorData.message);
    //     } else {
    //       throw new Error("Something went wrong");
    //     }
    //   } else {
    //     const data = await response.json();
    //     // Handle successful registration
    //     console.log("Registration successful", data);
    //     // Use Next.js router to navigate
    //     router.push("/Register/get-token");
    //   }
    // } catch (error) {
    //   setPinerror(error.message);
    //   setSchooliderror(error.message);
    // }

    const schoolIdExists = dummy.some(
      (user) => user.schoolid.toUpperCase() === schoolid.toUpperCase()
    );

    if (schoolIdExists) {
      setSchooliderror("School ID already Registered..");
      return;
    }
    const newUser = {
      schoolid,
      Pin,
    };
    console.log("Registration data to be sent to server:", newUser); // For demonstration
    console.log("Registration Successful (Dummy Data):", newUser); // For demonstration
    localStorage.setItem("user", JSON.stringify(newUser));

    // Generate or fetch the token here (dummy for now)
    const generatedToken = "6583-0251-4789-3560"; // Replace with your token generation logic
    setToken(generatedToken); // Set the token in state

    openModal();

    setSchoolid("");
    setPin("");
  };

  return (
    <div className={styles.Student_Auth_Container}>
      <div
        className={`${styles.overlay} ${
          isModalOpen ? styles.overlayActive : ""
        }`}
      ></div>
      <LeftAuth className={`${isModalOpen ? styles.opacity : ""}`} />
      <div
        className={`${styles.Student_Right_Auth} ${
          isModalOpen ? styles.opacity : ""
        }`}
      >
        <div className={styles.Reg_box2}>
          <div className={styles.login_form}>
            <div className={styles.Regtitle2}>
              <h1>Register Now</h1>
              <p>Kindly provide the requested information to register.</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className={styles.Login_input}>
                <label htmlFor="SchoolID">School ID</label>
                <input
                  className={styles.username}
                  type="text"
                  value={schoolid}
                  placeholder="Enter School ID"
                  onChange={(e) => setSchoolid(e.target.value)}
                  required
                />
                {schooliderror && (
                  <p className={styles.error}>{schooliderror}</p>
                )}
              </div>

              <div className={styles.Login_input}>
                <div className={styles.pswd}>
                  <label htmlFor="Pin">PIN</label>
                </div>
                <div className={styles.toggle}>
                  <input
                    className={styles.username}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Pin"
                    value={Pin}
                    onChange={(e) => setPin(e.target.value)}
                    required
                  />
                  {showPassword ? (
                    <PiEyeLight
                      className={styles.eye}
                      size={20}
                      onClick={togglePasswordVisibility}
                    />
                  ) : (
                    <IoEyeOffOutline
                      className={styles.eye}
                      size={20}
                      onClick={togglePasswordVisibility}
                    />
                  )}
                </div>
                {pinerror && <p className={styles.error}>{pinerror}</p>}
              </div>
              <div className={styles.loginbtn}>
                <button type="submit">REGISTER</button>
              </div>
            </form>
            <p className={styles.NoAccount}>
              Already Registered?
              <Link href={"/"}>
                <span>Log In here</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={custommodal}
        contentLabel="Get Token"
      >
        <Get_token token={token} />
      </Modal>
    </div>
  );
};

export default Register;
