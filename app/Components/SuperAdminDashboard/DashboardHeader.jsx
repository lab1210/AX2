"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const DashboardHeader = () => {
  const [headerTitle, setHeaderTitle] = useState("Dashboard");
  const pathName = usePathname();

  const generateTitle = (path) => {
    if (!path) return "Dashboard"; // Default title

    const parts = path.split("/").filter(Boolean); // Remove empty parts

    // If there's only one part (e.g., /stuff), return it directly
    if (parts.length === 1) {
      return parts[0]
        .replace(/-/g, " ")
        .replace(/\b\w/g, (match) => match.toUpperCase());
    }

    // If there are multiple parts, return only the last part
    if (parts.length > 1) {
      const lastPart = parts[parts.length - 1];
      return lastPart
        .replace(/-/g, " ")
        .replace(/\b\w/g, (match) => match.toUpperCase());
    }

    return "Dashboard"; // Default title
  };

  useEffect(() => {
    const title = generateTitle(pathName);
    setHeaderTitle(title);
  }, [pathName]);

  return (
    <div>
      <p className="text-xl font-bold">{headerTitle}</p>
    </div>
  );
};

export default DashboardHeader;
