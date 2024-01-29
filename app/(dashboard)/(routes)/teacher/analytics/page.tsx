import { getAnalytics } from "@/actions/get-analytics";
import DataCard from "./_components/data-card";
import Chart from "./_components/chart";
import { BarChart2Icon, DollarSign, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { userSession } from "@/hooks/userSession";

export default async function AnalyticsPage() {
  const { id } = await userSession();

  const { data, totalRevenue, totalSales, totalStudents } = await getAnalytics(id);

  return (
    <div className="p-6 space-y-6 md:space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <DataCard
          label="Total Revenue"
          value={totalRevenue}
          shouldFormat={true}
          icon={DollarSign}
        />
        <DataCard label="Total Sales" value={totalSales} icon={BarChart2Icon} />
        <DataCard label="Students" value={totalStudents} icon={Users} />
      </div>
      <Separator />
      <h2 className="text-2xl font-bold text-slate-700">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Chart data={data} />
      </div>
    </div>
  );
}
