"use server";

import { userSession } from "@/hooks/userSession";
import { prisma } from "@/lib/db/prisma";

export const updateLessonProgress = async ({
  lessonId,
  isCompleted,
}: {
  lessonId: string;
  isCompleted: boolean;
}) => {
  try {
    const { id } = await userSession();

    const userProgress = await prisma.userProgress.upsert({
      where: {
        userId_lessonId: {
          lessonId,
          userId: id,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        isCompleted,
        userId: id,
        lessonId,
      },
    });

    return userProgress;
  } catch (error) {
    console.error(error);
  }
};

export const submitAnswers = async (formData: FormData) => {
  try {
    const { id } = await userSession();

    const lessonId = formData.get("lessonId") as string;

    const questionsIds = await prisma.question.findMany({
      where: {
        quiz: {
          lessonId,
        },
      },
      select: {
        id: true,
      },
    });

    const questionsIdsArray = questionsIds.map((question) => question.id);

    const userAnswers = questionsIdsArray.map((questionId) => {
      const answer = formData.get(questionId) as string;
      return {
        userId: id,
        questionId,
        answer,
      };
    });

    const userAnswersCreated = await prisma.userAnswer.createMany({
      data: userAnswers,
    });

    return userAnswersCreated;
  } catch (error) {
    console.error(error);
  }
};
