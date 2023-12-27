import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";

interface CoursePageProps {
  params: {
    courseId: string;
  };
}

export default async function CoursePage({
  params: { courseId },
}: CoursePageProps) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      chapters: {
        where: { isPublished: true },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) return redirect("/");

  return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`);
}
