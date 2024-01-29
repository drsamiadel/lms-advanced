import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import CoursesList from "@/components/courses-list";
import { IconBadge } from "@/components/icon-badge";
import { Separator } from "@/components/ui/separator";
import { userSession } from "@/hooks/userSession";
import { CheckCircle, Clock, Heart } from "lucide-react";
import InfoCard from "./_components/info-cart";

export default async function Dashboard() {
  const { id } = await userSession();

  const { completedCourses, coursesInProgress, coursesInWishlist } = await getDashboardCourses(id);
  return (
    <div className="p-6 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={completedCourses.length}
          variant="success"
        />
        <InfoCard icon={Heart} label="Wishlist" numberOfItems={coursesInWishlist.length} />
      </div>
      <Separator />
      <div className="grid grid-cols-1 gap-y-5">
        <div className="flex flex-col gap-y-4">
          <div className="flex items-center gap-x-2">
            <IconBadge variant="default" icon={Clock} />
            <div className="text-xl">
              Continue learning
              <p className="text-gray-500 text-sm">
                Courses you have started but not completed
              </p>
            </div>
          </div>
          <CoursesList items={[...coursesInProgress]} />
        </div>
        <div className="flex flex-col gap-y-4">
          <div className="flex items-center gap-x-2">
            <IconBadge variant="success" icon={CheckCircle} />
            <div className="text-lg">
              Completed courses
              <p className="text-gray-500 text-sm">
                Courses you have completed
              </p>
            </div>
          </div>
          <CoursesList items={[...completedCourses]} />
        </div>
      </div>
    </div>
  );
}
