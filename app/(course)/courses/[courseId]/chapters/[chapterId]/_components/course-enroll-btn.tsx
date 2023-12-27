"use client";

import { EnrollCourse } from "@/actions/enroll-course";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CourseEnrollBtn({
  courseId,
  price,
}: {
  courseId: string;
  price: number;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleEnroll = async () => {
    try {
      setIsLoading(true);
      const response = await EnrollCourse({courseId});
      window.location.assign(response.url!);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className="w-full md:w-auto"
      color="primary"
      size="sm"
      onClick={handleEnroll}
      disabled={isLoading}
    >
      Enroll for ${formatPrice(price)}
    </Button>
  );
}
