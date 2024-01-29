import { prisma } from "@/lib/db/prisma";
import { Category, Chapter, Course } from "@prisma/client";
import { getProgress } from "./get-progress";

type CourseWitgProgressWithCategory = Course & {
  category: Category;
  chapters: Chapter[];
  progress: number | null;
  isWishlisted: boolean;
  wishlistCourse: {
    wishlist: {
      userId: string;
    };
  }[];
  rating: {
    rate: number;
    numberOfRatings: number;
  };
};

type DashboardCourses = {
  completedCourses: CourseWitgProgressWithCategory[];
  coursesInProgress: CourseWitgProgressWithCategory[];
  coursesInWishlist: CourseWitgProgressWithCategory[];
};

export const getDashboardCourses = async (
  userId: string
): Promise<DashboardCourses> => {
  try {
    const purchasedCourses = await prisma.purchase.findMany({
      where: {
        userId,
      },
      select: {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                isPublished: true,
              },
            },
            wishlistCourse: {
              select: {
                wishlist: {
                  select: {
                    userId: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const courses = purchasedCourses.map(
      (purchase) => purchase.course
    ) as unknown as CourseWitgProgressWithCategory[];

    for (let course of courses) {
      const progress = await getProgress(userId, course.id);
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
      course["progress"] = progress;
      course["isWishlisted"] = !!course.wishlistCourse.find(
        (wishlistCourse) => wishlistCourse.wishlist.userId === userId
      );
      course["rating"] = {
        rate: rating._avg.rating ?? 0,
        numberOfRatings,
      };
    }

    const completedCourses = courses.filter(
      (course) => course.progress === 100
    );
    const coursesInProgress = courses.filter(
      (course) => (course.progress ?? 0) < 100
    );
    const coursesInWishlist = courses.filter((course) => course.isWishlisted);

    return {
      completedCourses,
      coursesInProgress,
      coursesInWishlist,
    };
  } catch (error) {
    console.log(error);
    return {
      completedCourses: [],
      coursesInProgress: [],
      coursesInWishlist: [],
    };
  }
};
