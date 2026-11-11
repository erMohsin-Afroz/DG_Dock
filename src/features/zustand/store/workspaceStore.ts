
import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  WorkspaceStore,
} from "../types";

// Default UI Preferences
const defaultPreferences = {
  layout: "grid" as const,
  theme: "light" as const,
  density: "comfortable" as const,
};

const mockProjectIds = [
  "project-1",
  "project-2",
  "project-3",
];

export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set) => ({
    
      workspaces: [],
      projects: [],

      activeWorkspaceId: null,
      activeProjectId: null,

      layout: defaultPreferences.layout,
      theme: defaultPreferences.theme,
      density: defaultPreferences.density,

      isSettingsPanelOpen: false,
      isCommandPanelOpen: false,


      setActiveWorkspace: (id) =>
        set({
          activeWorkspaceId: id,
          activeProjectId: null,
        }),

      addWorkspace: (workspace) =>
        set((state) => ({
          workspaces: [...state.workspaces, workspace],
        })),

      updateWorkspace: (id, name) =>
        set((state) => ({
          workspaces: state.workspaces.map((workspace) =>
            workspace.id === id
              ? { ...workspace, name }
              : workspace
          ),
        })),

      deleteWorkspace: (id) =>
        set((state) => {
          const workspaces = state.workspaces.filter(
            (workspace) => workspace.id !== id
          );

          const projects = state.projects.filter(
            (project) => project.workspaceId !== id
          );

          const isActiveWorkspace =
            state.activeWorkspaceId === id;

          return {
            workspaces,
            projects,

            activeWorkspaceId: isActiveWorkspace
              ? (workspaces[0]?.id ?? null)
              : state.activeWorkspaceId,

            activeProjectId: isActiveWorkspace
              ? null
              : state.activeProjectId,
          };
        }),


      addProject: (project) =>
        set((state) => ({
          projects: [...state.projects, project],
        })),

      setActiveProject: (id) =>
        set({
          activeProjectId: id,
        }),

      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter(
            (project) => project.id !== id
          ),

          activeProjectId:
            state.activeProjectId === id
              ? null
              : state.activeProjectId,
        })),

      renameProject: (id, name) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? { ...project, name }
              : project
          ),
        })),

      archiveProject: (id) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? { ...project, isArchived: true }
              : project
          ),

          activeProjectId:
            state.activeProjectId === id
              ? null
              : state.activeProjectId,
        })),

      unarchiveProject: (id) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? { ...project, isArchived: false }
              : project
          ),
        })),


      setLayout: (layout) =>
        set({
          layout,
        }),


      setSettingsPanelOpen: (isOpen) =>
        set({
          isSettingsPanelOpen: isOpen,
        }),


      setCommandPanelOpen: (isOpen) =>
        set({
          isCommandPanelOpen: isOpen,
        }),

      setTheme: (theme) =>
        set({
          theme,
        }),


      setDensity: (density) =>
        set({
          density,
        }),


      resetPreferences: () =>
        set({
          ...defaultPreferences,
          isSettingsPanelOpen: false,
          isCommandPanelOpen: false,
        }),
    }),

    {
      name: "devdock-workspace-storage",


      partialize: (state) => ({
        workspaces: state.workspaces,
        projects: state.projects,

        activeWorkspaceId: state.activeWorkspaceId,
        activeProjectId: state.activeProjectId,

        layout: state.layout,
        theme: state.theme,
        density: state.density,
      }),


      merge: (persistedState, currentState) => {
        const persisted =
          persistedState as Partial<WorkspaceStore>;

        const workspaces = persisted.workspaces ?? [];

        const projects = (persisted.projects ?? []).filter(
          (project) => !mockProjectIds.includes(project.id)
        );

        const activeWorkspaceId =
          workspaces.some(
            (workspace) =>
              workspace.id === persisted.activeWorkspaceId
          )
            ? persisted.activeWorkspaceId!
            : (workspaces[0]?.id ?? null);

        const activeProjectId =
          projects.some(
            (project) =>
              project.id === persisted.activeProjectId
          )
            ? persisted.activeProjectId!
            : null;

        return {
          ...currentState,
          ...persisted,

          workspaces,
          projects,

          activeWorkspaceId,
          activeProjectId,
        };
      },
    }
  )
);



export const selectTotalWorkspaces = (state: WorkspaceStore) =>
  state.workspaces.length;


export const selectTotalProjects = (state: WorkspaceStore) =>
  state.projects.length;


export const selectActiveProjectsCount = (state: WorkspaceStore) =>
  state.projects.filter((project) => !project.isArchived).length;


export const selectArchivedProjectsCount = (state: WorkspaceStore) =>
  state.projects.filter((project) => project.isArchived).length;


export const selectActiveWorkspace = (state: WorkspaceStore) =>
  state.workspaces.find(
    (workspace) => workspace.id === state.activeWorkspaceId
  ) ?? null;


export const selectActiveProject = (state: WorkspaceStore) =>
  state.projects.find(
    (project) => project.id === state.activeProjectId
  ) ?? null;
