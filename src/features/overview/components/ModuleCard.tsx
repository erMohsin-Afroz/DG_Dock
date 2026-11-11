
import { ArrowRight, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface ModuleCardProps {
  title: string;
  description: string;
  path: string;
  icon: LucideIcon;
}

function ModuleCard({
  title,
  description,
  path,
  icon: Icon,
}: ModuleCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center">
      <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
        <Icon size={28} strokeWidth={1.8} />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-lg font-semibold text-card-foreground">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {description}
        </p>

        <p className="mt-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
          Not started
        </p>
      </div>

      <Link
        to={path}
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
      >
        Open Module
        <ArrowRight size={17} />
      </Link>
    </div>
  );
}

export default ModuleCard;
