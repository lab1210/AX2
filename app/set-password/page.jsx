"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import LeftAuth from "../login/Components/LeftAuth";
import { PiEyeLight } from "react-icons/pi";
import { IoEyeOffOutline, IoChevronBackSharp } from "react-icons/io5";
import authService from "@/services/authService";
import toast from "react-hot-toast";

function SetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    // Get token and userId from URL (sent via email when admin creates user)
    const urlToken = searchParams.get("token");
    const urlUserId = searchParams.get("userId");
    
    if (urlUserId && urlToken) {
      setUserId(urlUserId);
      setToken(urlToken);
    } else {
      setError("Invalid password setup link. Please contact your administrator.");
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const result = await authService.setPassword(userId, token, password, confirmPassword);
      
      if (result.success) {
        toast.success("Password set successfully! You can now log in.");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setError(result.message || "Failed to set password. The link may have expired.");
      }
    } catch (err) {
      console.error("Set password failed", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Desktop View */}
      <div className="hidden lg:flex w-full h-auto bg-[rgba(217,217,217,0.4)]">
        <LeftAuth />
        <div className="flex flex-col items-center justify-center w-full md:w-[55%] lg:w-1/2 bg-white">
          <div className="shadow-[0px_4px_10px_4px_rgba(0,0,0,0.15)] rounded-lg px-4 py-4 md:p-4 lg:px-[60px] lg:pb-[30px]">
            <div className="w-[80px] h-[129px] md:w-[220px]">
              <img src="/MySchoolLight.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="w-[300px]">
              <h1 className="text-[45px] font-bold mb-4">Set Your Password</h1>
              <p className="text-sm text-gray-600 mb-6">
                Please set your password to activate your account.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col mb-4">
                  <label className="text-sm font-bold">New Password</label>
                  <div className="relative">
                    <input
                      className="bg-[#f0eeed] rounded mt-1 px-4 py-2 text-xs w-full"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3"
                    >
                      {showPassword ? <PiEyeLight className="w-5 h-5" /> : <IoEyeOffOutline className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col mb-4">
                  <label className="text-sm font-bold">Confirm Password</label>
                  <div className="relative">
                    <input
                      className="bg-[#f0eeed] rounded mt-1 px-4 py-2 text-xs w-full"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3"
                    >
                      {showConfirmPassword ? <PiEyeLight className="w-5 h-5" /> : <IoEyeOffOutline className="w-5 h-5" />}
                    </button>
                  </div>
                  {error && <p className="text-[#f2645c] text-xs font-bold mt-1">{error}</p>}
                </div>
                <div className="mt-6 mb-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#01427a] text-white rounded px-4 py-2 text-sm font-bold hover:bg-[#01427a]/80 disabled:opacity-50"
                  >
                    {loading ? "Setting Password..." : "SET PASSWORD"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden flex flex-col items-center w-full bg-white space-y-6">
        <div className="flex items-center justify-center bg-[#01427A] rounded-b-[45%] h-96 p-4">
          <button onClick={() => router.back()} className="self-start mb-4">
            <IoChevronBackSharp className="w-6 h-6 text-white" />
          </button>
          <div className="items-center justify-center">
            <h2 className="text-center text-white font-bold text-2xl">Set Password</h2>
            <img src="/loginimage.svg" alt="Logo" className="z-10 flex items-center" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-center">Set Your Password</h1>
          <p className="text-md text-center text-gray-400 px-6">
            Please set your password to activate your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4 p-6">
          <div>
            <label className="block text-sm font-bold mb-1">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className="w-full bg-[#f0eeed] rounded px-4 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? <PiEyeLight className="w-5 h-5" /> : <IoEyeOffOutline className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                className="w-full bg-[#f0eeed] rounded px-4 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showConfirmPassword ? <PiEyeLight className="w-5 h-5" /> : <IoEyeOffOutline className="w-5 h-5" />}
              </button>
            </div>
            {error && <p className="text-[#f2645c] text-xs font-bold mt-1">{error}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#01427a] text-white rounded px-4 py-2 text-sm font-bold hover:bg-[#01427a]/80 disabled:opacity-50"
          >
            {loading ? "Setting Password..." : "Set Password"}
          </button>
        </form>
      </div>
    </>
  );
}

export default function SetPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SetPasswordForm />
    </Suspense>
  );
}