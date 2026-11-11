import { useState } from "react";
import {
  ChevronDown,
  LayoutGrid,
  List,
  Check,
} from "lucide-react";

import { useWorkspaceStore } from "../store/workspaceStore";

function WorkspaceActions() {
  const [isOpen, setIsOpen] = useState(false);

  const layout = useWorkspaceStore((state) => state.layout);
  const setLayout = useWorkspaceStore((state) => state.setLayout);

  const handleLayoutChange = (newLayout: "grid" | "list") => {
    setLayout(newLayout);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-expanded={isOpen}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted"
      >
        Actions
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            aria-label="Close actions menu"
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-border bg-card p-1.5 shadow-lg">
            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Change Layout
            </p>

            <button
              type="button"
              onClick={() => handleLayoutChange("grid")}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-muted"
            >
              <span className="flex items-center gap-2">
                <LayoutGrid size={17} />
                Grid View
              </span>

              {layout === "grid" && (
                <Check size={16} className="text-emerald-600" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleLayoutChange("list")}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm text-foreground hover:bg-muted"
            >
              <span className="flex items-center gap-2">
                <List size={17} />
                List View
              </span>

              {layout === "list" && (
                <Check size={16} className="text-emerald-600" />
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default WorkspaceActions;