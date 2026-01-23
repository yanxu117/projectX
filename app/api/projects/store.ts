import fs from "node:fs";
import path from "node:path";
import os from "node:os";

import type { ProjectsStore } from "../../../src/lib/projects/types";

const STORE_VERSION: ProjectsStore["version"] = 1;
const STORE_DIR = path.join(os.homedir(), ".clawdbot", "agent-canvas");
const STORE_PATH = path.join(STORE_DIR, "projects.json");

export type ProjectsStorePayload = ProjectsStore;

export const ensureStoreDir = () => {
  if (!fs.existsSync(STORE_DIR)) {
    fs.mkdirSync(STORE_DIR, { recursive: true });
  }
};

export const defaultStore = (): ProjectsStore => ({
  version: STORE_VERSION,
  activeProjectId: null,
  projects: [],
});

export const loadStore = (): ProjectsStore => {
  ensureStoreDir();
  if (!fs.existsSync(STORE_PATH)) {
    const seed = defaultStore();
    fs.writeFileSync(STORE_PATH, JSON.stringify(seed, null, 2), "utf8");
    return seed;
  }
  const raw = fs.readFileSync(STORE_PATH, "utf8");
  try {
    const parsed = JSON.parse(raw) as ProjectsStore;
    if (!parsed || !Array.isArray(parsed.projects)) return defaultStore();
    return {
      version: STORE_VERSION,
      activeProjectId: parsed.activeProjectId ?? null,
      projects: parsed.projects ?? [],
    };
  } catch {
    return defaultStore();
  }
};

export const saveStore = (store: ProjectsStore) => {
  ensureStoreDir();
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
};

export const validateRepoPath = (repoPath: string) => {
  const warnings: string[] = [];
  const normalized = repoPath.trim();
  if (!normalized) {
    warnings.push("Repository path is empty.");
    return { warnings, exists: false, isGit: false };
  }
  const exists = fs.existsSync(normalized);
  if (!exists) {
    warnings.push("Repository path does not exist on disk.");
  }
  const isGit = exists && fs.existsSync(path.join(normalized, ".git"));
  if (exists && !isGit) {
    warnings.push("Repository path is not a Git repo (missing .git).");
  }
  return { warnings, exists, isGit };
};
