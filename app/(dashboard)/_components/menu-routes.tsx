
"use client"

import { HelpCircle, LogOut, Settings } from "lucide-react";
import MeunRouteItem from "./menu-route-item";

const menuRoutes = [
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
    },
    {
      label: "Support",
      href: "/support",
      icon: HelpCircle,
    },
    {
      label: "Logout",
      href: "#",
      icon: LogOut,
    }
  ];

export default function MenuRoutes() {
  return (
    <>
    {menuRoutes.map((menuItem, i) => (
        <MeunRouteItem key={i} label={menuItem.label} href={menuItem.href} icon={menuItem.icon}  />
    ))}
    </>
  )
  
}
