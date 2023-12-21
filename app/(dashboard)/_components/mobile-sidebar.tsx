import { Menu } from "lucide-react";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import Sidebar from "./sidebar";

export default function MobileSidebar() {
  return (
    <Sheet>
        <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
        </SheetTrigger>
        <SheetContent className="bg-white shadow-lg p-0" side="left">
            <Sidebar />
        </SheetContent>
    </Sheet>
  )
}
