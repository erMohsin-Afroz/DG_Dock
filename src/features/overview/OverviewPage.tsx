
import {
  Network,
  Database,
  ClipboardList,
  Layers3,
  PanelsTopLeft,
  LaptopMinimal,
} from "lucide-react";

import ModuleCard from "./components/ModuleCard";

const modules = [
  {
    title: "Zustand Workspace",
    description:
      "Interactive project workspace to learn global state management with Zustand.",
    path: "/zustand",
    icon: Network,
  },
  {
    title: "TanStack Query Explorer",
    description:
      "Explore data fetching, caching, and mutations using TanStack Query.",
    path: "/query-explorer",
    icon: Database,
  },
  {
    title: "Form Studio",
    description:
      "Build and validate forms using React Hook Form.",
    path: "/form-studio",
    icon: ClipboardList,
  },
  {
    title: "Dynamic Form Builder",
    description:
      "Create configuration-driven, dynamic forms with real-time preview.",
    path: "/form-builder",
    icon: Layers3,
  },
  {
    title: "Component Gallery",
    description:
      "Explore and try out reusable UI components from shadcn/ui.",
    path: "/components",
    icon: PanelsTopLeft,
  },
];

function OverviewPage() {
  return (
    <div className="space-y-7">
      {/* Welcome Banner */}
      <section className="relative flex min-h-[190px] items-center overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100 px-6 py-8 dark:from-emerald-950 dark:via-green-950 dark:to-slate-900 sm:px-8 lg:px-10">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Welcome to DG Dock
          </h1>

          <p className="mt-3 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
            A place where manage different react modules.
          </p>
        </div>

        <div className="absolute -right-8 -bottom-16 hidden text-emerald-800/15 dark:text-emerald-300/15 md:block">
          <LaptopMinimal size={260} strokeWidth={0.8} />
        </div>

        <div className="absolute -right-10 top-0 size-48 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-400/10" />
      </section>

      {/* Learning Modules */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Learning Modules
          </h2>

          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Explore the following mini-apps, each focused on a key
            frontend concept or library.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {modules.map((module) => (
            <ModuleCard
              key={module.path}
              title={module.title}
              description={module.description}
              path={module.path}
              icon={module.icon}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default OverviewPage;
