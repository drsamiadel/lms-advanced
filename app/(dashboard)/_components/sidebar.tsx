import Logo from "./logo";
import SidebarRoutes from "./sidebar-routes";

export default function Sidebar () {
    return (
        <div className="h-full border-r flex flex-col bg-white shadow-sm overflow-y-auto">
            <div className="p-6">
                <Logo />
            </div>
            <div className="flex flex-col w-full">
                <SidebarRoutes />
            </div>
        </div>
    )
}