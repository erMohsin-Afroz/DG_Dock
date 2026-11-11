
import { useState, type FormEvent } from "react";
import {
  FolderKanban,
  Archive,
  ArchiveRestore,
  Pencil,
  X,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { useWorkspaceStore } from "../store/workspaceStore";

function ProjectList() {
  const [showArchived, setShowArchived] = useState(false);
  const [editingProjectId, setEditingProjectId] =
    useState<string | null>(null);
  const [projectName, setProjectName] = useState("");
  const [deletingProjectId, setDeletingProjectId] =
    useState<string | null>(null);

  const projects = useWorkspaceStore((state) => state.projects);
  const layout = useWorkspaceStore((state) => state.layout);

  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId
  );

  const activeProjectId = useWorkspaceStore(
    (state) => state.activeProjectId
  );

  const setActiveProject = useWorkspaceStore(
    (state) => state.setActiveProject
  );

  const renameProject = useWorkspaceStore(
    (state) => state.renameProject
  );

  const archiveProject = useWorkspaceStore(
    (state) => state.archiveProject
  );

  const unarchiveProject = useWorkspaceStore(
    (state) => state.unarchiveProject
  );

  const deleteProject = useWorkspaceStore(
    (state) => state.deleteProject
  );

  const projectToDelete = projects.find(
    (project) => project.id === deletingProjectId
  );

  const filteredProjects = projects.filter(
    (project) =>
      project.workspaceId === activeWorkspaceId &&
      project.isArchived === showArchived
  );

  // Rename Project
  const handleRename = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = projectName.trim();

    if (!trimmedName || !editingProjectId) return;

    renameProject(editingProjectId, trimmedName);

    toast.success("Project renamed successfully.");

    setEditingProjectId(null);
    setProjectName("");
  };

  const openRenameDialog = (id: string, name: string) => {
    setEditingProjectId(id);
    setProjectName(name);
  };

  // Archive Project
  const handleArchiveProject = (id: string) => {
    archiveProject(id);
    toast.success("Project archived successfully.");
  };

  // Unarchive Project
  const handleUnarchiveProject = (id: string) => {
    unarchiveProject(id);
    toast.success("Project restored successfully.");
  };

  // Delete Project
  const handleDeleteProject = () => {
    if (!deletingProjectId) return;

    deleteProject(deletingProjectId);

    toast.success("Project deleted successfully.");

    setDeletingProjectId(null);
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">
          {showArchived ? "Archived Projects" : "Active Projects"}
        </p>

        <button
          type="button"
          onClick={() => setShowArchived((previous) => !previous)}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          {showArchived ? (
            <>
              <FolderKanban size={16} />
              Active Projects
            </>
          ) : (
            <>
              <Archive size={16} />
              Archived Projects
            </>
          )}
        </button>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border p-8 text-center">
          <FolderKanban
            size={40}
            className="mb-3 text-muted-foreground"
          />

          <h3 className="font-semibold text-foreground">
            {showArchived ? "No archived projects" : "No projects yet"}
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            {showArchived
              ? "Archived projects will appear here."
              : "Add a project to this workspace to get started."}
          </p>
        </div>
      ) : (
        <div
          className={
            layout === "grid"
              ? "grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3"
              : "flex flex-col gap-3"
          }
        >
          {filteredProjects.map((project) => {
            const isActive = activeProjectId === project.id;

            return (
              <div
                key={project.id}
                className={`rounded-xl border bg-card p-5 shadow-sm transition-all ${
                  isActive && !showArchived
                    ? "border-emerald-600 ring-1 ring-emerald-600"
                    : "border-border"
                } ${
                  layout === "list"
                    ? "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                    : "flex flex-col gap-4"
                }`}
              >
                {/* Project Details */}
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    <FolderKanban size={22} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-card-foreground">
                        {project.name}
                      </h3>

                      {layout === "grid" && (
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                            showArchived
                              ? "bg-muted text-muted-foreground"
                              : isActive
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {showArchived
                            ? "Archived"
                            : isActive
                              ? "Active"
                              : "Not Selected"}
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm leading-5 text-muted-foreground">
                      {project.description || "No description provided."}
                    </p>

                    <p className="mt-2 text-xs text-muted-foreground">
                      Created: {project.createdAt}
                    </p>
                  </div>
                </div>

                {/* Grid View Actions */}
                {layout === "grid" ? (
                  <div className="flex flex-col gap-3 border-t border-border pt-3">
                    <div className="grid grid-cols-2 gap-3">
                      {!showArchived && (
                        <button
                          type="button"
                          onClick={() =>
                            openRenameDialog(project.id, project.name)
                          }
                          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                        >
                          <Pencil size={15} />
                          Rename
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          showArchived
                            ? handleUnarchiveProject(project.id)
                            : handleArchiveProject(project.id)
                        }
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                      >
                        {showArchived ? (
                          <>
                            <ArchiveRestore size={15} />
                            Unarchive
                          </>
                        ) : (
                          <>
                            <Archive size={15} />
                            Archive
                          </>
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {!showArchived && (
                        <button
                          type="button"
                          onClick={() => setActiveProject(project.id)}
                          disabled={isActive}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:cursor-default disabled:opacity-60"
                        >
                          {isActive ? "Selected" : "Select Project"}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setDeletingProjectId(project.id)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  /* List View Actions */
                  <div className="grid grid-cols-2 gap-2 border-t border-border pt-3 sm:flex sm:flex-wrap sm:items-center sm:justify-end sm:border-0 sm:pt-0">
                    {!showArchived && (
                      <button
                        type="button"
                        onClick={() => setActiveProject(project.id)}
                        disabled={isActive}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-2 py-2 text-sm font-medium text-foreground transition hover:bg-muted disabled:cursor-default disabled:opacity-60 sm:w-auto sm:px-3"
                      >
                        {isActive ? "Selected" : "Select Project"}
                      </button>
                    )}

                    {!showArchived && (
                      <button
                        type="button"
                        onClick={() =>
                          openRenameDialog(project.id, project.name)
                        }
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-2 py-2 text-sm font-medium text-foreground hover:bg-muted sm:w-auto sm:px-3"
                      >
                        <Pencil size={15} />
                        Rename
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        showArchived
                          ? handleUnarchiveProject(project.id)
                          : handleArchiveProject(project.id)
                      }
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-2 py-2 text-sm font-medium text-foreground hover:bg-muted sm:w-auto sm:px-3"
                    >
                      {showArchived ? (
                        <>
                          <ArchiveRestore size={15} />
                          Unarchive
                        </>
                      ) : (
                        <>
                          <Archive size={15} />
                          Archive
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeletingProjectId(project.id)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-2 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950 sm:w-auto sm:px-3"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Project Confirmation */}
      {deletingProjectId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-project-title"
            className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl"
          >
            <h2
              id="delete-project-title"
              className="text-lg font-semibold text-foreground"
            >
              Delete Project?
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to delete{" "}
              <strong>{projectToDelete?.name}</strong>?
              This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingProjectId(null)}
                className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteProject}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Project Dialog */}
      {editingProjectId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setEditingProjectId(null);
              setProjectName("");
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="rename-project-title"
            className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2
                  id="rename-project-title"
                  className="text-lg font-semibold text-foreground"
                >
                  Rename Project
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Enter a new name for this project.
                </p>
              </div>

              <button
                type="button"
                aria-label="Close dialog"
                onClick={() => {
                  setEditingProjectId(null);
                  setProjectName("");
                }}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRename} className="space-y-4">
              <div>
                <label
                  htmlFor="rename-project-input"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Project Name
                </label>

                <input
                  id="rename-project-input"
                  type="text"
                  autoFocus
                  required
                  maxLength={60}
                  value={projectName}
                  onChange={(event) => setProjectName(event.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProjectId(null);
                    setProjectName("");
                  }}
                  className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!projectName.trim()}
                  className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default ProjectList;
