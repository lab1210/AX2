import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";

const SchoolAdminSettingsPopup = ({
  settingsClicked,
  setSettingsClicked,
  Name,
}) => {
  const popupRef = useRef(null);
  const searchParams = useSearchParams();
  const schooladminId = searchParams.get("schooladminId");

  const SchoolSettingsPopup = [
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
      Link: "/School-Admin/Configure-Subject-&-Department",
    },
  ];
  const AssignmentSettingsPopup = [
    {
      Name: "Teacher Assignment",
      Link: "/School-Admin/Teacher-Assignment",
    },
    {
      Name: "Subject to Department Assignment",
      Link: "/School-Admin/Subject-Assignment",
    },
    {
      Name: "Student Assignment",
      Link: "/School-Admin/Assign-Students-to-Classroom",
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
      className={`bg-[#4169E133] backdrop-blur-xs  ${
        settingsClicked ? "block" : "hidden"
      } z-[1000] absolute left-40 ml-2 top-0 ${
        Name === "School Settings" ? "w-[280px]" : "w-[300px]"
      } pt-4 pb-4 pr-4 pl-4 rounded-lg shadow-xl bg-[url('/noise.png')] bg-cover flex flex-col gap-2`}
    >
      {(Name === "School Settings"
        ? SchoolSettingsPopup
        : AssignmentSettingsPopup
      ).map((item, index) => {
        return (
          <Link
            href={`${item.Link}${
              schooladminId ? `?schooladminId=${schooladminId}` : ""
            }`}
            key={index}
          >
            <li className="hover:backdrop-opacity-90  hover:bg-white/90 hover:bg-[url('/noise.png')] text-[#333333]  text-sm rounded-lg p-4 pt-2 pb-2">
              {item.Name}
            </li>
          </Link>
        );
      })}
    </ul>
  );
};

export default SchoolAdminSettingsPopup;
