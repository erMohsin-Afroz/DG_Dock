
import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Menu,
  X,
  Code2,
  Home,
  Network,
  Database,
  ClipboardList,
  Layers3,
  PanelsTopLeft,
  Settings,
  Sun,
  Moon,
  ChevronDown,
  RotateCcw,
} from "lucide-react";

import { useWorkspaceStore } from "@/features/zustand/store/workspaceStore";

const navigationItems = [
  { title: "Overview", path: "/", icon: Home },
  { title: "Zustand Workspace", path: "/zustand", icon: Network },
  { title: "Query Explorer", path: "/query-explorer", icon: Database },
  { title: "Form Studio", path: "/form-studio", icon: ClipboardList },
  { title: "Form Builder", path: "/form-builder", icon: Layers3 },
  { title: "UI Gallery", path: "/components", icon: PanelsTopLeft },
];

function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const theme = useWorkspaceStore((state) => state.theme);
  const setTheme = useWorkspaceStore((state) => state.setTheme);

  const density = useWorkspaceStore((state) => state.density);
  const setDensity = useWorkspaceStore((state) => state.setDensity);

  const settingsOpen = useWorkspaceStore(
    (state) => state.isSettingsPanelOpen
  );
  const setSettingsPanelOpen = useWorkspaceStore(
    (state) => state.setSettingsPanelOpen
  );

  const resetPreferences = useWorkspaceStore(
    (state) => state.resetPreferences
  );

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        className="flex size-10 items-center justify-center rounded-lg border border-border text-foreground hover:bg-muted"
      >
        <Menu size={22} />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
        className={`fixed inset-y-0 left-0 z-[60] flex w-[280px] flex-col border-r border-border bg-card shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >

        <div className="flex items-center justify-between border-b border-border px-5 py-6">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-700 text-white">
              <Code2 size={25} />
            </div>

            <div>
              <h2 className="font-bold text-foreground">DG Dock</h2>
              <p className="text-xs text-muted-foreground">
                A place for Developers.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation menu"
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
          >
            <X size={20} />
          </button>
        </div>


        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
                      : "text-foreground hover:bg-muted"
                  }`
                }
              >
                <Icon size={21} />
                {item.title}
              </NavLink>
            );
          })}
        </nav>


        <div className="border-t border-border p-4">
          <button
            type="button"
            onClick={() => setSettingsPanelOpen(!settingsOpen)}
            aria-expanded={settingsOpen}
            className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-muted"
          >
            <span className="flex items-center gap-3">
              <Settings size={21} />
              Settings
            </span>

            <ChevronDown
              size={17}
              className={`transition-transform ${
                settingsOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {settingsOpen && (
            <div className="mt-3 space-y-4 px-4 pb-2">

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Appearance
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    aria-pressed={theme === "light"}
                    className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                      theme === "light"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Sun size={16} />
                    Light
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    aria-pressed={theme === "dark"}
                    className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                      theme === "dark"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Moon size={16} />
                    Dark
                  </button>
                </div>
              </div>

            
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Display Density
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDensity("comfortable")}
                    aria-pressed={density === "comfortable"}
                    className={`rounded-lg border px-2 py-2 text-xs ${
                      density === "comfortable"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    Comfortable
                  </button>

                  <button
                    type="button"
                    onClick={() => setDensity("compact")}
                    aria-pressed={density === "compact"}
                    className={`rounded-lg border px-2 py-2 text-xs ${
                      density === "compact"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    Compact
                  </button>
                </div>
              </div>

            
              <button
                type="button"
                onClick={resetPreferences}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <RotateCcw size={15} />
                Reset to Default
              </button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

export default MobileNav;
