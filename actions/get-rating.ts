import { userSession } from "@/hooks/userSession";
import { prisma } from "@/lib/db/prisma";

interface Rating {
  userRating: {
    rating: number | null;
    comment: string;
  };
  rating: number;
}

export const getRating = async (courseId: string): Promise<Rating> => {
  try {
    const { id } = await userSession();
    const rating = await prisma.ratingCourse.findFirst({
      where: {
        courseId,
        userId: id,
      },
    });

    const totalRating = await prisma.ratingCourse.aggregate({
      where: {
        courseId,
      },
      _avg: {
        rating: true,
      },
    });

    return {
      rating: totalRating._avg.rating || 0,
      userRating: {
        rating: rating?.rating || 0,
        comment: rating?.comment || "",
      },
    };
  } catch (error) {
    console.error(error);
    return { rating: 0, userRating: { rating: 0, comment: "" } };
  }
};
