import { Card, CardHeader, CardTitle,CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { LucideIcon } from "lucide-react";

type DataCardProps = {
  value: number;
  label: string;
  shouldFormat?: boolean;
  icon?: LucideIcon;
};

export default function DataCard({
  value,
  label,
  shouldFormat,
  icon: Icon,
}: DataCardProps) {
  return (
    <Card>
      <CardHeader className="felx flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-700">{label}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between">
        <div className="text-2xl font-bold text-sky-600">
            {shouldFormat ? formatPrice(value) : value}
        </div>
        {Icon && <Icon className="text-gray-400" size={32} />}
      </CardContent>
    </Card>
  );
}
