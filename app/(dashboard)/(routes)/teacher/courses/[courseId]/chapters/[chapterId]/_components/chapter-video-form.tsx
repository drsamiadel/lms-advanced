"use client";
import * as zod from "zod";

import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle, VideoIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Chapter } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";
import { updateChapter } from "../_actions";
import Player from "@/components/player";

interface ChapterVideoProps {
  initialData: Chapter;
  chapterId: string;
  courseId: string;
}

const formSchema = zod.object({
  videoUrl: zod.string().min(1),
});

export default function ChapterVideo({ initialData, courseId, chapterId }: ChapterVideoProps) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => setIsEditing((prev) => !prev);

  const router = useRouter();

  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    try {
      await updateChapter({ courseId, chapterId, values });
      toast.success("Chapter updated successfully");
      toggleEditing();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter video
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
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) onSubmit({ videoUrl: url });
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Upload chapter&apos;s video. Supported formats: mp4, webm, ogg
          </div>
        </div>
      )}
    </div>
  );
}
