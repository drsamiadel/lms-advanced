import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { prisma } from "@/lib/db/prisma";
import { userSession } from "@/hooks/userSession";

export default async function CoursesPage() {
  const {id} = await userSession();

  const courses = await prisma.course.findMany({
    where: {
      userId: id,
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
