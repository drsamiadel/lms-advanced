"use client";

import { cn } from "@/lib/utils";
import { Lesson, UserProgress } from "@prisma/client";
import { BookCheck, BookIcon, BookLock, CheckCircle, Lock, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface CourseSidebarItemProps {
  id: string;
  label: string;
  isCompleted?: boolean;
  courseId: string;
  isLocked: boolean;
  lessons: (Lesson & { userProgress: UserProgress[] })[];
}

export default function CourseSidebarItem({
  id,
  label,
  isCompleted,
  courseId,
  isLocked,
  lessons,
}: CourseSidebarItemProps) {
  const pathname = usePathname();
  const router = useRouter();

  const Icon = isLocked ? Lock : isCompleted ? CheckCircle : PlayCircle;
  const ChapterIcon = isLocked ? BookLock : isCompleted ? BookCheck : BookIcon;

  const isActive = pathname?.includes(id);
  const handleClick = () => {
    router.push(`/courses/${courseId}/chapters/${id}`);
  };
  return (
    <div className="flex flex-col">
      <button
        className={cn(
          "pointer-events-none flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
          isActive &&
            "text-slate-700 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700",
          isCompleted && "text-emerald-700 hover:text-emerald-700",
          isCompleted && isActive && "bg-emerald-200/20 hover:bg-emerald-200/20"
        )}
        type="button"
        // onClick={handleClick}
      >
        <div className="flex items-center gap-x-2 py-4">
          <ChapterIcon
            size={22}
            className={cn(
              "text-slate-500",
              isActive && "text-slate-700",
              isCompleted && "text-emerald-700"
            )}
          />
          {label}
        </div>
        <div
          className={cn(
            "ml-auto opacity-0 transition-all border-2 border-slate-700 h-full",
            isActive && "opacity-100",
            isCompleted && "border-emerald-700"
          )}
        />
      </button>
      {lessons.map((lesson) => (
        <button
          key={lesson.id}
          className={cn(
            "flex items-center gap-x-2 text-slate-400 text-sm font-[400] pl-10 transition-all hover:text-slate-500 hover:bg-slate-300/20",
            pathname?.includes(lesson.id) &&
              "text-slate-700 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700",
            lesson.userProgress?.[0]?.isCompleted &&
              "text-emerald-700 hover:text-emerald-700",
            lesson.userProgress?.[0]?.isCompleted &&
              pathname?.includes(lesson.id) &&
              "bg-emerald-200/20 hover:bg-emerald-200/20"
          )}
          type="button"
          onClick={() =>
            router.push(
              `/courses/${courseId}/chapters/${id}/lessons/${lesson.id}`
            )
          }
        >
          <div className="flex items-center gap-x-2 py-4">
            <Icon
              size={22}
              className={cn(
                "text-slate-500",
                pathname?.includes(lesson.id) && "text-slate-700",
                lesson.userProgress?.[0]?.isCompleted && "text-emerald-700"
              )}
            />
            {lesson.title}
          </div>
          <div
            className={cn(
              "ml-auto opacity-0 transition-all border-2 border-slate-400 h-full",
              pathname?.includes(lesson.id) && "opacity-100",
              lesson.userProgress?.[0]?.isCompleted && "border-emerald-700"
            )}
          />
        </button>
      ))}
    </div>
  );
}
