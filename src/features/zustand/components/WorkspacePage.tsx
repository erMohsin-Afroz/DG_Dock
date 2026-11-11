
import { useState, type FormEvent } from "react";
import {
  Plus,
  BriefcaseBusiness,
  FolderKanban,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import PageHeader from "@/components/common/PageHeader";

import WorkspaceActions from "./WorkspaceActions";
import ProjectList from "./ProjectList";

import {
  useWorkspaceStore,
  selectTotalWorkspaces,
  selectTotalProjects,
  selectActiveProjectsCount,
  selectArchivedProjectsCount,
  selectActiveProject,
} from "../store/workspaceStore";

import type { Workspace, Project } from "../types";

type DialogType = "workspace" | "project" | null;

function WorkspacePage() {
  const [dialog, setDialog] = useState<DialogType>(null);

  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const [deletingWorkspaceId, setDeletingWorkspaceId] =
    useState<string | null>(null);

  // Zustand State Selectors
  const workspaces = useWorkspaceStore((state) => state.workspaces);
  const projects = useWorkspaceStore((state) => state.projects);

  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId
  );

  // Derived Selectors
  const totalWorkspaces = useWorkspaceStore(selectTotalWorkspaces);
  const totalProjects = useWorkspaceStore(selectTotalProjects);

  const activeProjectsCount = useWorkspaceStore(
    selectActiveProjectsCount
  );

  const archivedProjectsCount = useWorkspaceStore(
    selectArchivedProjectsCount
  );

  const activeProject = useWorkspaceStore(selectActiveProject);

  // Store Actions
  const addWorkspace = useWorkspaceStore(
    (state) => state.addWorkspace
  );

  const setActiveWorkspace = useWorkspaceStore(
    (state) => state.setActiveWorkspace
  );

  const addProject = useWorkspaceStore(
    (state) => state.addProject
  );

  const deleteWorkspace = useWorkspaceStore(
    (state) => state.deleteWorkspace
  );

  // Derived Workspace Data
  const activeWorkspace = workspaces.find(
    (workspace) => workspace.id === activeWorkspaceId
  );

  const activeProjects = projects.filter(
    (project) =>
      project.workspaceId === activeWorkspaceId &&
      !project.isArchived
  );

  const workspaceToDelete = workspaces.find(
    (workspace) => workspace.id === deletingWorkspaceId
  );

  // Create Workspace
  const handleCreateWorkspace = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = workspaceName.trim();

    if (!name) return;

    const newWorkspace: Workspace = {
      id: crypto.randomUUID(),
      name,
      description: workspaceDescription.trim(),
      createdAt: new Date().toISOString().split("T")[0],
    };

    addWorkspace(newWorkspace);
    setActiveWorkspace(newWorkspace.id);

    toast.success("Workspace created successfully.");

    setWorkspaceName("");
    setWorkspaceDescription("");
    setDialog(null);
  };

  // Add Project
  const handleAddProject = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = projectName.trim();

    if (!name || !activeWorkspaceId) return;

    const newProject: Project = {
      id: crypto.randomUUID(),
      workspaceId: activeWorkspaceId,
      name,
      description: projectDescription.trim(),
      createdAt: new Date().toISOString().split("T")[0],
      isArchived: false,
    };

    addProject(newProject);

    toast.success("Project added successfully.");

    setProjectName("");
    setProjectDescription("");
    setDialog(null);
  };

  // Delete Workspace
  const handleDeleteWorkspace = () => {
    if (!deletingWorkspaceId) return;

    deleteWorkspace(deletingWorkspaceId);

    toast.success("Workspace deleted successfully.");

    setDeletingWorkspaceId(null);
  };

  return (
    <div className="space-y-7">
      <PageHeader
        title="Zustand Workspace"
        description="Manage your workspaces and projects using Zustand."
      />

      {/* Workspace Statistics */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Total Workspaces
          </p>

          <h3 className="mt-2 text-2xl font-bold text-foreground">
            {totalWorkspaces}
          </h3>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Total Projects
          </p>

          <h3 className="mt-2 text-2xl font-bold text-foreground">
            {totalProjects}
          </h3>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Active Projects
          </p>

          <h3 className="mt-2 text-2xl font-bold text-emerald-600">
            {activeProjectsCount}
          </h3>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">
            Archived Projects
          </p>

          <h3 className="mt-2 text-2xl font-bold text-foreground">
            {archivedProjectsCount}
          </h3>
        </div>
      </section>

      {/* Active Project Summary */}
      <section className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            <FolderKanban size={20} />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Currently Selected Project
            </p>

            <h3 className="mt-1 font-semibold text-foreground">
              {activeProject?.name ?? "No project selected"}
            </h3>
          </div>
        </div>

        <p className="mt-3 text-sm text-muted-foreground">
          {activeProject?.description ??
            "Select a project to see its details."}
        </p>
      </section>

      {/* Workspaces */}
      <section className="space-y-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              My Workspaces
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {workspaces.length} workspaces available
            </p>
          </div>

          <button
            type="button"
            onClick={() => setDialog("workspace")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
          >
            <Plus size={18} />
            Create Workspace
          </button>
        </div>

        {workspaces.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center">
            <BriefcaseBusiness
              size={36}
              className="mx-auto mb-3 text-muted-foreground"
            />

            <h3 className="font-semibold text-foreground">
              No workspaces yet
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Create a workspace to organize your projects.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:gri-cols-3">
            {workspaces.map((workspace) => {
              const isActive = activeWorkspaceId === workspace.id;

              const workspaceProjectCount = projects.filter(
                (project) =>
                  project.workspaceId === workspace.id &&
                  !project.isArchived
              ).length;

              return (
                <div
                  key={workspace.id}
                  className={`flex flex-col rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md ${
                    isActive
                      ? "border-emerald-600 ring-1 ring-emerald-600"
                      : "border-border"
                  }`}
                >
                  {/* Workspace Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex size-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                      <BriefcaseBusiness size={22} />
                    </div>

                    {isActive && (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                        Active
                      </span>
                    )}
                  </div>

                  {/* Workspace Details */}
                  <div className="mt-4">
                    <h3 className="font-semibold text-card-foreground">
                      {workspace.name}
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {workspace.description || "No description provided."}
                    </p>
                  </div>

                  {/* Active Projects Count */}
                  <div className="mt-2 flex items-center gap-2 border-t border-border pt-2 text-sm text-muted-foreground">
                    <FolderKanban size={16} />
                    {workspaceProjectCount} active projects
                  </div>

                  {/* Workspace Actions */}
                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-3">
                    <button
                      type="button"
                      onClick={() => setActiveWorkspace(workspace.id)}
                      disabled={isActive}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-default disabled:opacity-60"
                    >
                      {isActive ? "Selected" : "Select Workspace"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setDeletingWorkspaceId(workspace.id)
                      }
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Projects */}
      <section className="space-y-5">
        <div className="flex flex-row items-center justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold text-foreground">
              {activeWorkspace
                ? `${activeWorkspace.name} Projects`
                : "My Projects"}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {activeProjects.length} active projects in this workspace
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setDialog("project")}
              disabled={!activeWorkspaceId}
              className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-emerald-700 px-3 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={17} />
              Add Project
            </button>

            <div className="hidden sm:block">
              <WorkspaceActions />
            </div>
          </div>
        </div>

        <ProjectList />
      </section>

      {/* Delete Workspace Confirmation */}
      {deletingWorkspaceId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-workspace-title"
            className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl"
          >
            <h2
              id="delete-workspace-title"
              className="text-lg font-semibold text-foreground"
            >
              Delete Workspace?
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to delete{" "}
              <strong>{workspaceToDelete?.name}</strong>?
              All projects inside this workspace will also be deleted.
              This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingWorkspaceId(null)}
                className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteWorkspace}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete Workspace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Workspace / Add Project Dialog */}
      {dialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setDialog(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="workspace-dialog-title"
            className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl"
          >
            <h2
              id="workspace-dialog-title"
              className="text-lg font-semibold text-foreground"
            >
              {dialog === "workspace"
                ? "Create Workspace"
                : "Add Project"}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {dialog === "workspace"
                ? "Create a workspace to organize your projects."
                : `Add a project to ${activeWorkspace?.name ?? "your workspace"}.`}
            </p>

            <form
              onSubmit={
                dialog === "workspace"
                  ? handleCreateWorkspace
                  : handleAddProject
              }
              className="mt-5 space-y-4"
            >
              <div>
                <label
                  htmlFor="item-name"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  {dialog === "workspace"
                    ? "Workspace Name"
                    : "Project Name"}{" "}
                  *
                </label>

                <input
                  id="item-name"
                  autoFocus
                  required
                  maxLength={60}
                  value={
                    dialog === "workspace"
                      ? workspaceName
                      : projectName
                  }
                  onChange={(event) =>
                    dialog === "workspace"
                      ? setWorkspaceName(event.target.value)
                      : setProjectName(event.target.value)
                  }
                  placeholder={
                    dialog === "workspace"
                      ? "Enter workspace name"
                      : "Enter project name"
                  }
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label
                  htmlFor="item-description"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Description
                </label>

                <textarea
                  id="item-description"
                  rows={3}
                  maxLength={200}
                  value={
                    dialog === "workspace"
                      ? workspaceDescription
                      : projectDescription
                  }
                  onChange={(event) =>
                    dialog === "workspace"
                      ? setWorkspaceDescription(event.target.value)
                      : setProjectDescription(event.target.value)
                  }
                  placeholder="Enter description"
                  className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDialog(null)}
                  className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    !(dialog === "workspace"
                      ? workspaceName.trim()
                      : projectName.trim())
                  }
                  className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {dialog === "workspace"
                    ? "Create Workspace"
                    : "Add Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkspacePage;
