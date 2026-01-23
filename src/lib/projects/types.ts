export type ProjectTile = {
  id: string;
  name: string;
  sessionKey: string;
  model?: string | null;
  thinkingLevel?: string | null;
  position: { x: number; y: number };
  size: { width: number; height: number };
};

export type Project = {
  id: string;
  name: string;
  repoPath: string;
  createdAt: number;
  updatedAt: number;
  tiles: ProjectTile[];
};

export type ProjectsStore = {
  version: 1;
  activeProjectId: string | null;
  projects: Project[];
};

export type ProjectCreatePayload = {
  name: string;
  repoPath: string;
};

export type ProjectCreateResult = {
  store: ProjectsStore;
  warnings: string[];
};
