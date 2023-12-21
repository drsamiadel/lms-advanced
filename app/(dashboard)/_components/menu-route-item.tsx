"use client";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface MenuRouteItemProps {
  label: string;
  href: string;
  icon: LucideIcon;
}

export default function MeunRouteItem({
  label,
  href,
  icon: Icon,
}: MenuRouteItemProps) {
  if (label === "Logout")
    return (
      <button
        className="flex items-center w-full text-sm rounded-sm p-2 text-red-500 hover:text-red-600 hover:bg-red-300/20 transition-all"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        <Icon className="w-4 h-4 mr-2" />
        {label}
      </button>
    );
  return (
    <Link
      href={href}
      className="flex items-center w-full text-sm rounded-sm p-2 text-slate-500 hover:text-slate-600 hover:bg-slate-300/20 transition-all"
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </Link>
  );
}
