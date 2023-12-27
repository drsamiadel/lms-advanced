"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

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
    const session = await getServerSession(authOptions);
    if (!session) redirect("/");
    const { user } = session;

    const userProgress = await prisma.userProgress.upsert({
      where: {
        userId_chapterId: {
          chapterId,
          userId: user.id,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        isCompleted,
        userId: user.id,
        chapterId,
      },
    });

    return userProgress;
  } catch (error) {
    console.error(error);
  }
}
