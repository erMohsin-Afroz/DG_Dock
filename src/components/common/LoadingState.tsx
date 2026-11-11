
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps {
  rows?: number;
}

function LoadingState({ rows = 3 }: LoadingStateProps) {
  return (
    <div className="space-y-4" aria-label="Loading content" role="status">
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 rounded-xl border border-gray-200 p-4"
        >
          <Skeleton className="size-12 rounded-lg" />

          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      ))}

      <span className="sr-only">Loading, please wait...</span>
    </div>
  );
}

export default LoadingState;
