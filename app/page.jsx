"use client";
import { useState } from "react";
import LeftAuth from "./Components/LeftAuth";
import styles from "./css/StudentAuth.module.css";
import Link from "next/link";
import { PiEyeLight } from "react-icons/pi";
import { IoEyeOffOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { getUserDetails, Login as LoginService } from "./Service/AuthService";
export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit function CALLED");
    setError("");
    setLoading(true);

    if (!username || !password) {
      setError("Please enter both username and password");
      setLoading(false);
      return;
    }
    try {
      await LoginService(username, password);
      const { roles, teacher, student, super_admin, school_admin } =
        getUserDetails();

      const roleName = roles[0]?.role?.name;
      console.log("Logged in as:", roleName);

      switch (roleName) {
        case "Teacher":
          router.push(`/Teacher/DashBoard/?teacherID=${teacher?.teacher_id}`);
          break;
        case "Student":
          router.push(`/Student/DashBoard/?studentId=${student?.student_id}`);
          break;
        case "Super Admin":
          router.push(`/Super-Admin/DashBoard?adminId=${super_admin?.id}`);
          break;
        case "School Admin":
          router.push(
            `/School-Admin/DashBoard?schooladminId=${school_admin?.schooladmin_id}`
          );
          break;
        default:
          console.warn("Unknown user role", roleName);
          router.push("/");
      }
    } catch (err) {
      console.error("Login failed", err);
      setError("Invalid username or password");
    } finally {
      setLoading(false);
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
                <button type="submit" disabled={loading}>
                  {loading ? "Logging in..." : "LOG IN"}
                </button>
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
