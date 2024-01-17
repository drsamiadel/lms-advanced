import { prisma } from "@/lib/db/prisma";
import { Chapter, Course, UserProgress } from "@prisma/client";
import React from "react";
import CourseSidebarItem from "./course-sidebar-item";
import CourseProgress from "@/components/course-progress";
import { userSession } from "@/hooks/userSession";

interface CourseSidebarProps {
  course: Course & {
    chapters: Chapter[];
  };
  userProgress: number;
}

export default async function CourseSidebar({
  course,
  userProgress,
}: CourseSidebarProps) {
  const { id } = await userSession();

  const purchase = await prisma.purchase.findUnique({
    where: {
      userId_courseId: {
        courseId: course.id,
        userId: id,
      },
    },
  });
  return (
    <div className="h-full boreder-r flex flex-col overflow-y-auto shadow-sm w-full">
      <div className="px-7 py-8 flex flex-col border-b">
        <h1 className="font-semibold">{course.title}</h1>
        {purchase && (
          <div className="mt-10">
            <CourseProgress variant="success" value={userProgress} />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            courseId={course.id}
            isLocked={!chapter.isFree && !purchase}
          />
        ))}
      </div>
    </div>
  );
}
