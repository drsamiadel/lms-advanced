"use server";

import { prisma } from "@/lib/db/prisma";

export const toggleWishlist = async ({
  userId,
  courseId,
}: {
  userId: string;
  courseId: string;
}): Promise<void> => {
  try {
    const userWishlist = await prisma.wishlist.findFirst({
      where: {
        userId,
      },
    });

    if (!userWishlist) {
      await prisma.wishlist.create({
        data: {
          userId,
          courses: {
            createMany: {
              data: [
                {
                  courseId,
                },
              ],
            },
          },
        },
      });
      return;
    }

    const isWishlisted = await prisma.wishlistCourse.findFirst({
      where: {
        wishlistId: userWishlist.id,
        courseId,
      },
    });

    if (isWishlisted) {
      await prisma.wishlistCourse.delete({
        where: {
          id: isWishlisted.id,
        },
      });
      return;
    }

    await prisma.wishlistCourse.create({
      data: {
        wishlistId: userWishlist.id,
        courseId,
      },
    });

    return;
  } catch (error) {
    console.error(error);
  }
};
