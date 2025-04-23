"use client";
import { useState } from "react";
import LeftAuth from "./Components/LeftAuth";
import Link from "next/link";
import { PiEyeLight } from "react-icons/pi";
import { IoEyeOffOutline, IoChevronBackSharp } from "react-icons/io5";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <>
      {/* ─── desktop view ──────*/}
      <div className="hidden lg:flex w-full h-auto bg-[rgba(217,217,217,0.4)]">
        <LeftAuth />
        <div className="flex flex-col items-center justify-center w-full md:w-[55%] lg:w-1/2 bg-white">
          <div className="shadow-[0px_4px_10px_4px_rgba(0,0,0,0.15)] rounded-lg px-4 py-4 md:p-4 lg:px-[60px] lg:pb-[30px]">
            <div className="w-[80px] h-[129px] md:w-[220px]">
              <img
                src="/MySchoolLight.png"
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="w-[300px]">
              <h1 className="text-[45px] font-bold mb-4">Log in</h1>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col mb-4">
                  <label className="text-sm font-bold" htmlFor="Username">
                    Username
                  </label>
                  <input
                    className="bg-[#f0eeed] rounded mt-1 px-4 py-2 text-xs placeholder:text-[rgba(0,0,0,0.2)]"
                    type="text"
                    value={username}
                    placeholder="Enter Username"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col mb-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold" htmlFor="Password">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      className="bg-[#f0eeed] rounded mt-1 px-4 py-2 text-xs w-full placeholder:text-[rgba(0,0,0,0.2)]"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-3 md:top-4"
                    >
                      {showPassword ? (
                        <PiEyeLight className="w-5 h-5" />
                      ) : (
                        <IoEyeOffOutline className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {error && (
                    <p className="text-[#f2645c] text-xs font-bold mt-1">
                      {error}
                    </p>
                  )}
                </div>
                <div className="mt-6 mb-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#01427a] text-white rounded px-4 py-2 text-sm font-bold hover:bg-[#01427a]/80 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Logging in..." : "LOG IN"}
                  </button>
                </div>
              </form>
              <p className="text-xs text-black/20 font-bold text-center">
                Don't have an account?{" "}
                <Link
                  href="/Register"
                  className="text-[#f47458] hover:underline"
                >
                  Register now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── mobile & tablet view ───────────────────────────── */}
      <div className="lg:hidden flex flex-col items-center w-full bg-white space-y-6">
        <div className="flex items-center justify-center bg-[#01427A] rounded-b-[45%] h-96 p-4">
          <button onClick={() => router.back()} className="self-start mb-4">
            <IoChevronBackSharp className="w-6 h-6 text-white " />
          </button>
          <div className="items-center justify-center">
            <h2 className="text-center text-white font-bold text-2xl">
              {" "}
              Welcome{" "}
            </h2>
            <img
              src="/loginimage.svg"
              alt="Logo"
              className="z-10 flex items-center"
            />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-center">Get Started</h1>
          <p className="text-md text-center text-gray-400">
            Log into your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4 p-6">
          <div>
            <label className="block text-sm font-bold mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Username"
              required
              className="w-full bg-[#f0eeed] rounded px-4 py-2 text-sm placeholder:text-[rgba(0,0,0,0.2)]"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                required
                className="w-full bg-[#f0eeed] rounded px-4 py-2 text-sm placeholder:text-[rgba(0,0,0,0.2)]"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <PiEyeLight className="w-5 h-5" />
                ) : (
                  <IoEyeOffOutline className="w-5 h-5" />
                )}
              </button>
            </div>
            {error && (
              <p className="text-[#f2645c] text-xs font-bold mt-1">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#01427a] text-white rounded px-4 py-2 text-sm font-bold hover:bg-[#01427a]/80 transition-colors disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
          <div className="flex flex-row gap-1">
            <p className="text-left text-xs text-black md:text-sm">
              Don’t have an account?{" "}
            </p>
            <p className="text-[#01427a] text-xs md:text-sm">
              <Link href="/Register">Register now</Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}
