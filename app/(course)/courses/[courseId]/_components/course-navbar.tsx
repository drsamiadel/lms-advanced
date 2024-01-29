import NavbarRoutes from "@/app/(dashboard)/_components/navbar-routes";
import UserMenu from "@/app/(dashboard)/_components/user-menu";
import { Chapter, Course, Lesson, UserProgress } from "@prisma/client";
import React from "react";
import CourseMobileSidebar from "./course-mobile.sidebar";
import { getUserRole } from "@/actions/get-user-role";

interface CourseNavbarProps {
  course: Course & {
    chapters: (Chapter & {
      lessons: (Lesson & {
        userProgress: UserProgress[];
      })[];
    })[];
  };
  userProgress: number;
}

export default async function CourseNavbar({
  course,
  userProgress,
}: CourseNavbarProps) {
  const { role } = await getUserRole();
  return (
    <div className="p-4 border-b h-full w-full flex items-center bg-white shadow-sm">
      <CourseMobileSidebar course={course} userProgress={userProgress} />
      <NavbarRoutes role={role!} />
      <UserMenu />
    </div>
  );
}
