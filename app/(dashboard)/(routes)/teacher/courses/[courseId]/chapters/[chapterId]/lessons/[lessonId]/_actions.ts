"use server";

import { userSession } from "@/hooks/userSession";
import { prisma } from "@/lib/db/prisma";

export async function addAttachment({
  lessonId,
  values: { url },
}: {
  lessonId: string;
  values: { url: string };
}) {
  await userSession();
  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
  });

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  const attachment = await prisma.attachment.create({
    data: {
      url,
      name: url.split("/").pop() || "",
      lessonId,
    },
  });

  return attachment;
}

export async function deleteAttachment({
  attachmentId,
}: {
  attachmentId: string;
}) {
  await userSession();
  const attachment = await prisma.attachment.findUnique({
    where: {
      id: attachmentId,
    },
  });

  if (!attachment) {
    throw new Error("Attachment not found");
  }

  await prisma.attachment.delete({
    where: {
      id: attachmentId,
    },
  });

  return attachment;
}

export const updataLesson = async ({
  lessonId,
  values,
}: {
  lessonId: string;
  values: { title?: string; description?: string; videoUrl?: string };
}) => {
  await userSession();
  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
  });

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  const updatedLesson = await prisma.lesson.update({
    where: {
      id: lessonId,
    },
    data: {
      title: values.title,
      description: values.description,
      videoUrl: values.videoUrl,
    },
  });

  return updatedLesson;
};

export const deleteLesson = async ({ lessonId }: { lessonId: string }) => {
  await userSession();
  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
  });

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  await prisma.lesson.delete({
    where: {
      id: lessonId,
    },
  });

  return lesson;
};

export const handleQuiz = async ({
  lessonId,
  values,
}: {
  lessonId: string;
  values: {
    id: string;
    question: string;
    options: string;
    answer: string;
    explanation: string | null;
    quizId: string;
  }[];
}) => {
  try {
    await userSession();
    const lesson = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
      include: {
        quizzes: true,
      },
    });

    if (!lesson) {
      throw new Error("Lesson not found");
    }

    const quiz = await prisma.quiz.findUnique({
      where: {
        lessonId: lesson.id,
      },
    });

    if (!quiz) {
      const newQuiz = await prisma.quiz.create({
        data: {
          lessonId: lesson.id,
          questions: {
            create: values.map((value) => ({
              question: value.question,
              options: value.options,
              answer: value.answer,
              explanation: value.explanation,
            })),
          },
        },
      });

      return newQuiz;
    }

    await prisma.question.deleteMany({
      where: {
        quizId: quiz.id,
      },
    });

    const newQuestions = await prisma.question.createMany({
      data: values.map((value) => ({
        question: value.question,
        options: value.options,
        answer: value.answer,
        explanation: value.explanation,
        quizId: quiz.id,
      })),
    });

    return newQuestions;
  } catch (error) {
    console.log(error);
  }
};

export async function togglePublishLesson({
  chapterId,
  courseId,
  lessonId,
}: {
  chapterId: string;
  courseId: string;
  lessonId: string;
}) {
  await userSession();
  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
  });

  if (!lesson) {
    throw new Error("Chapter not found");
  }

  const lessonUpdate = await prisma.lesson.update({
    where: {
      id: lessonId,
    },
    data: {
      isPublished: !lesson.isPublished,
    },
  });

  const publishedLessons = await prisma.lesson.findMany({
    where: {
      chapterId,
      isPublished: true,
    },
  });

  if (publishedLessons.length === 0) {
    await prisma.chapter.update({
      where: {
        id: chapterId,
      },
      data: {
        isPublished: false,
      },
    });

    const publishedChapters = await prisma.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
    });

    if (publishedChapters.length === 0) {
      await prisma.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }
  }

  return publishedLessons;
}
