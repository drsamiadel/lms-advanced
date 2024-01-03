"use client";
import * as zod from "zod";

import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { updateCourse } from "../_actions";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Course } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = zod.object({
  imageUrl: zod.string().min(1, { message: "Image is required" }),
});

export default function ImageForm({ initialData, courseId }: ImageFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => setIsEditing((prev) => !prev);

  const router = useRouter();

  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    try {
      await updateCourse({ courseId, values });
      toast.success("Course updated successfully");
      toggleEditing();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course image
        <Button variant="ghost" onClick={toggleEditing}>
          {isEditing ? (
            "Cancel"
          ) : initialData.imageUrl ? (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit image
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add image
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        !initialData.imageUrl ? (
          <div className="flex items-center justify-center aspect-video bg-slate-200 rounded-md">
            <ImageIcon className="h-14 w-14 text-slate-400" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              src={initialData.imageUrl}
              className="rounded-md object-cover"
              alt="uploaded image"
              fill
            />
          </div>
        )
      ) : (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) onSubmit({ imageUrl: url });
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
}
