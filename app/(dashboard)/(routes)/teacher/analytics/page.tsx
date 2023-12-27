import { getAnalytics } from "@/actions/get-analytics";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import DataCard from "./_components/data-card";
import Chart from "./_components/chart";

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  const { user } = session;

  const {
    data,
    totalRevenue,
    totalSales
  } = await getAnalytics(user.id);

  return <div className="p-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <DataCard label="Total Revenue" value={totalRevenue} shouldFormat={true} />
      <DataCard label="Total Sales" value={totalSales} />
    </div>
    <Chart data={data} />
  </div>;
}
