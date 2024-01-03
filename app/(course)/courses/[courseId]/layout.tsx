import { getProgress } from "@/actions/get-progress";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import CourseSidebar from "./_components/Course-sidebar";
import CourseNavbar from "./_components/course-navbar";
export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }
  const { user } = session;

  const course = await prisma.course.findUnique({
    where: { id: params.courseId },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId: user.id,
            },
          },
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
  const userProgress = await getProgress(user.id, course.id);
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
