import { IconBadge } from "@/components/icon-badge";
import { LucideIcon } from "lucide-react";

interface InfoCardProps {
  label: string;
  icon: LucideIcon;
  numberOfItems: number;
  variant?: "default" | "success";
}

export default function InfoCard({
  label,
  icon: Icon,
  numberOfItems,
  variant,
}: InfoCardProps) {
  return (
    <div className="border rounded-md flex items-center gap-x-2 p-3 bg-slate-200/20 hover:bg-slate-300/20 cursor-pointer">
      <IconBadge variant={variant} icon={Icon} />
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-gray-500 text-sm">{numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}</p>
      </div>
    </div>
  );
}
