"use server"

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
