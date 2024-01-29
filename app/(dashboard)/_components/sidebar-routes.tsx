"use client";

import { Layout, Compass, List, BarChart, Banknote, Heart } from "lucide-react";
import SidebarRouteItem from "./sidebar-route-item";
import { usePathname } from "next/navigation";

const studentRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    path: "/",
  },
  {
    icon: Compass,
    label: "Browse",
    path: "/search",
  },
  {
    icon: Heart,
    label: "Wishlist",
    path: "/wishlist",
  }
];

const teacherRoutes = [
  {
    icon: List,
    label: "Courses",
    path: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analytics",
    path: "/teacher/analytics",
  },
  {
    icon: Banknote,
    label: "Payment",
    path: "/payment",
  }
];

export default function SidebarRoutes() {
  const pathname = usePathname();
  const isTeacher = pathname?.includes("/teacher");
  const routes = isTeacher ? teacherRoutes : studentRoutes;
  return (
    <div className="flex flex-col w-full">
      {routes.map((route, index) => (
        <SidebarRouteItem
          key={index}
          icon={route.icon}
          label={route.label}
          href={route.path}
        />
      ))}
    </div>
  );
}
