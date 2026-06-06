"use client";
import { useState } from "react";
import Link from "next/link";
import { IoChevronBackSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import LeftAuth from "@/Components/LeftAuth";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }

    try {
      const result = await authService.forgotPassword(email);
      
      if (result.success) {
        setSubmitted(true);
        toast.success(result.message);
      } else {
        setError(result.message || "Failed to send reset link");
        toast.error(result.message || "Failed to send reset link");
      }
    } catch (err) {
      console.error("Forgot password failed", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
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
              <div className="w-[300px] text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
                  <p className="text-gray-600 text-sm mb-4">
                    We've sent a password reset link to <strong>{email}</strong>
                  </p>
                  <p className="text-gray-500 text-xs">
                    Didn't receive the email? Check your spam folder or{' '}
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-[#F47458] hover:underline"
                    >
                      try again
                    </button>
                  </p>
                </div>
                <button
                  onClick={() => router.push("/")}
                  className="w-full bg-[#01427a] text-white rounded px-4 py-2 text-sm font-bold hover:bg-[#01427a]/80 transition-colors"
                >
                  Back to Login
                </button>
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
          <div className="w-full space-y-4 p-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Check Your Email</h2>
            <p className="text-gray-600">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-gray-500 text-sm">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                onClick={() => setSubmitted(false)}
                className="text-[#F47458] hover:underline"
              >
                try again
              </button>
            </p>
            <button
              onClick={() => router.push("/")}
              className="w-full bg-[#01427a] text-white rounded px-4 py-2 text-sm font-bold hover:bg-[#01427a]/80 transition-colors mt-4"
            >
              Back to Login
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
              <h1 className="text-[45px] font-bold mb-4">Forgot Password</h1>
              <p className="text-sm text-gray-600 mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col mb-4">
                  <label className="text-sm font-bold" htmlFor="Email">
                    Email Address
                  </label>
                  <input
                    className="bg-[#f0eeed] rounded mt-1 px-4 py-2 text-xs placeholder:text-[rgba(0,0,0,0.2)]"
                    type="email"
                    value={email}
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
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
                    {loading ? "Sending..." : "SEND RESET LINK"}
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
          <h1 className="text-2xl font-bold text-center">Forgot Password?</h1>
          <p className="text-md text-center text-gray-400 px-6">
            Enter your email to receive a reset link
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4 p-6">
          <div>
            <label className="block text-sm font-bold mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full bg-[#f0eeed] rounded px-4 py-2 text-sm placeholder:text-[rgba(0,0,0,0.2)]"
            />
            {error && (
              <p className="text-[#f2645c] text-xs font-bold mt-1">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#01427a] text-white rounded px-4 py-2 text-sm font-bold hover:bg-[#01427a]/80 transition-colors disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
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