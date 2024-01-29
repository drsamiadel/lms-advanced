"use server";

import { userSession } from "@/hooks/userSession";
import { prisma } from "@/lib/db/prisma";

export const submitReview = async (
  courseId: string,
  rate: {
    star: number;
    review: string;
  }
) => {
  const { id } = await userSession();
  const { star, review } = rate;

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  const rating = await prisma.ratingCourse.findFirst({
    where: {
      courseId: course.id,
      userId: id,
    },
  });

  if (rating) {
    throw new Error("You have already rated this course");
  }

  const reviwDate = await prisma.ratingCourse.create({
    data: {
      rating: star,
      comment: review,
      courseId: course.id,
      userId: id,
    },
  });

  return reviwDate;
};
