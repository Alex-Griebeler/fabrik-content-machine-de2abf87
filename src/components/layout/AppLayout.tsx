import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 pb-20 md:pb-0 md:ml-64 overflow-y-auto min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-6 md:px-8 md:py-10">
          <Outlet />
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
