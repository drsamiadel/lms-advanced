import { getServerSession } from "next-auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { authOptions } from "../auth/[...nextauth]/route";

const f = createUploadthing();

const handleAuth = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session.user.id as unknown as Record<string, unknown>;
};

export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => await handleAuth())
    .onUploadComplete(() => {}),

  courseAttachment: f(["text", "image", "video", "audio", "pdf"])
    .middleware(async () => await handleAuth())
    .onUploadComplete(() => {}),

    chapterVideo: f({ video: { maxFileSize: "512MB", maxFileCount: 1 } })
    .middleware(async () => await handleAuth())
    .onUploadComplete(() => {}),
    
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
