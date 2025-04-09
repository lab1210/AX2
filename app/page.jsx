"use client";
import { useState } from "react";
import LeftAuth from "./Components/LeftAuth";
import styles from "./css/StudentAuth.module.css";
import Link from "next/link";
import { PiEyeLight } from "react-icons/pi";
import { IoEyeOffOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { Login as LoginService } from "./Service/AuthService";
export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit function CALLED");
    setError("");

    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }
    try {
      const response = await LoginService(username, password);
      console.log("Login successful", response);

      if (response.user_roles && response.user_roles.length > 0) {
        const roleName = response.user_roles[0].role.name;
        console.log("Role Name:", roleName);
        if (roleName === "Teacher") {
          const teacherID = response.teacher?.id;
          const url = `/Teacher/DashBoard/?teacherID=${teacherID}`;
          router.push(url);
          console.log("Redirecting to:", url);
        } else if (roleName === "Student") {
          const studentId = response.student?.id;
          const url = `/Student/DashBoard/?studentId=${studentId}`;
          router.push(url);
          console.log("Redirecting to:", url);
        } else if (roleName === "Super Admin") {
          const adminId = response.super_admin?.id;
          const url = `/Super-Admin/DashBoard?adminId=${adminId}`;
          router.push(url);
          console.log("Redirecting to:", url);
        } else if (roleName === "School Admin") {
          const schooladminId = response.school_admin?.id;
          const url = `/School-Admin/DashBoard?schooladminId=${schooladminId}`;
          router.push(url);
          console.log("Redirecting to:", url);
        } else {
          console.warn("Unknown user role", roleName);
          router.push("/");
        }
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error("Login failed", err);
      setError("Invalid username or password");
    }
  };
  return (
    <div className={styles.Student_Auth_Container}>
      <LeftAuth />
      <div className={styles.Student_Right_Auth}>
        <div className={styles.login_box}>
          <div className={styles.logo}>
            <img src="/MySchoolLight.png" alt="" />
          </div>
          <div className={styles.login_form}>
            <h1>Log in</h1>
            <form onSubmit={handleSubmit}>
              <div className={styles.Login_input}>
                <label htmlFor="Username">Username</label>
                <input
                  className={styles.username}
                  type="text"
                  value={username}
                  placeholder="Enter Username"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className={styles.Login_input}>
                <div className={styles.pswd}>
                  <label htmlFor="Password">Password</label>
                </div>
                <div className={styles.toggle}>
                  <input
                    className={styles.username}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                {error && <p className={styles.error}>{error}</p>}
              </div>
              <div className={styles.loginbtn}>
                <button type="submit">LOG IN</button>
              </div>
            </form>
            <p className={styles.NoAccount}>
              Don't have an account?
              <Link href="/Register">
                <span>Register now</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
