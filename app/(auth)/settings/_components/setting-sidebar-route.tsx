"use client"

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface SettingSidebarRouteProps {
  label: string;
  href: string;
  icon: LucideIcon;
}

export default function SettingSidebarRoute({
  label,
  href,
  icon: Icon,
}: SettingSidebarRouteProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = pathname?.startsWith(`${href}/`) || pathname === href;
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full flex items-center justify-start gap-x-2 text-slate-600 hover:text-sky-600 transition",
        isActive && "bg-sky-100 text-sky-600",
        )}
        onClick={() => router.push(href)}
    >
      <Icon className="w-5 h-5" />
      {label}
    </Button>
  );
}
