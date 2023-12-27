"use client";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/search-input";

export default function NavbarRoutes() {
  const pathname = usePathname();
  const router = useRouter();
  const isTeacher = pathname?.startsWith("/teacher");
  const isPlayer = pathname?.includes("/courses");
  const isSearch = pathname === "/search";
  return (
    <>
      {isSearch && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex items-center ml-auto mr-2">
        {isTeacher || isPlayer ? (
          <Button variant="ghost" onClick={() => router.push("/")}>
            <LogOut className="w-5 h-5 mr-2" />
            Exit
          </Button>
        ) : (
          <Button
            variant="ghost"
            onClick={() => router.push("/teacher/courses")}
          >
            <Presentation className="w-5 h-5 mr-2" />
            Teacher Mode
          </Button>
        )}
      </div>
    </>
  );
}
