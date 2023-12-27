"use server";

import {Chapter} from "@prisma/client"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db/prisma";

export async function updateChapter({
    chapterId,
    courseId,
    values: {isPublished, ...values}
  }: {
    chapterId: string;
    courseId: string;
    values: Chapter | Partial<Chapter>
  }) {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("Not authenticated");
    }
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
  
    if(course.userId !== session.user.id) {
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
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("Not authenticated");
    }
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
  
    if(course.userId !== session.user.id) {
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
      }
    });

    if(publishedChapters.length === 0) {
      await prisma.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        }
      })
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
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error("Not authenticated");
    }
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
  
    if(course.userId !== session.user.id) {
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
      }
    });

    if(publishedChapters.length === 0) {
      await prisma.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        }
      })
    }
  
    return chapterUpdate;
  }