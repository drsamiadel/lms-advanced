"use client";
import * as zod from "zod";

import { Button } from "@/components/ui/button";
import { File, ImageIcon, Loader, Loader2, Pencil, PlusCircle, XIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { addAttachment, deleteAttachment, updateCourse } from "../_actions";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

const formSchema = zod.object({
  url: zod.string().min(1),
});

export default function AttachmentForm({
  initialData,
  courseId,
}: AttachmentFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEditing = () => setIsEditing((prev) => !prev);

  const router = useRouter();

  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    try {
      await addAttachment({ courseId, values });
      toast.success("Course updated successfully");
      toggleEditing();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteAttachment({ attachmentId: id });
      toast.success("Attachment deleted successfully");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course attachments
        <Button variant="ghost" onClick={toggleEditing}>
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        initialData.attachments.length === 0 ? (
          <div className="text-sm text-slate-500 mt-2 italic">
            No attachments yet
          </div>
        ) : (
          <div className="space-y-2">
            {initialData.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
              >
                <File className="h-4 w-4 mr-2 flex-shrink-0" />
                <p className="text-xs truncate">{attachment.name}</p>
                {deletingId === attachment.id ? (
                  <div>
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  <button className="ml-auto hover:opacity-75 transition text-red-600" onClick={() => onDelete(attachment.id)}><XIcon className="h-4 w-4" /></button>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) onSubmit({ url });
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Add anything that might be useful for your students.
          </div>
        </div>
      )}
    </div>
  );
}
