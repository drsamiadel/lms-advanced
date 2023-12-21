"use client";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Presentation } from "lucide-react"
import { Button } from "@/components/ui/button";

export default function NavbarRoutes() {
    const pathname = usePathname();
    const router = useRouter();
    const isTeacher = pathname?.startsWith("/teacher");
    const isPlayer = pathname?.includes("/chapter");
  return (
    <div className="flex items-center">
        {isTeacher || isPlayer ? (
        <Button variant="ghost" onClick={
            () => router.push("/")
        }>
            <LogOut className="w-5 h-5 mr-2" />
            Exit
        </Button>
        ) : (
        <Button variant="ghost" onClick={
            () => router.push("/teacher/courses")
        }>
            <Presentation className="w-5 h-5 mr-2" />
            Teacher Mode
        </Button>
        )}
    </div>
  )
}
