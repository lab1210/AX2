import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";

const SchoolAdminSettingsPopup = ({ settingsClicked, setSettingsClicked }) => {
  const popupRef = useRef(null);
  const searchParams = useSearchParams();
  const schooladminId = searchParams.get("schooladminId");

  const SettingsPopup = [
    {
      Name: "Configure School Settings",
      Link: "/School-Admin/Configure-School",
    },
    {
      Name: "Configure Class",
      Link: "/School-Admin/Configure-Class",
    },
    {
      Name: "Configure Department and Subject",
      Link: "/School-Admin/Configure-Subject",
    },
  ];
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setSettingsClicked(false);
      }
    };

    if (settingsClicked) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [settingsClicked, setSettingsClicked]);

  return (
    <ul
      ref={popupRef}
      className={`bg-[#064D94] ${
        settingsClicked ? "block" : "hidden"
      } z-100 absolute left-0 ml-2 top-0 w-[280px] p-4 rounded-lg shadow-lg flex flex-col gap-2`}
    >
      {SettingsPopup.map((item, index) => {
        return (
          <li
            className="hover:bg-[#ABBED2] rounded-sm p-2.5 pt-1 pb-1"
            key={index}
          >
            <Link
              href={`${item.Link}${
                schooladminId ? `?schooladminId=${schooladminId}` : ""
              }`}
            >
              {item.Name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default SchoolAdminSettingsPopup;
