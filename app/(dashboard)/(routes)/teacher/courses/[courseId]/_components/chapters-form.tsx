"use client";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { createChapter, updateCourse } from "../_actions";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Chapter, Course } from "@prisma/client";
import ChaptersList from "./chapters-list";
import { reorderChapters } from "../_actions";

interface ChaptersFormProps {
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
}

const formSchema = zod.object({
  title: zod.string().min(1),
});

export default function ChaptersForm({ initialData, courseId }: ChaptersFormProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setisUpdating] = useState(false)
  
  const toggleCreating = () => setIsCreating((prev) => !prev);

    const router = useRouter();

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    }
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    try {
        await createChapter({courseId, values});
        toast.success("Course updated successfully");
        toggleCreating();
        router.refresh();
    } catch {
        toast.error("Something went wrong");
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
        setisUpdating(true);
        await reorderChapters({courseId, updateData});
        toast.success("Chapters reordered successfully");
        router.refresh();
      } catch {
        toast.error("Something went wrong");
    } finally {
        setisUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`);
  }

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Course chapters
        <Button variant="ghost" onClick={toggleCreating}>
          {isCreating ? (
            "Cancel"
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a chapter
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="e.g. 'Introduction to the course'"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
                <Button disabled={!isValid || isSubmitting} type="submit">Create</Button>
            </div>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div className={cn("mt-2 text-sm", 
          !initialData.chapters.length && "text-slate-500 italic"
        )}>
          {!initialData.chapters.length && "No chapters yet"}
          <ChaptersList
          onEdit={onEdit}
          onReorder={onReorder}
          items={initialData.chapters || []} />
        </div>
      )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drop chapters to reorder them. Click on the pencil icon to
          edit a chapter.
        </p>
      )}
    </div>
  );
}
