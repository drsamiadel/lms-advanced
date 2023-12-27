import { Chapter, Course, UserProgress } from "@prisma/client";
import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import CourseSidebar from "./Course-sidebar";

type CourseMobileSidebarProps = {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  userProgress: number;
};

export default function CourseMobileSidebar({
    course,
    userProgress,
}: CourseMobileSidebarProps) {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent className="p-0 bg-white w-72" side={"left"}>
        <CourseSidebar course={course} userProgress={userProgress}/>
      </SheetContent>
    </Sheet>
  );
}
