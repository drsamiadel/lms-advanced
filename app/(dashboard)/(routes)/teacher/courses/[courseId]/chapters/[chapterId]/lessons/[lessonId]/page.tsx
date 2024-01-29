import { IconBadge } from "@/components/icon-badge";
import { prisma } from "@/lib/db/prisma";
import {
  ArrowLeft,
  File,
  LayoutDashboard,
  MessageCircleQuestion,
  Video,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import Banner from "@/components/banner";
import { userSession } from "@/hooks/userSession";
import LessonActions from "./_components/lesson-actions";
import LessonTitleForm from "./_components/lesson-title-form";
import LessonDescriptionForm from "./_components/lesson-description-form";
import LessonVideo from "./_components/lesson-video-form";
import AttachmentForm from "./_components/lesson-attachment-form";
import LessonQuiz from "./_components/lesson-quiz";

export default async function ChapterPage({
  params,
}: {
  params: { courseId: string; chapterId: string; lessonId: string };
}) {
  await userSession();

  const lesson = await prisma.lesson.findUnique({
    where: {
      id: params.lessonId,
    },
    include: {
      attachments: true,
      quizzes: {
        include: {
          questions: true,
        },
      }
    },
  });

  if (!lesson) {
    return redirect("/");
  }

  const requiredFields = [lesson.title, lesson.description, lesson.videoUrl];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  const isCompleted = requiredFields.every(Boolean);

  return (
    <>
      {!lesson.isPublished && (
        <Banner
          label="This chapter is not published yet. It will not be visible in the course."
          variant="warning"
        />
      )}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${params.courseId}/chapters/${params.chapterId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to chapter
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-semibold">Lesson creation</h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
              </div>
              <LessonActions
                disabled={!isCompleted}
                courseId={params.courseId}
                chapterId={params.chapterId}
                lessonId={params.lessonId}
                isPublished={lesson.isPublished ?? false}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Cusomize your lesson</h2>
              </div>
              <LessonTitleForm
                initialData={lesson}
                courseId={params.courseId}
                chapterId={params.chapterId}
                lessonId={params.lessonId}
              />
              <LessonDescriptionForm
                initialData={lesson}
                courseId={params.courseId}
                chapterId={params.chapterId}
                lessonId={params.lessonId}
              />
              <div className="flex items-center gap-x-2 mt-6">
                <IconBadge icon={Video} />
                <h2 className="text-xl">Video</h2>
              </div>
              <LessonVideo
                initialData={lesson}
                courseId={params.courseId}
                chapterId={params.chapterId}
                lessonId={params.lessonId}
              />
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Attachments</h2>
              </div>
              <AttachmentForm initialData={lesson} lessonId={params.lessonId} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={MessageCircleQuestion} />
                <h2 className="text-xl">Quiz</h2>
              </div>
              <LessonQuiz
                initialData={lesson}
                courseId={params.courseId}
                chapterId={params.chapterId}
                lessonId={params.lessonId}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
