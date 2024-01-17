"use server";

import { Chapter } from "@prisma/client";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db/prisma";
import { userSession } from "@/hooks/userSession";

export async function updateChapter({
  chapterId,
  courseId,
  values: { isPublished, ...values },
}: {
  chapterId: string;
  courseId: string;
  values: Chapter | Partial<Chapter>;
}) {
  const { id } = await userSession();
  const chapter = await prisma.chapter.findUnique({
    where: {
      id: chapterId,
    },
  });

  if (!chapter) {
    throw new Error("Chapter not found");
  }

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

  const chapterUpdate = await prisma.chapter.update({
    where: {
      id: chapterId,
    },
    data: {
      ...values,
    },
  });

  return chapterUpdate;
}

export async function deleteChapter({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}) {
  const { id } = await userSession();
  const chapter = await prisma.chapter.findUnique({
    where: {
      id: chapterId,
    },
  });

  if (!chapter) {
    throw new Error("Chapter not found");
  }

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

  const chapterDelete = await prisma.chapter.delete({
    where: {
      id: chapterId,
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

  return chapterDelete;
}

export async function togglePublishChapter({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}) {
  const { id } = await userSession();
  const chapter = await prisma.chapter.findUnique({
    where: {
      id: chapterId,
    },
  });

  if (!chapter) {
    throw new Error("Chapter not found");
  }

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

  const chapterUpdate = await prisma.chapter.update({
    where: {
      id: chapterId,
    },
    data: {
      isPublished: !chapter.isPublished,
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

  return chapterUpdate;
}

export async function createLesson({
  chapterId,
  values,
}: {
  chapterId: string;
  values: { title: string };
}) {
  await userSession();

  const chapter = await prisma.chapter.findUnique({
    where: {
      id: chapterId,
    },
  });

  if (!chapter) {
    throw new Error("Chapter not found");
  }

  const lastLesson = await prisma.lesson.findFirst({
    where: {
      chapterId,
    },
    orderBy: {
      position: "desc",
    },
  });

  const newPosition = lastLesson ? lastLesson.position + 1 : 1;

  const lesson = await prisma.lesson.create({
    data: {
      title: values.title,
      chapterId,
      position: newPosition,
    },
  });

  return lesson;
}

export async function reorderLessons({
  chapterId,
  updateData: values,
}: {
  chapterId: string;
  updateData: { id: string; position: number }[];
}) {
  await userSession();
  const chapter = await prisma.chapter.findUnique({
    where: {
      id: chapterId,
    },
  });

  if (!chapter) {
    throw new Error("Chapter not found");
  }

  for (let item of values) {
    await prisma.lesson.update({
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
