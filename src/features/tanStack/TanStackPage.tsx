import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useRef, useState } from "react";
import {
  Search,
  Plus,
  RefreshCw,
  ArrowUpDown,
  Eye,
  Pencil,
  Trash2,
  Users,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  WifiOff,
} from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import ConfirmDialog from "@/components/common/ConfirmDialog";

import UserFormDialog from "./components/UserFormDialog";
import UserDetailPanel from "./components/UserDetailPanel";

import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "./hooks/useUsers";

import type {
  User,
  UserInput,
  UserRole,
  UserStatus,
  UserSortField,
  UserFilters,
} from "./types";

const initialFilters: UserFilters = {
  search: "",
  role: "All",
  status: "All",
  sortBy: "name",
  sortOrder: "asc",
  page: 1,
  pageSize: 5,
};

function TanStackPage() {
  const [filters, setFilters] = useState<UserFilters>(initialFilters);

  const [shouldFail, setShouldFail] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(
    null
  );

const userDetailsRef = useRef<HTMLDivElement>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  // Queries
  const {
    data,
    isPending,
    isError,
    error,
    isFetching,
    refetch,
  } = useUsers(filters, shouldFail);

  // Mutations
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const isSubmitting =
    createMutation.isPending || updateMutation.isPending;

  const mutationError =
    createMutation.error ??
    updateMutation.error ??
    deleteMutation.error;

  // Keep current page valid after filtering or deletion
  useEffect(() => {
    if (!data) return;

    if (data.totalPages > 0 && filters.page > data.totalPages) {
      setFilters((previous) => ({
        ...previous,
        page: data.totalPages,
      }));
    }

    if (data.totalPages === 0 && filters.page !== 1) {
      setFilters((previous) => ({
        ...previous,
        page: 1,
      }));
    }
  }, [data, filters.page]);

  useEffect(() => {
  if (!selectedUserId) return;

  userDetailsRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}, [selectedUserId]);

  // Filter Update
  const updateFilter = <K extends keyof UserFilters>(
    key: K,
    value: UserFilters[K]
  ) => {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
      page: 1,
    }));
  };

  // Open Create Dialog
  const openCreateDialog = () => {
    setEditingUser(null);
    setIsFormOpen(true);
    createMutation.reset();
    updateMutation.reset();
  };

  // Open Edit Dialog
  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
    createMutation.reset();
    updateMutation.reset();
  };

  // Create / Update User
  const handleUserSubmit = (formData: UserInput) => {
    if (editingUser) {
      updateMutation.mutate(
        {
          id: editingUser.id,
          data: formData,
          shouldFail,
        },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            setEditingUser(null);
          },
        }
      );
    } else {
      createMutation.mutate(
        {
          data: formData,
          shouldFail,
        },
        {
          onSuccess: () => {
            setIsFormOpen(false);
          },
        }
      );
    }
  };

  // Delete User
  const handleDeleteUser = () => {
    if (!deletingUser) return;

    deleteMutation.mutate(
      {
        id: deletingUser.id,
        shouldFail,
      },
      {
        onSuccess: () => {
          if (selectedUserId === deletingUser.id) {
            setSelectedUserId(null);
          }

          setDeletingUser(null);
        },
        onError: () => {
          setDeletingUser(null);
        },
      }
    );
  };

  // Reset Filters
  const resetFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="TanStack Query Data Explorer"
        description="Explore server-state management with queries, caching and mutations."
        action={
          <button
            type="button"
            onClick={openCreateDialog}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
          >
            <Plus size={17} />
            Add User
          </button>
        }
      />

      {/* Overview */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Total Users
            </p>

            <Users size={19} className="text-muted-foreground" />
          </div>

          <h3 className="mt-2 text-2xl font-bold text-foreground">
            {data?.total ?? "—"}
          </h3>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Current Page
          </p>

          <h3 className="mt-2 text-2xl font-bold text-foreground">
            {data ? `${data.page} / ${Math.max(data.totalPages, 1)}` : "—"}
          </h3>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Cache Status
          </p>

          <h3 className="mt-2 text-2xl font-bold text-emerald-600">
            {isFetching ? "Fetching..." : data ? "Cached" : "Waiting"}
          </h3>
        </div>
      </section>

      {/* Failure Simulation */}
      <section
        className={`flex flex-col justify-between gap-3 rounded-xl border p-4 sm:flex-row sm:items-center ${
          shouldFail
            ? "border-red-300 bg-red-50 dark:border-red-900 dark:bg-red-950"
            : "border-border bg-card"
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`mt-0.5 rounded-lg p-2 ${
              shouldFail
                ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <WifiOff size={19} />
          </div>

          <div>
            <p className="font-medium text-foreground">
              API Failure Simulation
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Turn this on to simulate a failed API request.
            </p>
          </div>
        </div>

        <label className="inline-flex cursor-pointer items-center gap-3">
          <span className="text-sm font-medium text-foreground">
            {shouldFail ? "Failure Enabled" : "Failure Disabled"}
          </span>

          <input
            type="checkbox"
            checked={shouldFail}
            onChange={(event) => {
              setShouldFail(event.target.checked);
            }}
            className="size-4 accent-red-600"
          />
        </label>
      </section>

      {/* Search and Filters */}
      <section className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-foreground">
              Search and Filters
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Find users using search, role and status.
            </p>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="text-sm font-medium text-emerald-700 hover:text-emerald-800 dark:text-emerald-400"
          >
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {/* Search */}
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />

            <input
              type="search"
              value={filters.search}
              onChange={(event) =>
                updateFilter("search", event.target.value)
              }
              placeholder="Search name, email, company..."
              className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          {/* Role Filter */}
          <select
            value={filters.role}
            onChange={(event) =>
              updateFilter(
                "role",
                event.target.value as UserRole | "All"
              )
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
            <option value="Viewer">Viewer</option>
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(event) =>
              updateFilter(
                "status",
                event.target.value as UserStatus | "All"
              )
            }
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          {/* Sorting */}
          <div className="flex gap-2">
            <select
              value={filters.sortBy}
              onChange={(event) =>
                updateFilter(
                  "sortBy",
                  event.target.value as UserSortField
                )
              }
              className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="company">Company</option>
              <option value="createdAt">Created Date</option>
            </select>

            <button
              type="button"
              title="Change sort order"
              onClick={() =>
                updateFilter(
                  "sortOrder",
                  filters.sortOrder === "asc" ? "desc" : "asc"
                )
              }
              className="inline-flex shrink-0 items-center justify-center rounded-lg border border-border px-3 text-foreground transition-colors hover:bg-muted"
            >
              <ArrowUpDown size={17} />
              <span className="ml-1 text-xs">
                {filters.sortOrder.toUpperCase()}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Users Table */}
      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-col justify-between gap-3 border-b border-border p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-foreground">
              Users
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {data
                ? `${data.total} users found`
                : "Loading user records..."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={isFetching ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Background Refetch Indicator */}
        {isFetching && !isPending && (
          <div className="flex items-center gap-2 border-b border-border bg-muted/40 px-5 py-2 text-xs text-muted-foreground">
            <RefreshCw size={13} className="animate-spin" />
            Updating data in the background...
          </div>
        )}

        {/* Initial Loading */}
        {isPending ? (
          <div className="space-y-4 p-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-4"
              >
                <div className="size-10 animate-pulse rounded-full bg-muted" />

                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                </div>

                <div className="h-7 w-20 animate-pulse rounded-full bg-muted" />
              </div>
            ))}
          </div>
        ) : isError ? (
          /* Error State */
          <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
            <div className="mb-3 rounded-full bg-red-50 p-3 text-red-600 dark:bg-red-950 dark:text-red-400">
              <AlertCircle size={28} />
            </div>

            <h3 className="font-semibold text-foreground">
              Unable to load users
            </h3>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              {error.message}
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
            >
              <RefreshCw size={15} />
              Retry Request
            </button>
          </div>
        ) : data && data.data.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
            <Users size={36} className="mb-3 text-muted-foreground" />

            <h3 className="font-semibold text-foreground">
              No users found
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Try changing your search or filter criteria.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 text-sm font-medium text-emerald-700 hover:text-emerald-800 dark:text-emerald-400"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          /* User Records */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Company</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {data?.data.map((user) => (
                  <tr
                    key={user.id}
                    className={`transition-colors hover:bg-muted/40 ${
                      selectedUserId === user.id ? "bg-emerald-50/50 dark:bg-emerald-950/20" : ""
                    }`}
                  >
                    <td className="px-5 py-4">
                      <div className="font-medium text-foreground">
                        {user.name}
                      </div>

                      <div className="mt-1 text-xs text-muted-foreground">
                        {user.email}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-muted-foreground">
                      {user.company}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                        {user.role}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          user.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          title="View details"
                          onClick={() => setSelectedUserId(user.id)}
                          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          type="button"
                          title="Edit user"
                          onClick={() => openEditDialog(user)}
                          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          title="Delete user"
                          onClick={() => {
                            deleteMutation.reset();
                            setDeletingUser(user);
                          }}
                          className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isPending && !isError && data && data.total > 0 && (
          <div className="flex flex-col justify-between gap-3 border-t border-border p-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Rows per page</span>

              <select
                value={filters.pageSize}
                onChange={(event) =>
                  updateFilter("pageSize", Number(event.target.value))
                }
                className="rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>

              <span>
                Showing {Math.min((data.page - 1) * data.pageSize + 1, data.total)}
                {" - "}
                {Math.min(data.page * data.pageSize, data.total)}
                {" of "}
                {data.total}
              </span>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={filters.page <= 1 || isFetching}
                onClick={() =>
                  setFilters((previous) => ({
                    ...previous,
                    page: previous.page - 1,
                  }))
                }
                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <span className="px-2 text-sm text-muted-foreground">
                {data.page} / {Math.max(data.totalPages, 1)}
              </span>

              <button
                type="button"
                disabled={
                  filters.page >= data.totalPages || isFetching
                }
                onClick={() =>
                  setFilters((previous) => ({
                    ...previous,
                    page: previous.page + 1,
                  }))
                }
                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Mutation Error */}
      {mutationError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950"
        >
          <AlertCircle
            size={19}
            className="mt-0.5 shrink-0 text-red-600 dark:text-red-400"
          />

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-red-700 dark:text-red-300">
              Operation failed
            </p>

            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {mutationError.message}
            </p>
          </div>
        </div>
      )}

      {/* Selected User Detail */}
      <div
        ref={userDetailsRef}
        className="scroll-mt-24"
      >
        <UserDetailPanel
          userId={selectedUserId}
          shouldFail={shouldFail}
          onClose={() => setSelectedUserId(null)}
        />
      </div>

      {/* Create / Edit User Dialog */}
      <UserFormDialog
        open={isFormOpen}
        initialUser={editingUser}
        isSubmitting={isSubmitting}
        onClose={() => {
          setIsFormOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleUserSubmit}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deletingUser)}
        onOpenChange={(open) => {
          if (!open) setDeletingUser(null);
        }}
        title="Delete User?"
        description={`Are you sure you want to delete ${deletingUser?.name ?? "this user"}? This action cannot be undone.`}
        confirmLabel="Delete User"
        cancelLabel="Cancel"
        onConfirm={handleDeleteUser}
      />
       <ReactQueryDevtools initialIsOpen={false} />
    </div>
  );
}

export default TanStackPage;
