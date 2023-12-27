import NavbarRoutes from "@/app/(dashboard)/_components/navbar-routes";
import UserMenu from "@/app/(dashboard)/_components/user-menu";
import { Chapter, Course, UserProgress } from "@prisma/client";
import React from "react";
import CourseMobileSidebar from "./course-mobile.sidebar";

interface CourseNavbarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  userProgress: number;
}

export default function CourseNavbar({
  course,
  userProgress,
}: CourseNavbarProps) {
  return (
    <div className="p-4 border-b h-full w-full flex items-center bg-white shadow-sm">
      <CourseMobileSidebar course={course} userProgress={userProgress} />
      <NavbarRoutes />
      <UserMenu />
    </div>
  );
}
