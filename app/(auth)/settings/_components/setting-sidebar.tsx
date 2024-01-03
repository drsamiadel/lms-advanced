import React from "react";
import SettingSidebarRoutes from "./setting-sidebar-routes";

export default function SettingSidebar() {
  return (
    <div className="overflow-y-auto w-60 hidden md:block">
      <SettingSidebarRoutes />
    </div>
  );
}
