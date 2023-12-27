"use client";

import { useEffect, useState } from "react";
import { Loader2, Lock } from "lucide-react";
import Player from "@/components/player";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { updateChapterProgress } from "../_actions";

interface ChapterPlayerProps {
  chapterId: string;
  title: string;
  courseId: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  nextChapterId?: string;
  playbackUrl: string
}

function ChapterPlayer({
  chapterId,
  title,
  courseId,
  isLocked,
  completeOnEnd,
  nextChapterId,
  playbackUrl
}: ChapterPlayerProps) {
  const router = useRouter();
  const confetti = useConfettiStore();

  const onEnd = async () => {
    try {
      if(completeOnEnd) {
        await updateChapterProgress({courseId, chapterId, isCompleted: true});

        if(!nextChapterId) {
          confetti.onOpen();
        }

        toast.success("Progress updated");
        router.refresh();

        if(nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        }
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="relative aspect-video">
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
          <Lock className="w-10 h-10" />
          <p className="text-sm font-semibold">This chapter is locked</p>
        </div>
      )}
      {!isLocked && (
        <Player src={playbackUrl} autoPlay={true} onEnd={onEnd} />
      )}
    </div>
  );
}

export default ChapterPlayer;
