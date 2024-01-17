"use server";

import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { Course } from "@prisma/client";
import { userSession } from "@/hooks/userSession";

export async function updateCourse({
  courseId,
  values,
}: {
  courseId: string;
  values: Course | Partial<Course>;
}) {
  await userSession();
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
  const { id } = await userSession();
  const attachment = await prisma.attachment.findUnique({
    where: {
      id: attachmentId,
    },
  });

  if (!attachment) {
    throw new Error("Attachment not found");
  }

  const course = await prisma.course.findUnique({
    where: {
      id: attachment.lessonId,
    },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  if (course.userId !== id) {
    throw new Error("Not authorized");
  }

  await prisma.attachment.delete({
    where: {
      id: attachmentId,
    },
  });

  return attachment;
}

export async function createChapter({
  courseId,
  values,
}: {
  courseId: string;
  values: { title: string };
}) {
  const { id } = await userSession();
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  if (course.userId !== id) {
    throw new Error("Not authorized");
  }

  const lastChapter = await prisma.chapter.findFirst({
    where: {
      courseId,
    },
    orderBy: {
      position: "desc",
    },
  });

  const newPosition = lastChapter ? lastChapter.position + 1 : 1;

  const chapter = await prisma.chapter.create({
    data: {
      title: values.title,
      courseId,
      position: newPosition,
    },
  });

  return chapter;
}

export async function reorderChapters({
  courseId,
  updateData: values,
}: {
  courseId: string;
  updateData: { id: string; position: number }[];
}) {
  const { id } = await userSession();
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  if (course.userId !== id) {
    throw new Error("Not authorized");
  }

  for (let item of values) {
    await prisma.chapter.update({
      where: {
        id: item.id,
      },
      data: {
        position: item.position,
      },
    });
  }

  return true;
}

export async function deleteCourse({ courseId }: { courseId: string }) {
  const { id } = await userSession();
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  if (course.userId !== id) {
    throw new Error("Not authorized");
  }

  await prisma.course.delete({
    where: {
      id: courseId,
    },
  });

  return course;
}

export async function toggleCoursePublish({ courseId }: { courseId: string }) {
  const { id } = await userSession();
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  if (course.userId !== id) {
    throw new Error("Not authorized");
  }

  const updatedCourse = await prisma.course.update({
    where: {
      id: courseId,
    },
    data: {
      isPublished: !course.isPublished,
    },
  });

  return updatedCourse;
}
