import Navbar from "./_components/navbar";
import Sidebar from "./_components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <div className="h-[60px] md:pl-60 fixed inset-y-0 w-full z-50">
        <Navbar />
      </div>
      <div className="hidden md:flex h-full w-60 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="md:pl-60 pt-[60px] h-full">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
