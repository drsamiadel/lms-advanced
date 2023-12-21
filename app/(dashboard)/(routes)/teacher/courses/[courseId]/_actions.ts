"use server";

import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function updateCourse({
  courseId,
  values,
}: {
  courseId: string;
  values: { title?: string, description?: string, imageUrl?: string, price?: number, published?: boolean, publishedAt?: Date, updatedAt?: Date, createdAt?: Date };
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Not authenticated");
  }
  const course = await prisma.course.update({
    where: {
        id: courseId,
    },
    data: {
      ...values,
    },
  });

  return course;
}
