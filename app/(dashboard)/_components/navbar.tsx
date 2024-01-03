import { getUserRole } from "@/actions/get-user-role";
import MobileSidebar from "./mobile-sidebar";
import NavbarRoutes from "./navbar-routes";
import UserMenu from "./user-menu";

export default async function Navbar() {
  const { role } = await getUserRole();
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <MobileSidebar />
      <NavbarRoutes role={role!} />
      <UserMenu />
    </div>
  );
}
