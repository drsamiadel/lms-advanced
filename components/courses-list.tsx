import { Category, Course } from "@prisma/client";
import CourseCard from "@/components/course-card";
import { Frown } from "lucide-react";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
  isWishlisted: boolean;
  rating: {
    rate: number;
    numberOfRatings: number;
  };
};

interface CoursesListProps {
  items: CourseWithProgressWithCategory[];
}

export default function CoursesList({ items }: CoursesListProps) {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {items.map((course) => (
          <CourseCard
            key={course.id}
            id={course.id}
            title={course.title}
            imageUrl={course.imageUrl!}
            chaptersLength={course.chapters.length}
            price={course.price!}
            progress={course.progress}
            category={course?.category?.name!}
            wishlisted={course.isWishlisted}
            userId={course.userId}
            rating={course.rating}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-10">
          <Frown /> No courses found
        </div>
      )}
    </div>
  );
}
