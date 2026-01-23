import type {
  ProjectCreatePayload,
  ProjectCreateResult,
  ProjectsStore,
} from "./types";

export const fetchProjectsStore = async (): Promise<ProjectsStore> => {
  const res = await fetch("/api/projects", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to load projects.");
  }
  return (await res.json()) as ProjectsStore;
};

export const createProject = async (
  payload: ProjectCreatePayload
): Promise<ProjectCreateResult> => {
  const res = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error ?? "Failed to create project.");
  }
  return data as ProjectCreateResult;
};

export const saveProjectsStore = async (store: ProjectsStore): Promise<ProjectsStore> => {
  const res = await fetch("/api/projects", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(store),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error ?? "Failed to save projects.");
  }
  return data as ProjectsStore;
};

export const deleteProject = async (projectId: string): Promise<ProjectsStore> => {
  const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error ?? "Failed to delete project.");
  }
  return data as ProjectsStore;
};
