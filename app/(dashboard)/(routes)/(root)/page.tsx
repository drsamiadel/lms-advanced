import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CoursesList from "@/components/courses-list";
import { CheckCircle, Clock } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import InfoCard from "./_components/info-cart";
import { IconBadge } from "@/components/icon-badge";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) return redirect("/");
  const { user } = session;

  const { completedCourses, coursesInProgress } = await getDashboardCourses(
    user.id
  );
  return (
    <div className="p-6 space-y-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>
      <div className="flex flex-col gap-y-10">
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
