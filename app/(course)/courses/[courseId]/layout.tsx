import { getProgress } from "@/actions/get-progress";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import CourseSidebar from "./_components/Course-sidebar";
import CourseNavbar from "./_components/course-navbar";
import { userSession } from "@/hooks/userSession";
export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) {
  const { id } = await userSession();

  const course = await prisma.course.findUnique({
    where: { id: params.courseId },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }
  const userProgress = await getProgress(id, course.id);
  return (
    <div className="h-full">
      <div className="h-[60px] md:pl-80 fixed inset-y-0 z-50 w-full">
        <CourseNavbar course={course} userProgress={userProgress} />
      </div>
      <div className="hidden md:flex h-full w-80 fixed inset-y-0 z-50">
        <CourseSidebar
            course={course}
            userProgress={userProgress}
            />
      </div>
      <main className="md:pl-80 h-full pt-[60px]">{children}</main>
    </div>
  );
}
