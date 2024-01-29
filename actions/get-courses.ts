import { prisma } from "@/lib/db/prisma";
import { Category, Course } from "@prisma/client";
import { getProgress } from "@/actions/get-progress";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  progress: number | null;
  chapters: { id: string }[];
  isWishlisted: boolean;
  rating: {
    rate: number;
    numberOfRatings: number;
  };
};

type GetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
  wishlist?: boolean;
};

export const getCourses = async ({
  userId,
  title,
  categoryId,
  wishlist,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
          mode: "insensitive",
        },
        category: {
          id: categoryId,
        },
        ...(wishlist && {
          wishlistCourse: {
            some: {
              wishlist: {
                userId,
              },
            },
          },
        }),
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        purchases: {
          where: {
            userId,
          },
        },
        wishlistCourse: {
          where: {
            wishlist: {
              userId,
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const coursesWithProgress: CourseWithProgressWithCategory[] =
      await Promise.all(
        courses.map(async (course) => {
          const rating = await prisma.ratingCourse.aggregate({
            where: {
              courseId: course.id,
            },
            _avg: {
              rating: true,
            },
          });

          const numberOfRatings = await prisma.ratingCourse.count({
            where: {
              courseId: course.id,
            },
          });

          if (!course.purchases.length) {
            return {
              ...course,
              isWishlisted: !!course.wishlistCourse.length,
              progress: null,
              rating: {
                rate: rating._avg.rating || 0,
                numberOfRatings,
              }
            };
          }
          const progressPercentage = await getProgress(userId, course.id);

          return {
            ...course,
            isWishlisted: !!course.wishlistCourse.length,
            progress: progressPercentage,
            rating: {
              rate: rating._avg.rating || 0,
              numberOfRatings,
            }
          };
        })
      );

    return coursesWithProgress;
  } catch (error) {
    console.log(error);
    return [];
  }
};
