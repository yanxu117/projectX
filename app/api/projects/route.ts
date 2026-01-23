import { NextResponse } from "next/server";

import { randomUUID } from "node:crypto";

import type { Project, ProjectCreatePayload, ProjectCreateResult, ProjectsStore } from "../../../src/lib/projects/types";
import { loadStore, saveStore, validateRepoPath } from "./store";

export const runtime = "nodejs";

const normalizeProjectsStore = (store: ProjectsStore): ProjectsStore => {
  const projects = Array.isArray(store.projects) ? store.projects : [];
  const activeProjectId =
    typeof store.activeProjectId === "string" &&
    projects.some((project) => project.id === store.activeProjectId)
      ? store.activeProjectId
      : projects[0]?.id ?? null;
  return {
    version: 1,
    activeProjectId,
    projects,
  };
};

export async function GET() {
  const store = normalizeProjectsStore(loadStore());
  return NextResponse.json(store);
}

export async function POST(request: Request) {
  const body = (await request.json()) as ProjectCreatePayload;
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const repoPath = typeof body?.repoPath === "string" ? body.repoPath.trim() : "";

  if (!name) {
    return NextResponse.json({ error: "Project name is required." }, { status: 400 });
  }
  if (!repoPath) {
    return NextResponse.json({ error: "Repository path is required." }, { status: 400 });
  }

  const store = loadStore();
  const now = Date.now();
  const project: Project = {
    id: randomUUID(),
    name,
    repoPath,
    createdAt: now,
    updatedAt: now,
    tiles: [],
  };

  const nextStore = normalizeProjectsStore({
    version: 1,
    activeProjectId: project.id,
    projects: [...store.projects, project],
  });

  saveStore(nextStore);

  const validation = validateRepoPath(repoPath);
  const result: ProjectCreateResult = {
    store: nextStore,
    warnings: validation.warnings,
  };

  return NextResponse.json(result);
}

export async function PUT(request: Request) {
  const body = (await request.json()) as ProjectsStore;
  if (!body || !Array.isArray(body.projects)) {
    return NextResponse.json({ error: "Invalid projects payload." }, { status: 400 });
  }
  const normalized = normalizeProjectsStore(body);
  saveStore(normalized);
  return NextResponse.json(normalized);
}
