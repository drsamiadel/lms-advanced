import { prisma } from "@/lib/db/prisma";

export const getProgress = async (
  userId: string,
  courseId: string
): Promise<number> => {
  try {
    const publishedLessons = await prisma.lesson.findMany({
      where: {
        chapter: {
          courseId: courseId,
          isPublished: true,
        },
        isPublished: true,
      },
      select: {
        id: true,
      },
    });

    const publishedLessonsIds = publishedLessons.map((lesson) => lesson.id);

    const validCompletedLessons = await prisma.userProgress.count({
      where: {
        userId: userId,
        lessonId: {
          in: publishedLessonsIds,
        },
        isCompleted: true,
      },
    });

    const progressPercentage =
      (validCompletedLessons / publishedLessonsIds.length) * 100;

    return progressPercentage;
  } catch (error) {
    console.error(error);
    return 0;
  }
};
