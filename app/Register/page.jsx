"use client";
import { useState } from "react";
import Link from "next/link";
import { PiEyeLight } from "react-icons/pi";
import { IoEyeOffOutline, IoChevronBackSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";
import LeftAuth from "../Components/LeftAuth";
import Modal from "react-modal";
import useModalStyles from "../Components/testModal";
import Get_token from "../Components/get-token";
import { verifyOtp } from "../Service/RegisterService";
import toast from "react-hot-toast";
Modal.setAppElement(".app");
const Register = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [schoolid, setSchoolid] = useState("");
  const [Pin, setPin] = useState("");
  const [schooliderror, setSchooliderror] = useState("");
  const [pinerror, setPinerror] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [token, setToken] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const customStyles = useModalStyles();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSchooliderror("");
    setPinerror("");

    if (!schoolid || !Pin) {
      if (!schoolid) setSchooliderror("School ID is required");
      if (!Pin) setPinerror("Pin is required");
      return;
    }

    try {
      const result = await verifyOtp(Pin, schoolid);

      // Save user and temp token
      localStorage.setItem("user", JSON.stringify({ schoolid, pin: Pin }));
      setToken(result.temp_token); // This opens the modal
      console.log(token);
      openModal();
      setSchoolid("");
      setPin("");
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || // <--- use `.error`
        error.response?.data?.detail || // keep as fallback
        error.message;

      if (errorMsg.toLowerCase().includes("school")) {
        setSchooliderror(errorMsg);
      } else if (
        errorMsg.toLowerCase().includes("otp") ||
        errorMsg.toLowerCase().includes("pin")
      ) {
        setPinerror(errorMsg);
      } else {
        toast.error("Verification failed: " + errorMsg);
      }
    }
  };

  return (
    <>
      {/* overlay */}
      <div
        className={`fixed inset-0 bg-[rgba(0,0,0,0.3)] z-[999] transition-opacity ${
          isModalOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      ></div>

      {/* ─── Desktop & Tablet-up View ─────────────────────────────── */}
      <div className="hidden lg:flex w-full h-auto bg-[rgba(217,217,217,0.4)] relative">
        <LeftAuth className={`${isModalOpen ? "opacity-60" : ""}`} />
        <div
          className={`flex flex-col items-center justify-center w-full md:w-[55%] lg:w-1/2 bg-white ${
            isModalOpen ? "opacity-60" : ""
          }`}
        >
          <div className="shadow-[0px_4px_10px_4px_rgba(0,0,0,0.15)] rounded-lg px-[30px] py-[45px] lg:px-[60px] lg:py-[60px]">
            <div className="w-[300px]">
              <div className="text-center mb-8">
                <h1 className="text-[45px] font-bold mb-2">Register Now</h1>
                <p className="text-black/50 font-bold text-xs">
                  Kindly provide the requested information to register.
                </p>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col mb-4">
                  <label className="text-sm font-bold" htmlFor="SchoolID">
                    School ID
                  </label>
                  <input
                    className="bg-[#f0eeed] rounded mt-1 px-4 py-3 text-xs placeholder:text-[rgba(0,0,0,0.2)]"
                    type="text"
                    value={schoolid}
                    placeholder="Enter School ID"
                    onChange={(e) => setSchoolid(e.target.value)}
                    required
                  />
                  {schooliderror && (
                    <p className="text-[#f2645c] text-xs font-bold mt-1">
                      {schooliderror}
                    </p>
                  )}
                </div>

                <div className="flex flex-col mb-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold" htmlFor="Pin">
                      PIN
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      className="bg-[#f0eeed] rounded mt-1 px-4 py-3 text-xs w-full placeholder:text-[rgba(0,0,0,0.2)]"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Pin"
                      value={Pin}
                      onChange={(e) => setPin(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-4"
                    >
                      {showPassword ? (
                        <PiEyeLight className="w-5 h-5" />
                      ) : (
                        <IoEyeOffOutline className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {pinerror && (
                    <p className="text-[#f2645c] text-xs font-bold mt-1">
                      {pinerror}
                    </p>
                  )}
                </div>
                <div className="mt-8">
                  <button
                    type="submit"
                    className="w-full bg-[#01427a] text-white rounded px-4 py-3 text-sm font-bold hover:bg-[#01427a]/80 transition-colors"
                  >
                    REGISTER
                  </button>
                </div>
              </form>
              <p className="text-xs text-black/20 font-bold  mt-4">
                Already Registered?{" "}
                <span
                  onClick={() => router.push("/")}
                  className="text-[#f47458] hover:underline cursor-pointer"
                >
                  Log In here
                </span>
              </p>
            </div>
          </div>
        </div>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Get Token"
        >
          <Get_token token={token} />
        </Modal>
      </div>

      {/* ─── Mobile View ──── */}
      <div className="lg:hidden flex flex-col items-center w-full bg-white space-y-6 p-2">
        <div className="relative w-full flex items-center justify-center">
          <button
            onClick={() => router.back()}
            className="absolute top-4 left-4 text-black z-99"
          >
            <IoChevronBackSharp className="w-6 h-6" />
          </button>
          <img
            src="/loginimage.svg"
            alt="Illustration"
            className="z-10 md:w-1/2 p-6"
          />
        </div>

        <h1 className="text-2xl font-bold text-center">Register Now</h1>

        <form onSubmit={handleSubmit} className="w-full px-6 space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-bold">School ID</label>
            <input
              type="text"
              value={schoolid}
              onChange={(e) => setSchoolid(e.target.value)}
              placeholder="Enter School ID"
              className="bg-[#f0eeed] rounded mt-1 px-4 py-3 text-xs placeholder:text-[rgba(0,0,0,0.2)]"
              required
            />
            {schooliderror && (
              <p className="text-[#f2645c] text-xs font-bold mt-1">
                {schooliderror}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-bold">PIN</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={Pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter PIN"
                className="bg-[#f0eeed] rounded mt-1 px-4 py-3 text-xs w-full placeholder:text-[rgba(0,0,0,0.2)]"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-4"
              >
                {showPassword ? (
                  <PiEyeLight className="w-5 h-5" />
                ) : (
                  <IoEyeOffOutline className="w-5 h-5" />
                )}
              </button>
            </div>
            {pinerror && (
              <p className="text-[#f2645c] text-xs font-bold mt-1">
                {pinerror}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#01427a] text-white rounded px-4 py-2 text-sm font-bold hover:bg-[#01427a]/80 transition-colors"
          >
            REGISTER
          </button>

          <div className="flex flex-row gap-1">
            <p className="text-left text-xs text-black md:text-sm">
              Already Registered?{" "}
            </p>
            <p className="text-[#01427a] text-xs md:text-sm">
              <Link href={"/"}>Log In here</Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
