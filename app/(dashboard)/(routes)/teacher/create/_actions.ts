"use server";

import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function createCourse({ title }: { title: string }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Not authenticated");
  }
  const course = await prisma.course.create({
    data: {
      title,
      userId: session.user.id,
    },
  });
  return course;
}
