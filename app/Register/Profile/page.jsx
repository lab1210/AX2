"use client";
import React, { useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { RegisterStudent } from "../../Service/StudentRegService";
import toast from "react-hot-toast";

const extractFirstErrorMessage = (obj) => {
  if (!obj || typeof obj !== "object") return null;

  for (const key in obj) {
    const value = obj[key];
    if (Array.isArray(value) && value.length > 0) {
      return value[0]; // Return first message from array
    } else if (typeof value === "object") {
      const nested = extractFirstErrorMessage(value);
      if (nested) return nested;
    }
  }

  return null;
};

const Profile = () => {
  const searchParams = useSearchParams();
  const registrationFormPath = "/Register/student/Registration-Form";
  const router = useRouter();
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [usernameerror, setUsernameerror] = useState("");
  const [passworderror, setPassworderror] = useState("");
  const [confirmPassworderror, setConfirmPassworderror] = useState("");
  const [profilePicture, setProfilePicture] = useState("/profile.png");
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);

  useEffect(() => {
    const storedStudentInfo = localStorage.getItem("studentInfo");
    if (storedStudentInfo) {
      setStudentInfo(JSON.parse(storedStudentInfo));
    } else {
      console.error("Student info not found in local storage"); // router.push(registrationFormPath);
    }
  }, [registrationFormPath, router]);

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    setNewProfilePicture(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUsernameerror("");
    setPassworderror("");
    setConfirmPassworderror("");

    let hasErrors = false;

    if (!Username.trim()) {
      setUsernameerror("Username is required");
      hasErrors = true;
    }

    if (!Password.trim()) {
      setPassworderror("Password is required");
      hasErrors = true;
    } else if (Password.length < 6) {
      setPassworderror("Password must be at least 6 characters");
      hasErrors = true;
    }

    if (!ConfirmPassword.trim()) {
      setConfirmPassworderror("Confirm Password is required");
      hasErrors = true;
    } else if (ConfirmPassword !== Password) {
      setConfirmPassworderror("Passwords do not match");
      hasErrors = true;
    }

    if (!hasErrors && studentInfo) {
      const formData = new FormData();
      formData.append("user.username", Username);
      formData.append("user.email", "john@example.com"); // Replace or make dynamic
      formData.append("user.password", Password);

      // Append studentInfo fields (assumes flat structure)
      for (let key in studentInfo) {
        formData.append(key, studentInfo[key]);
      }

      if (newProfilePicture) {
        formData.append("profile_picture_path", newProfilePicture);
      }

      try {
        let response;

        response = await RegisterStudent(formData);

        console.log("Registration successful:", response);
        toast.success("Registration successful, you can now log in ");
        localStorage.removeItem("studentInfo");
      } catch (error) {
        console.log("RAW error:", error);
        const data = error?.response?.data;

        let errorMessage = "Registration failed";

        if (data?.error) {
          errorMessage = data.error;
        } else if (data?.detail) {
          errorMessage = data.detail;
        } else if (typeof data === "object") {
          for (const key in data) {
            const fieldError = data[key];
            if (Array.isArray(fieldError) && fieldError.length > 0) {
              errorMessage = fieldError[0];
              break;
            }
            if (typeof fieldError === "object") {
              for (const subKey in fieldError) {
                if (
                  Array.isArray(fieldError[subKey]) &&
                  fieldError[subKey].length > 0
                ) {
                  errorMessage = fieldError[subKey][0];
                  break;
                }
              }
            }
          }
        }

        console.log("Extracted error message:", errorMessage);
        toast.error(errorMessage);
      }
    }
  };

  return (
    <>
      <form className="bg-[#23303c] flex flex-col" onSubmit={handleSubmit}>
        <div className="bg-[#01427a] text-white flex justify-between items-center px-8 py-5 font-bold">
          <h2 className="text-xl">Profile Update</h2>
          <Link href={registrationFormPath}>
            <IoIosCloseCircleOutline className="w-6 h-6 cursor-pointer" />
          </Link>
        </div>

        <div className="flex justify-center items-center h-screen">
          <div className="shadow-[0px_4px_10px_4px_rgba(0,0,0,0.15)] rounded-t-3xl bg-[#fdfdfd] px-20 py-3 pb-10 min-w-[450px] ">
            <div className="flex justify-center mb-8">
              <div className="bg-[#ffa500] w-[15%] h-1 rounded-lg"></div>
            </div>

            <div className="flex flex-col">
              <h3 className="text-[#01427a] text-lg font-bold mb-5">
                Profile Picture
              </h3>

              <div className="flex items-center gap-5 mb-8">
                <div className="relative w-[70px] h-[70px] rounded-full bg-[#0000001a]">
                  <img
                    src={profilePicture}
                    alt="Profile Pic"
                    className="w-full h-full rounded-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 bg-[#01427a] text-white w-5 h-5 rounded-full flex items-center justify-center">
                    <p>+</p>
                    <input
                      type="file"
                      id="profile-picture-upload"
                      className="hidden"
                      onChange={handleProfilePictureChange}
                      accept="image/*"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("profile-picture-upload").click()
                    }
                    className="bg-[#01427a] opacity-50 text-white px-10 py-1 rounded-lg cursor-pointer"
                  >
                    Add Picture
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 mb-10">
                <div className="flex flex-col gap-1">
                  <label className="text-gray-500 font-bold text-sm">
                    Create Username
                  </label>
                  <input
                    type="text"
                    className="border border-[#d9d9d9] rounded p-1 placeholder:text-[#0b0a0a33] placeholder:font-bold placeholder:text-xs"
                    placeholder="Create Username"
                    value={Username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  {usernameerror && (
                    <span className="text-[#f2645c] text-xs font-bold">
                      {usernameerror}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-gray-500 font-bold text-sm">
                    Create Password
                  </label>
                  <input
                    type="password"
                    className="border border-[#d9d9d9] rounded p-1 placeholder:text-[#0b0a0a33] placeholder:font-bold placeholder:text-xs"
                    placeholder="Enter Password"
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {passworderror && (
                    <span className="text-[#f2645c] text-xs font-bold">
                      {passworderror}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-gray-500 font-bold text-sm">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="border border-[#d9d9d9] rounded p-1 placeholder:text-[#0b0a0a33] placeholder:font-bold placeholder:text-xs"
                    placeholder="Confirm Password"
                    value={ConfirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {confirmPassworderror && (
                    <span className="text-[#f2645c] text-xs font-bold">
                      {confirmPassworderror}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="bg-[#01427a] opacity-50 text-white px-10 py-1 text-sm rounded-md cursor-pointer"
                disabled={!studentInfo}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Profile;
