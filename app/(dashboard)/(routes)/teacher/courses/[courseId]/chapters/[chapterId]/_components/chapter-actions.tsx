"use client";

import ConfirmModal from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { deleteChapter, togglePublishChapter, updateChapter } from "../_actions";

type ChapterActionsProps = {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
};

export default function ChapterActions({
  disabled,
  courseId,
  chapterId,
  isPublished,
}: ChapterActionsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();


    const onDelete = async () => {
        try {
            setIsLoading(true);
            await deleteChapter({ courseId, chapterId });
            toast.success("Chapter deleted successfully.");
            router.refresh();
            router.push(`/teacher/courses/${courseId}`);
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const onPublish = async () => {
        try {
            setIsLoading(true);
            await togglePublishChapter({ courseId, chapterId });
            toast.success("Chapter published successfully.");
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
