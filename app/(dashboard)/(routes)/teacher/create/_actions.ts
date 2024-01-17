"use server";

import { prisma } from "@/lib/db/prisma";
import { userSession } from "@/hooks/userSession";

export async function createCourse({ title }: { title: string }) {
  const {id} = await userSession();
  const course = await prisma.course.create({
    data: {
      title,
      userId: id,
    },
  });
  return course;
}
