import { prisma } from "@/lib/db/prisma";
import Categories from "./_components/categories";
import SearchInput from "@/components/search-input";
import { getCourses } from "@/actions/get-courses";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CoursesList from "@/components/courses-list";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const session = await getServerSession(authOptions);
  if (!session) return { props: {} };
  const { user } = session;

  const courses = await getCourses({
    userId: user.id,
    ...searchParams,
  });
  return (
    <>
      <div className="px-6 pt-6 block md:mb-0 md:hidden">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <div>
          <h1 className="text-lg font-[500] text-slate-600">Categories</h1>
          <Categories items={categories} />
        </div>
        <CoursesList items={courses} />
      </div>
    </>
  );
}
