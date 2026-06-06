"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PiEyeLight } from "react-icons/pi";
import { IoEyeOffOutline, IoChevronBackSharp } from "react-icons/io5";
import toast from "react-hot-toast";
import LeftAuth from "@/Components/LeftAuth";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    // Get token and email from URL (sent via email from forgot-password)
    const urlToken = searchParams.get("token");
    const urlEmail = searchParams.get("email");
    
    if (urlEmail && urlToken) {
      setEmail(urlEmail);
      setToken(urlToken);
    } else {
      setError("Invalid password reset link. Please request a new one.");
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
      const result = await authService.resetPassword(email, token, password);
      
      if (result.success) {
        toast.success("Password reset successfully! You can now log in.");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setError(result.message || "Failed to reset password. The link may have expired.");
      }
    } catch (err) {
      console.error("Reset password failed", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show error if no email/token in URL
  if (error && !email && !token) {
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
              <div className="w-[300px] text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Invalid Reset Link</h2>
                <p className="text-gray-600 text-sm mb-4">{error}</p>
                <button
                  onClick={() => router.push("/forgot-password")}
                  className="w-full bg-[#01427a] text-white rounded px-4 py-2 text-sm font-bold hover:bg-[#01427a]/80 transition-colors"
                >
                  Request New Link
                </button>
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
              <h2 className="text-center text-white font-bold text-2xl">Error</h2>
              <img src="/loginimage.svg" alt="Logo" className="z-10 flex items-center" />
            </div>
          </div>
          <div className="w-full space-y-4 p-6 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Invalid Reset Link</h2>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => router.push("/forgot-password")}
              className="w-full bg-[#01427a] text-white rounded px-4 py-2 text-sm font-bold hover:bg-[#01427a]/80 transition-colors mt-4"
            >
              Request New Link
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Desktop View */}
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
              <h1 className="text-[45px] font-bold mb-4">Reset Password</h1>
              <p className="text-sm text-gray-600 mb-6">
                Enter your new password below.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col mb-4">
                  <label className="text-sm font-bold" htmlFor="Password">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      className="bg-[#f0eeed] rounded mt-1 px-4 py-2 text-xs w-full placeholder:text-[rgba(0,0,0,0.2)]"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 md:top-4"
                    >
                      {showPassword ? (
                        <PiEyeLight className="w-5 h-5" />
                      ) : (
                        <IoEyeOffOutline className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col mb-4">
                  <label className="text-sm font-bold" htmlFor="ConfirmPassword">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      className="bg-[#f0eeed] rounded mt-1 px-4 py-2 text-xs w-full placeholder:text-[rgba(0,0,0,0.2)]"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 md:top-4"
                    >
                      {showConfirmPassword ? (
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
                    {loading ? "Resetting..." : "RESET PASSWORD"}
                  </button>
                </div>
              </form>
              <p className="text-xs text-black/20 font-bold text-center">
                Remember your password?{" "}
                <span
                  onClick={() => router.push("/")}
                  className="text-[#F47458] cursor-pointer hover:underline"
                >
                  Back to Login
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet View */}
      <div className="lg:hidden flex flex-col items-center w-full bg-white space-y-6">
        <div className="flex items-center justify-center bg-[#01427A] rounded-b-[45%] h-96 p-4">
          <button onClick={() => router.back()} className="self-start mb-4">
            <IoChevronBackSharp className="w-6 h-6 text-white" />
          </button>
          <div className="items-center justify-center">
            <h2 className="text-center text-white font-bold text-2xl">Reset Password</h2>
            <img src="/loginimage.svg" alt="Logo" className="z-10 flex items-center" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-center">Create New Password</h1>
          <p className="text-md text-center text-gray-400 px-6">
            Enter your new password below
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
                className="w-full bg-[#f0eeed] rounded px-4 py-2 text-sm placeholder:text-[rgba(0,0,0,0.2)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <PiEyeLight className="w-5 h-5" />
                ) : (
                  <IoEyeOffOutline className="w-5 h-5" />
                )}
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
                className="w-full bg-[#f0eeed] rounded px-4 py-2 text-sm placeholder:text-[rgba(0,0,0,0.2)]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showConfirmPassword ? (
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
            {loading ? "Resetting..." : "Reset Password"}
          </button>
          
          <div className="text-center">
            <Link href="/" className="text-xs text-[#01427a] hover:underline">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}