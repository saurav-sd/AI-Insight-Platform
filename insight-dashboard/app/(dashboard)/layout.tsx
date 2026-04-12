import Sidebar from "@/components/layout/Sidebar";
import Headers from "@/components/layout/Header";
import AIChat from "@/components/features/dashboard/components/AIChat";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#0B0F19] text-white">

      {/* SIDEBAR */}
      <aside className="w-64 fixed h-full border-r border-white/10">
        <Sidebar />
      </aside>

      {/* MAIN */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* HEADER */}
        <Headers />

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
          <AIChat/>
        </main>
      </div>
    </div>
  );
}