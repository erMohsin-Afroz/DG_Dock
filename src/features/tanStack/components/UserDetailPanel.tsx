
import {
  X,
  Mail,
  Building2,
  ShieldCheck,
  CalendarDays,
  UserRound,
} from "lucide-react";

import { useUser } from "../hooks/useUsers";

interface UserDetailPanelProps {
  userId: string | null;
  shouldFail: boolean;
  onClose: () => void;
}

function UserDetailPanel({
  userId,
  shouldFail,
  onClose,
}: UserDetailPanelProps) {
  const {
    data: user,
    isPending,
    isError,
    error,
    isFetching,
    refetch,
  } = useUser(userId, shouldFail);

  if (!userId) return null;

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            User Details
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Data fetched using a dependent query.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close user details"
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
        >
          <X size={18} />
        </button>
      </div>

      {isPending ? (
        <div className="space-y-4">
          <div className="h-6 w-40 animate-pulse rounded bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
          <p className="text-sm font-medium text-red-700 dark:text-red-300">
            {error.message}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900"
          >
            Retry
          </button>
        </div>
      ) : user ? (
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex size-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              <UserRound size={26} />
            </div>

            <div className="min-w-0">
              <h3 className="font-semibold text-foreground">
                {user.name}
              </h3>

              <p className="text-sm text-muted-foreground">
                {user.role}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Mail size={18} className="mt-0.5 text-muted-foreground" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="break-all text-sm font-medium text-foreground">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building2
                size={18}
                className="mt-0.5 text-muted-foreground"
              />
              <div>
                <p className="text-xs text-muted-foreground">Company</p>
                <p className="text-sm font-medium text-foreground">
                  {user.company}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck
                size={18}
                className="mt-0.5 text-muted-foreground"
              />
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p
                  className={`text-sm font-medium ${
                    user.status === "Active"
                      ? "text-emerald-600"
                      : "text-muted-foreground"
                  }`}
                >
                  {user.status}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CalendarDays
                size={18}
                className="mt-0.5 text-muted-foreground"
              />
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="text-sm font-medium text-foreground">
                  {user.createdAt}
                </p>
              </div>
            </div>
          </div>

          {isFetching && (
            <p className="text-xs text-muted-foreground">
              Refreshing user details...
            </p>
          )}
        </div>
      ) : null}
    </section>
  );
}

export default UserDetailPanel;
