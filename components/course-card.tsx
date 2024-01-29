import Image from "next/image";
import Link from "next/link";
import { IconBadge } from "./icon-badge";
import { BookOpen, Heart } from "lucide-react";
import { formatPrice } from "@/lib/format";
import CourseProgress from "./course-progress";
import WishlistBtn from "./wishlist-btn";
import { Star, StarHalf } from "lucide-react";
import RatingPreview from "./rating-preview";

type CourseCardProps = {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  price: number;
  progress: number | null;
  category: string | null;
  wishlisted: boolean;
  userId: string;
  rating: {
    rate: number;
    numberOfRatings: number;
  };
};

export default function CourseCard({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  progress,
  category,
  wishlisted,
  userId,
  rating,
}: CourseCardProps) {
  return (
    <div className="group hover:shadow-md transition overflow-hidden border rounded-lg p-3 h-full flex flex-col">
      <Link href={`/courses/${id}`}>
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            style={{ objectFit: "cover" }}
            width={800}
            height={500}
          />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </div>
          <p className="text-xs text-muted-foreground">{category}</p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <IconBadge size="sm" icon={BookOpen} />
            <span>
              {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
            </span>
          </div>
          {progress !== null ? (
            <CourseProgress
              size="sm"
              value={progress}
              variant={progress === 100 ? "success" : "default"}
            />
          ) : (
            <p className="text-md md:text-sm font-medium text-slate-700">
              {formatPrice(price)}
            </p>
          )}
        </div>
      </Link>
      <div className="flex justify-between items-center mt-auto">
        <RatingPreview rating={rating} />
        <WishlistBtn wishlisted={wishlisted} courseId={id} userId={userId} />
      </div>
    </div>
  );
}
