import { userSession } from "@/hooks/userSession";
import { prisma } from "@/lib/db/prisma";
import ProfileForm from "./_components/profile-form";

export default async function ProfilePage() {
  const { id } = await userSession();
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      userInfo: true,
    },
  });
  return (
    <div className="flex flex-col gap-y-2">
      <h2 className="text-slate-800 font-[500]">Profile settings</h2>
      <ProfileForm initialData={user} />
    </div>
  );
}
