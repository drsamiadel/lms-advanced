"use server";

import { userSession } from "@/hooks/userSession";
import { prisma } from "@/lib/db/prisma";

export async function updateChapterProgress({
  chapterId,
  courseId,
  isCompleted,
}: {
  chapterId: string;
  courseId: string;
  isCompleted: boolean;
}) {
  try {
    const { id } = await userSession();

    const userProgress = await prisma.userProgress.upsert({
      where: {
        userId_chapterId: {
          chapterId,
          userId: id,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        isCompleted,
        userId: id,
        chapterId,
      },
    });

    return userProgress;
  } catch (error) {
    console.error(error);
  }
}
