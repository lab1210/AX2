"use client";

import { usePathname } from "next/navigation";
import React from "react";
import StudentForm from "./StudentForm";
import TeacherForm from "./TeacherForm";

const RegForm = () => {
  const pathname = usePathname();
  const role = pathname.includes("/teacher")
    ? "teacher"
    : pathname.includes("/student")
    ? "student"
    : null;

  return (
    <div className="h-screen">
      {role === "student" ? <StudentForm /> : <TeacherForm />}
    </div>
  );
};

export default RegForm;
