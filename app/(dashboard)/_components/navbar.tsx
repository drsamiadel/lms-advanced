import MobileSidebar from "./mobile-sidebar";
import NavbarRoutes from "./navbar-routes";
import UserMenu from "./user-menu";

export default async function Navbar() {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <MobileSidebar />
      <div className="ml-auto flex items-center gap-x-4">
        <NavbarRoutes />
        <UserMenu />
      </div>
    </div>
  );
}
