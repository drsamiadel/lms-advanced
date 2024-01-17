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
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Chapter, Course, Lesson } from "@prisma/client";
import LessonsList from "./lessons-list";
import { createLesson, reorderLessons } from "../_actions";

interface LessonsFormProps {
  initialData: Chapter & { lessons: Lesson[] };
  chapterId: string;
  courseId: string;
}

const formSchema = zod.object({
  title: zod.string().min(1),
});

export default function LessonsForm({
  initialData,
  chapterId,
  courseId,
}: LessonsFormProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setisUpdating] = useState(false);

  const toggleCreating = () => setIsCreating((prev) => !prev);

  const router = useRouter();

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    try {
      await createLesson({ chapterId, values });
      toast.success("Chapter updated successfully");
      toggleCreating();
      router.refresh();
      form.reset();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setisUpdating(true);
      await reorderLessons({ chapterId, updateData });
      toast.success("Lessons reordered successfully");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setisUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${chapterId}/lessons/${id}`);
  };

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
              Add a lesson
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
                      placeholder="e.g. 'The required material to start'"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Create
              </Button>
            </div>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div
          className={cn(
            "mt-2 text-sm",
            !initialData.lessons.length && "text-slate-500 italic"
          )}
        >
          {!initialData.lessons.length && "No lessons yet"}
          <LessonsList
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.lessons || []}
          />
        </div>
      )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drop lessons to reorder them. Click on the pencil icon to
          edit a chapter.
        </p>
      )}
    </div>
  );
}
