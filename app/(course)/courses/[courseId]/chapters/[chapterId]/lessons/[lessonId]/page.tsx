import { getLesson } from "@/actions/get-lesson";
import Banner from "@/components/banner";
import { redirect } from "next/navigation";
import React from "react";
import ChapterPlayer from "./_components/chapter-player";
import CourseEnrollBtn from "./_components/course-enroll-btn";
import { Separator } from "@/components/ui/separator";
import Preview from "@/components/preview";
import { Check, File, MessageCircleQuestionIcon } from "lucide-react";
import CourseProgressBtn from "./_components/course-progress-btn";
import { userSession } from "@/hooks/userSession";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { submitAnswers } from "./_actions";
import { cn } from "@/lib/utils";
import FormSubmitBtn from "@/components/form-submit-btn";

interface ChapterPageProps {
  params: {
    courseId: string;
    chapterId: string;
    lessonId: string;
  };
}

export default async function ChapterPage({
  params: { courseId, chapterId, lessonId },
}: ChapterPageProps) {
  const { id } = await userSession();
  cookies().get("token");

  const {
    lesson,
    chapter,
    course,
    attachments,
    quiz,
    userProgress,
    purchase,
    nextLesson,
    nextChapter,
    userAnswers,
  } = await getLesson({
    userId: id,
    courseId,
    chapterId,
    lessonId,
  });

  if (!chapter || !course) redirect("/");

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner label="You have completed this lesson." variant="success" />
      )}
      {isLocked && (
        <Banner
          label="You need to purchase the course to watch this chapter."
          variant="warning"
        />
      )}
      <div className="flex flex-col max-w-7xl mx-auto pb-20">
        <div className="p-4">
          <ChapterPlayer
            lessonId={lessonId}
            title={lesson.title}
            courseId={courseId}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
            nextLessonId={nextLesson?.id!}
            nextChapterId={nextChapter?.id!}
            playbackUrl={lesson.videoUrl!}
          />
        </div>
        <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between">
          <h2 className="text-2xl font-semibold mb-2">{lesson.title}</h2>
          {purchase ? (
            <CourseProgressBtn
              courseId={courseId}
              chapterId={chapterId}
              lessonId={lessonId}
              nextLessonId={nextLesson?.id!}
              isCompleted={userProgress?.isCompleted!}
              nextChapterId={nextLesson?.id!}
            />
          ) : (
            <CourseEnrollBtn courseId={courseId} price={course.price!} />
          )}
        </div>
        <Separator />
        <div>
          <Preview value={lesson.description!} />
        </div>
        {(!!attachments?.length || quiz) && (
          <>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-3">
              {!!quiz && (
                <div className="p-4 col-span-1 md:col-span-2">
                  <h3 className="text-xl font-semibold mb-2 text-slate-500">
                    Quiz
                  </h3>
                  <form action={submitAnswers}>
                    {quiz.questions.map((question) => (
                      <div
                        key={question.id}
                        className="mb-4 bg-slate-200/30 p-4 rounded-2xl"
                      >
                        <h4 className="text-xl font-semibold mb-4 text-slate-600">
                          <MessageCircleQuestionIcon className="inline-block mr-2 text-slate-600/40" />
                          {question.question}
                        </h4>
                        {JSON.parse(question.options).map(
                          (option: { id: string; content: string }) => (
                            <div
                              key={option.id}
                              className={cn(
                                "flex items-center bg-white/60 rounded-xl mb-2 ml-4",
                                userAnswers?.find(
                                  (ua) =>
                                    ua.questionId === question.id &&
                                    ua.answer === option.id &&
                                    ua.answer === question.answer
                                ) && "bg-green-500/60",
                                userAnswers?.find(
                                  (ua) =>
                                    ua.questionId === question.id &&
                                    ua.answer !== option.id &&
                                    ua.answer !== question.answer
                                ) && "bg-red-500/60"
                              )}
                            >
                              <input
                                type="radio"
                                id={option.id}
                                name={question.id}
                                value={option.id}
                                className="mx-2"
                                required
                                disabled={
                                  !!userAnswers?.find(
                                    (ua) => ua.questionId === question.id
                                  )
                                }
                              />
                              <label
                                htmlFor={option.id}
                                className="w-full py-2 flex justify-between"
                              >
                                {option.content}
                                {userAnswers?.find(
                                  (ua) =>
                                    ua.questionId === question.id &&
                                    ua.answer === option.id
                                ) && (
                                  <Check className="inline-block mx-4 text-green-500" />
                                )}
                              </label>
                            </div>
                          )
                        )}
                        {!!userAnswers.length && !!question.explanation && (
                          <p className="text-sm text-slate-500">
                            <span className="font-semibold">Explanation:</span>{" "}
                            {question.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                    <input type="hidden" name="lessonId" value={lessonId} />
                    {!!!userAnswers?.length && (
                      <FormSubmitBtn className="w-full" variant="success">
                        Submit
                      </FormSubmitBtn>
                    )}
                  </form>
                </div>
              )}
              {!!attachments?.length && (
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2 text-slate-500">
                    Attachments
                  </h3>
                  {attachments.map((attachment) => (
                    <a
                      className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                      href={attachment.url}
                      target="_blank"
                      key={attachment.id}
                    >
                      <File />
                      <p className="line-clamp-1">{attachment.name}</p>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
