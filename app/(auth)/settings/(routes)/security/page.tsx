import { userSession } from "@/hooks/userSession";
import { prisma } from "@/lib/db/prisma";
import SecurityForm from "./_components/security-form";

export default async function SecurityPage() {
  const { id } = await userSession();
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return (
    <div className="flex flex-col gap-y-2">
      <h2 className="text-slate-800 font-[500]">Security settings</h2>
      <SecurityForm initialData={user} />
    </div>
  );
}
