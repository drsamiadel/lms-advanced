"use client";

import { Heart, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { toggleWishlist } from "@/actions/handle-wishlist";
import { useRouter } from "next/navigation";
import React from "react";

export default function WishlistBtn({
  wishlisted,
  courseId,
  userId,
}: {
  wishlisted: boolean;
  courseId: string;
  userId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  return (
    <Button
      size="sm"
      variant="ghost"
      className="w-min mt-2 ml-auto"
      onClick={(e) => {
        setLoading(true);
        toggleWishlist({
          userId,
          courseId,
        })
          .then(() => {
            router.refresh();
          })
          .finally(() => {
            setLoading(false);
          });
      }}
    >
      {loading ? (
        <Loader2 size={20} className="animate-spin" />
      ) : (
        <Heart size={20} className={wishlisted ? "text-red-500" : ""} fill={wishlisted ? "#ef4444" : "#fff"} />
      )}
    </Button>
  );
}
