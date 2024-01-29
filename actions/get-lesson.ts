import { prisma } from "@/lib/db/prisma";
import {
  Attachment,
  Chapter,
  Lesson,
  Question,
  Quiz,
  UserAnswer,
  UserProgress,
} from "@prisma/client";

interface getLessonProps {
  userId: string;
  courseId: string;
  chapterId: string;
  lessonId: string;
}

export const getLesson = async ({
  userId,
  courseId,
  chapterId,
  lessonId,
}: getLessonProps) => {
  try {
    const purchase = await prisma.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    const course = await prisma.course.findFirst({
      where: {
        isPublished: true,
        id: courseId,
      },
      select: {
        price: true,
      },
    });

    const chapter = await prisma.chapter.findFirst({
      where: {
        id: chapterId,
        isPublished: true,
      },
    });

    const lesson = await prisma.lesson.findFirst({
      where: {
        id: lessonId,
        isPublished: true,
      },
    });

    if (!chapter || !course || !lesson) {
      throw new Error("Lesson, chapter or course not found");
    }

    let attachments: Attachment[] = [];
    let quiz: (Quiz & { questions: Question[] }) | null = null;
    let nextLesson: Lesson | null = null;
    let nextChapter: Chapter | null = null;
    let userProgress: UserProgress | null = null;
    let userAnswers: UserAnswer[] = [];

    if (purchase) {
      attachments = await prisma.attachment.findMany({
        where: {
          lessonId,
        },
      });

      quiz = await prisma.quiz.findFirst({
        where: {
          lessonId,
        },
        include: {
          questions: true,
        },
      });

      userAnswers = await prisma.userAnswer.findMany({
        where: {
          userId,
          question: {
            quizId: quiz?.id,
          },
        },
      });
    }

    if (chapter.isFree || purchase) {
      userProgress = await prisma.userProgress.findUnique({
        where: {
          userId_lessonId: {
            userId,
            lessonId,
          },
        },
      });

      nextLesson = await prisma.lesson.findFirst({
        where: {
          chapterId,
          isPublished: true,
          position: {
            gt: lesson.position,
          },
        },
        orderBy: {
          position: "asc",
        },
      });

      if (!nextLesson) {
        nextChapter = await prisma.chapter.findFirst({
          where: {
            courseId: chapter.courseId,
            isPublished: true,
            position: {
              gt: chapter.position,
            },
          },
          orderBy: {
            position: "asc",
          },
        });

        if (!nextChapter) {
          return {
            chapter,
            course,
            lesson,
            attachments,
            quiz,
            userAnswers,
            nextLesson: null,
            nextChapter: null,
            userProgress,
            purchase,
          };
        }

        nextLesson = await prisma.lesson.findFirst({
          where: {
            chapterId: nextChapter?.id,
            isPublished: true,
          },
          orderBy: {
            position: "asc",
          },
        });
      } else {
        nextChapter = chapter;
      }
    }

    return {
      chapter,
      course,
      lesson,
      quiz,
      userAnswers,
      attachments,
      nextLesson,
      nextChapter,
      userProgress,
      purchase,
    };
  } catch (error) {
    console.log(error);
    return {
      chapter: null,
      course: null,
      attachments: [],
      quiz: null,
      userAnswers: [],
      nextChapter: null,
      nextLesson: null,
      userProgress: null,
      purchase: null,
    };
  }
};
