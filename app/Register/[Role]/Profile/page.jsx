"use client";
import React, { useState } from "react";
import profilestyles from "../../../css/profile.module.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
const Profile = () => {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  const registrationFormPath =
    role === "teacher" ? `/Register/Teacher` : `/Register/Student`;
  const router = useRouter();
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [usernameerror, setUsernameerror] = useState("");
  const [passworderror, setPassworderror] = useState("");
  const [confirmPassworderror, setConfirmPassworderror] = useState("");
  const [profilePicture, setProfilePicture] = useState("/profile.png");
  const [newProfilePicture, setNewProfilePicture] = useState(null);

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
  const handleSubmit = (e) => {
    e.preventDefault();
    if (Username === "") {
      setUsernameerror("Username is required");
    } else {
      setUsernameerror("");
    }
    if (Password === "") {
      setPassworderror("Password is required");
    } else {
      setPassworderror("");
    }
    if (ConfirmPassword === "") {
      setConfirmPassworderror("Confirm Password is required");
    } else if (ConfirmPassword !== Password) {
      setConfirmPassworderror("Passwords do not match");
    } else {
      setConfirmPassworderror("");
    }
    if (
      Username !== "" &&
      Password !== "" &&
      ConfirmPassword !== "" &&
      ConfirmPassword === Password
    ) {
      router.push("/");
      // Code to submit form data to server
    }
  };

  return (
    <form className={profilestyles.Reg_form_Container} onSubmit={handleSubmit}>
      <div className={profilestyles.Reg_header}>
        <h2>Profile Update</h2>
        <Link href={`${registrationFormPath}/Registration-Form`}>
          <IoIosCloseCircleOutline size={24} />
        </Link>
      </div>

      <div className={profilestyles.Profilebox}>
        <div className={profilestyles.Profilecontent}>
          <div className={profilestyles.head}>
            <div className={profilestyles.orangedash}></div>
          </div>
          <div className={profilestyles.Profile_details}>
            <h3 className={profilestyles.title}>Profile Picture</h3>
            <div className={profilestyles.ProfileRow1}>
              <div className={profilestyles.Profile_pic}>
                <img src={profilePicture} alt="Profile Pic" />
                <div className={profilestyles.Profile_pic_upload}>
                  <p>+</p>
                  <input
                    type="file"
                    id="profile-picture-upload"
                    style={{ display: "none" }}
                    onChange={handleProfilePictureChange}
                    accept="image/*"
                  />
                </div>
              </div>
              <div className={profilestyles.AddPic}>
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById("profile-picture-upload").click()
                  }
                >
                  Add Picture
                </button>
              </div>
            </div>
            <div className={profilestyles.ProfileInputs}>
              <div className={profilestyles.ProfileInputItem}>
                <label htmlFor="Username">Create Username</label>
                <input
                  type="text"
                  name="Username"
                  placeholder="Create Username"
                  value={Username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {usernameerror && (
                  <span className={profilestyles.error}>{usernameerror}</span>
                )}
              </div>
              <div className={profilestyles.ProfileInputItem}>
                <label htmlFor="Password">Create Password</label>
                <input
                  type="password"
                  name="Password"
                  placeholder="Enter Password"
                  value={Password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {passworderror && (
                  <span className={profilestyles.error}>{passworderror}</span>
                )}
              </div>
              <div className={profilestyles.ProfileInputItem}>
                <label htmlFor="ConfirmPassword">Confirm Password</label>
                <input
                  type="password"
                  name="ConfirmPassword"
                  placeholder="Confirm Password"
                  value={ConfirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {confirmPassworderror && (
                  <span className={profilestyles.error}>
                    {confirmPassworderror}
                  </span>
                )}
              </div>
            </div>
            <button className={profilestyles.SaveButton} type="submit">
              Save
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Profile;
