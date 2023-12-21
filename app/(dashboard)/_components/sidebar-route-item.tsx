"use client";

import { usePathname, useRouter } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarRouteItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
}

export default function SidebarRouteItem({
  href,
  label,
  icon: Icon,
}: SidebarRouteItemProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive =
    (pathname === "/" && href === "/") ||
    pathname?.startsWith(`${href}/`) ||
    pathname === href;
  const onClick = () => router.push(href);

  return (
    <button
      className={cn(
        "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
        isActive &&
          "text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700"
      )}
      onClick={onClick}
      type="button"
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn("text-slate-500", isActive && "text-sky-700")}
        />
        {label}
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-sky-700 h-full transition-all",
          isActive && "opacity-100"
        )}
      />
    </button>
  );
}
