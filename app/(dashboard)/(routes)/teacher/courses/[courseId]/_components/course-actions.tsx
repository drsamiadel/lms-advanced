"use client";

import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { deleteCourse, toggleCoursePublish } from "../_actions";
import { useConfettiStore } from "@/hooks/use-confetti-store";

type CourseActionsProps = {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
};

export default function CourseActions({
  disabled,
  courseId,
  isPublished,
}: CourseActionsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const confetti = useConfettiStore();

    const onDelete = async () => {
        try {
            setIsLoading(true);
            await deleteCourse({courseId});
            toast.success("Course deleted successfully.");
            router.refresh();
            router.push(`/teacher/courses`);
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const onPublish = async () => {
        try {
            setIsLoading(true);
            await toggleCoursePublish({courseId});
            toast.success(`Course ${isPublished ? "unpublished" : "published"} successfully.`);
            if (!isPublished) {
                confetti.onOpen();
            }
            router.refresh();
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
  return (
    <div className="flex flex-center gap-x-2">
      <Button
        onClick={onPublish}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button disabled={isLoading} size="sm">
          <Trash className="w-4 h-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
}

