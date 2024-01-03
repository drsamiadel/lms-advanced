import Link from "next/link";
import SettingSidebar from "./_components/setting-sidebar";
import { ArrowLeft } from "lucide-react";

export default function SettingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-4xl mx-auto mt-4 md:mt-20 lg:mt-32 flex flex-col gap-y-0 md:gap-y-8 px-2">
      <Link href="/" className="flex items-center gap-x-2 text-slate-600 hover:text-sky-600 transition">
        <ArrowLeft /> Back to home
      </Link>
      <div className="flex gap-x-4">
        <SettingSidebar />
        <div className="flex-1 overflow-y-auto p-6 border rounded-md">
          {children}
        </div>
      </div>
    </div>
  );
}
