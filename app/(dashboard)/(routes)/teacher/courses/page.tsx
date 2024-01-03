import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";

export default async function CoursesPage() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/");
  const { user } = session;

  const courses = await prisma.course.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    }
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  );
}
