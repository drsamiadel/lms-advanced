import { getCourses } from "@/actions/get-courses";
import CoursesList from "@/components/courses-list";
import { userSession } from "@/hooks/userSession";

export default async function WishlistPage() {
  const { id } = await userSession();
  const wishlist = await getCourses({ userId: id, wishlist: true });
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-sky-800">Wishlist</h1>
      <div className="mt-6">
        <CoursesList items={wishlist} />
      </div>
    </div>
  );
}
