"use client";

import { SendHorizontal, Star } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { submitReview } from "@/app/(course)/courses/[courseId]/_actions";
import { useRouter } from "next/navigation";

export default function Rating({
  courseId,
  rating,
}: {
  courseId: string;
  rating: {
    userRating: {
      rating: number | null;
      comment: string;
    };
    rating: number;
  };
}) {
  const stars: number[] = [1, 2, 3, 4, 5];
  const starIndicator: string[] = [
    "Poor",
    "Fair",
    "Average",
    "Good",
    "Excellent",
  ];
  const [hoveredStars, setHoveredStars] = useState<number>(0);
  const [rate, setRate] = useState({
    star: rating.userRating.rating || 0,
    review: rating.userRating.comment || "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const res = await submitReview(courseId, rate);
      router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {stars.map((star) => (
            <div
              key={star}
              className="cursor-pointer"
              onMouseEnter={() => {
                if (!!!rating.userRating.rating) {
                  setHoveredStars(star);
                }
              }}
              onMouseLeave={() => {
                setHoveredStars(0);
              }}
              onClick={() => {
                if (!!!rating.userRating.rating) {
                  setRate((prev) => ({
                    ...prev,
                    star,
                  }));
                }
              }}
            >
              <Star
                className={`w-6 h-6 ${
                  hoveredStars >= star
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                } ${
                  rate.star >= star
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
                strokeWidth={1}
              />
            </div>
          ))}
        </div>
        <div className="text-sm text-gray-400">
          {starIndicator[rate.star - 1]}
        </div>
      </div>
      <Textarea
        className={`w-full max-h-32 transition-all duration-300
          ${
            rate.star
              ? "min-h-20 h-26 border-green-400 focus:border-green-400 visible"
              : "min-h-0 p-0 h-0 border-gray-300 focus:border-gray-300 invisible"
          }
         `}
        placeholder="Write a review"
        rows={3}
        disabled={!rate.star || isSubmitting || !!rating.userRating.rating}
        maxLength={500}
        value={rate.review}
        onChange={(e) => {
          setRate((prev) => ({
            ...prev,
            review: e.target.value,
          }));
        }}
      />
      {!!rate.star && (
        <>
          <div className="text-sm text-gray-400 flex justify-between">
            {rate.star
              ? `You have rated ${rate.star} out of 5 stars.`
              : "Please rate the course."}
            <span className="text-gray-300">{rate.review.length}/500</span>
          </div>
          {!!!rating.userRating.rating && (
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                className={`${
                  rate.star ? "visible" : "invisible"
                } w-full justify-center`}
                onClick={() => {
                  setRate({
                    star: 0,
                    review: "",
                  });
                }}
                disabled={isSubmitting}
              >
                cancel
              </Button>
              <Button
                variant={rate.star ? "success" : "ghost"}
                className="col-span-2"
                onClick={handleSubmit}
                disabled={isSubmitting || !rate.star}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner" />
                ) : (
                  <SendHorizontal className="w-6 h-6" strokeWidth={1} />
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
