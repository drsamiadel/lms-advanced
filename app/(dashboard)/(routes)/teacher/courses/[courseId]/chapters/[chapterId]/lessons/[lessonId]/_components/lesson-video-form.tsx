/*
  DEPRECATED
*/

"use client";
import * as zod from "zod";

import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, VideoIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Lesson } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";
import Player from "@/components/player";
import { updataLesson } from "../_actions";

interface LessonVideoProps {
  initialData: Lesson;
  chapterId: string;
  courseId: string;
  lessonId: string;
}

const formSchema = zod.object({
  videoUrl: zod.string().min(1),
});

export default function LessonVideo({ initialData, courseId, chapterId, lessonId }: LessonVideoProps) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => setIsEditing((prev) => !prev);

  const router = useRouter();

  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    try {
      await updataLesson({ lessonId, values });
      toast.success("Lesson updated successfully");
      toggleEditing();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Lesson video
        <Button variant="ghost" onClick={toggleEditing}>
          {isEditing ? (
            "Cancel"
          ) : initialData.videoUrl ? (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit video
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add video
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        !initialData.videoUrl ? (
          <div className="flex items-center justify-center aspect-video bg-slate-200 rounded-md">
            <VideoIcon className="h-14 w-14 text-slate-400" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Player src={initialData.videoUrl} />
          </div>
        )
      ) : (
        <div>
          <FileUpload
            endpoint="lessonVideo"
            onChange={(url) => {
              if (url) onSubmit({ videoUrl: url });
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Upload lesson&apos;s video. Supported formats: mp4, webm, ogg
          </div>
        </div>
      )}
    </div>
  );
}
