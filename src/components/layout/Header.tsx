
import { useEffect, useMemo, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Home,
  Search,
  ChevronRight,
  Command,
  X,
  ArrowRight,
} from "lucide-react";

import MobileNav from "./MobileNav";
import { useWorkspaceStore } from "@/features/zustand/store/workspaceStore";

const pageTitles: Record<string, string> = {
  "/": "Overview",
  "/zustand": "Zustand Workspace",
  "/query-explorer": "Query Explorer",
  "/form-studio": "Form Studio",
  "/form-builder": "Form Builder",
  "/components": "UI Gallery",
};

const commandItems = [
  { title: "Overview", path: "/", description: "Dashboard overview" },
  { title: "Zustand Workspace", path: "/zustand", description: "Manage workspaces and projects" },
  { title: "Query Explorer", path: "/query-explorer", description: "Explore TanStack Query" },
  { title: "Form Studio", path: "/form-studio", description: "React Hook Form module" },
  { title: "Form Builder", path: "/form-builder", description: "Build dynamic forms" },
  { title: "UI Gallery", path: "/components", description: "Explore UI components" },
];

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const isCommandPanelOpen = useWorkspaceStore(
    (state) => state.isCommandPanelOpen
  );

  const setCommandPanelOpen = useWorkspaceStore(
    (state) => state.setCommandPanelOpen
  );

  const currentPage =
    pageTitles[location.pathname] ?? "Page Not Found";

  const filteredItems = useMemo(() => {
    return commandItems.filter((item) =>
      `${item.title} ${item.description}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        setCommandPanelOpen(true);
      }

      if (event.key === "Escape") {
        setCommandPanelOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setCommandPanelOpen]);

  const handleCommandSelect = (path: string) => {
    navigate(path);
    setCommandPanelOpen(false);
    setSearch("");
  };

  useEffect(() => {
    if (!isCommandPanelOpen) {
      setSearch("");
    }
  }, [isCommandPanelOpen]);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-3 border-b border-border bg-white shadow-[0_4px_16px_rgba(15,23,42,0.07)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.25)] dark:bg-gray-900 px-4 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <MobileNav />

          <Link
            to="/"
            aria-label="Go to overview"
            className="shrink-0 text-muted-foreground transition-colors hover:text-emerald-700 dark:hover:text-emerald-400"
          >
            <Home size={22} />
          </Link>

          <ChevronRight
            size={17}
            className="shrink-0 text-muted-foreground"
          />

          <h2 className="truncate text-sm font-medium text-foreground sm:text-base">
            {currentPage}
          </h2>
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:gap-5">
          <button
            type="button"
            onClick={() => setCommandPanelOpen(true)}
            aria-label="Open command panel"
            className="relative hidden h-11 w-52 items-center gap-2 rounded-xl border border-input bg-background px-3 text-sm text-muted-foreground transition-colors hover:bg-muted md:flex lg:w-72"
          >
            <Search size={18} />
            <span className="flex-1 text-left">
              Search
            </span>

            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs">
              Ctrl K
            </kbd>
          </button>

          <button
            type="button"
            onClick={() => setCommandPanelOpen(true)}
            aria-label="Open command panel"
            className="flex size-10 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted md:hidden"
          >
            <Search size={19} />
          </button>

          <button
            type="button"
            aria-label="User profile placeholder"
            className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-100"
          >
            JD
          </button>
        </div>
      </header>

      {isCommandPanelOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 px-4 pt-[15vh]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setCommandPanelOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="command-panel-title"
            className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
          >

            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search
                size={20}
                className="shrink-0 text-muted-foreground"
              />

              <input
                autoFocus
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search modules or commands..."
                aria-label="Search modules or commands"
                className="h-14 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />

              <button
                type="button"
                onClick={() => setCommandPanelOpen(false)}
                aria-label="Close command panel"
                className="rounded-md p-2 text-muted-foreground hover:bg-muted"
              >
                <X size={18} />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto p-2">
              <p
                id="command-panel-title"
                className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Available Modules
              </p>

              {filteredItems.length === 0 ? (
                <div className="px-3 py-10 text-center">
                  <Command
                    size={28}
                    className="mx-auto mb-2 text-muted-foreground"
                  />

                  <p className="text-sm font-medium text-foreground">
                    No results found
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Try searching with another keyword.
                  </p>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => handleCommandSelect(item.path)}
                    className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-muted"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {item.title}
                      </p>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>

                    <ArrowRight
                      size={17}
                      className="shrink-0 text-muted-foreground"
                    />
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
              <span>Navigate to a module</span>
              <span>ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
