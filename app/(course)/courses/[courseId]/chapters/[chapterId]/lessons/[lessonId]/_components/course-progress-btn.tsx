"use client";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { updateLessonProgress } from "../_actions";

interface CourseProgressBtnProps {
  courseId: string;
  chapterId: string;
  lessonId: string;
  isCompleted: boolean;
  nextChapterId: string;
  nextLessonId: string;
}

export default function CourseProgressBtn({
  courseId,
  chapterId,
  lessonId,
  isCompleted,
  nextChapterId,
  nextLessonId,
}: CourseProgressBtnProps) {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      await updateLessonProgress({
        lessonId,
        isCompleted: !isCompleted,
      });
      if (!isCompleted && !nextLessonId) {
        confetti.onOpen();
      }
      if (!isCompleted && nextLessonId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}/lessons/${nextLessonId}`);
      }
      toast.success("Lesson progress updated.");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const Icon = isCompleted ? XCircle : CheckCircle;

  return (
    <Button
      type="button"
      variant={isCompleted ? "outline" : "success"}
      className="w-full md:w-auto"
      disabled={isLoading}
      onClick={onClick}
    >
      {isCompleted ? "Mark as not completed" : "Mark as completed"}
      <Icon className="ml-2 h-4 w-4" />
    </Button>
  );
}
