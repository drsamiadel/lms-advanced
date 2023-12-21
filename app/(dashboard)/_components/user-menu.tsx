import Avatar from "@/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MenuRoutes from "./menu-routes";



export default function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:outline-0">
        <Avatar />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-2 mr-1 min-w-40">
        <MenuRoutes />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
