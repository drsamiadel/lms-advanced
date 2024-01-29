import { Star, StarHalf } from "lucide-react";

export default function RatingPreview({
  rating,
}: {
  rating: {
    rate: number;
    numberOfRatings: number;
  };
}) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => {
        const isHalf = rating.rate - index === 0.5;
        const isFull = rating.rate - index >= 1;
        return (
          <div key={index}>
            {isHalf ? (
              <StarHalf size={17} className="text-yellow-400 fill-yellow-400" />
            ) : isFull ? (
              <Star size={17} className="text-yellow-400 fill-yellow-400" />
            ) : (
              <Star size={17} className="text-yellow-400/60" />
            )}
          </div>
        );
      })}
        <span className="text-xs text-gray-400">
            ({rating.numberOfRatings})
        </span>
    </div>
  );
}
