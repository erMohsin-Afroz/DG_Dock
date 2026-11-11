import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

import Sidebar from "./Sidebar";
import Header from "./Header";

import { useWorkspaceStore } from "@/features/zustand/store/workspaceStore";

function AppLayout() {
  const theme = useWorkspaceStore((state) => state.theme);
  const density = useWorkspaceStore((state) => state.density);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      theme === "dark"
    );
  }, [theme]);

  return (
    <div
      className={`min-h-screen bg-background text-foreground ${
        density === "compact" ? "density-compact" : "density-comfortable"
      }`}
    >
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] shadow-[4px_0_18px_rgba(15,23,42,0.08)] dark:shadow-[4px_0_18px_rgba(0,0,0,0.25)] lg:block">
        <Sidebar />
      </aside>

      <div className="flex min-h-screen min-w-0 flex-col lg:ml-[280px]">
        <Header />

        <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      <Toaster
        position="bottom-right"
        richColors
        closeButton
        duration={3000}
      />
    </div>
  );
}

export default AppLayout;