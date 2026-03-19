import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--color-background)]">
      <LeftSidebar />
      <main className="flex-1 relative overflow-hidden">
        {children}
      </main>
      <RightSidebar />
    </div>
  );
}
