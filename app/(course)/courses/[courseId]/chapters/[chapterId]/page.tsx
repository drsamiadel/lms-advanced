import { getChapter } from "@/actions/get-chapter";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Banner from "@/components/banner";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import ChapterPlayer from "./_components/chapter-player";
import CourseEnrollBtn from "./_components/course-enroll-btn";
import { Separator } from "@/components/ui/separator";
import Preview from "@/components/preview";
import { File } from "lucide-react";
import CourseProgressBtn from "./_components/course-progress-btn";

interface ChapterPageProps {
  params: {
    courseId: string;
    chapterId: string;
  };
}

export default async function ChapterPage({
  params: { courseId, chapterId },
}: ChapterPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const { chapter, course, attachments, userProgress, purchase, nextChapter } =
    await getChapter({
      userId: session.user.id,
      courseId,
      chapterId,
    });

  if (!chapter || !course) redirect("/");

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner label="You have completed this chapter." variant="success" />
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
            chapterId={chapterId}
            title={chapter.title}
            courseId={courseId}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
            nextChapterId={nextChapter?.id!}
            playbackUrl={chapter.videoUrl!}
          />
        </div>
        <div className="p-4 flex felx col md:flex-row items-center justify-between">
          <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
          {purchase ? (
            <CourseProgressBtn
              courseId={courseId}
              chapterId={chapterId}
              isCompleted={!!userProgress?.isCompleted}
              nextChapterId={nextChapter?.id!}
            />
          ) : (
            <CourseEnrollBtn courseId={courseId} price={course.price!} />
          )}
        </div>
        <Separator />
        <div>
          <Preview value={chapter.description!} />
        </div>
        {!!attachments?.length && (
          <>
            <Separator />
            <div className="p-4">
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
          </>
        )}
      </div>
    </div>
  );
}
