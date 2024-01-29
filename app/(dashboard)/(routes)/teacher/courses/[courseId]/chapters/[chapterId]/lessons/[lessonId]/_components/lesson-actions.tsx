"use client";

import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { deleteLesson, togglePublishLesson } from "../_actions";

type LessonActionsProps = {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  lessonId: string;
  isPublished: boolean;
};

export default function LessonActions({
  disabled,
  courseId,
  chapterId,
  isPublished,
  lessonId,
}: LessonActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await deleteLesson({ lessonId });
      toast.success("Lesson deleted successfully.");
      router.refresh();
      router.push(`/teacher/courses/${courseId}/chapters/${chapterId}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onPublish = async () => {
    try {
      setIsLoading(true);
      await togglePublishLesson({
        chapterId,
        courseId,
        lessonId,
      });
      toast.success("Lesson published successfully.");
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
