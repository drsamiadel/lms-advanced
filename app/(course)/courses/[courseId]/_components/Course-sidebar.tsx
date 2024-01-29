import { prisma } from "@/lib/db/prisma";
import { Chapter, Course, Lesson, RatingCourse, UserProgress } from "@prisma/client";
import React from "react";
import CourseSidebarItem from "./course-sidebar-item";
import CourseProgress from "@/components/course-progress";
import { userSession } from "@/hooks/userSession";
import Rating from "@/components/rating";
import { getRating } from "@/actions/get-rating";

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      lessons: (Lesson & {
        userProgress: UserProgress[];
      })[];
    })[];
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

  const chapterIsCompleted = (
    chapter: Chapter & {
      lessons: (Lesson & { userProgress: UserProgress[] })[];
    }
  ) => {
    return chapter.lessons.every((lesson) => {
      return lesson.userProgress?.[0]?.isCompleted;
    });
  };

  const rating = await getRating(course.id);
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
      <div className="flex flex-col w-full h-full">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={chapterIsCompleted(chapter)}
            courseId={course.id}
            isLocked={!chapter.isFree && !purchase}
            lessons={chapter.lessons}
          />
        ))}
        <div className="px-4 py-4 border-t mt-auto">
          <h1 className="text-slate-600 font-[500] text-lg mb-4">Rate this course</h1>
          <Rating courseId={course.id} rating={rating} />
        </div>
      </div>
    </div>
  );
}
