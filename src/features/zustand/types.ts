export type WorkspaceLayout = "grid" | "list";
export type ThemeMode = "light" | "dark";
export type DisplayDensity = "comfortable" | "compact";

export interface Workspace {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  createdAt: string;
  isArchived: boolean;
}

export interface WorkspaceState {
  workspaces: Workspace[];
  projects: Project[];
  activeWorkspaceId: string | null;
  activeProjectId: string | null;

  layout: WorkspaceLayout;
  theme: ThemeMode;
  density: DisplayDensity;

  isSettingsPanelOpen: boolean;
  isCommandPanelOpen: boolean;
}

export interface WorkspaceActions {
  setLayout: (layout: WorkspaceLayout) => void;
  setActiveWorkspace: (id: string) => void;
  setActiveProject: (id: string) => void;

  addWorkspace: (workspace: Workspace) => void;
  updateWorkspace: (id: string, name: string) => void;
  deleteWorkspace: (id: string) => void;

  addProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  renameProject: (id: string, name: string) => void;
  archiveProject: (id: string) => void;
  unarchiveProject: (id: string) => void;

  setSettingsPanelOpen: (isOpen: boolean) => void;
  setCommandPanelOpen: (isOpen: boolean) => void;

  setTheme: (theme: ThemeMode) => void;
  setDensity: (density: DisplayDensity) => void;
  resetPreferences: () => void;
}

export type WorkspaceStore = WorkspaceState & WorkspaceActions;
