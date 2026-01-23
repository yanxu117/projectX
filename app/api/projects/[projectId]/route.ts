import { NextResponse } from "next/server";

import { loadStore, saveStore } from "../store";

export const runtime = "nodejs";

export async function DELETE(
  _request: Request,
  context: { params: { projectId: string } }
) {
  const projectId = context.params.projectId.trim();
  if (!projectId) {
    return NextResponse.json({ error: "Project id is required." }, { status: 400 });
  }
  const store = loadStore();
  const projects = store.projects.filter((project) => project.id !== projectId);
  const activeProjectId =
    store.activeProjectId === projectId ? projects[0]?.id ?? null : store.activeProjectId;
  const nextStore = {
    version: 1 as const,
    activeProjectId,
    projects,
  };
  saveStore(nextStore);
  return NextResponse.json(nextStore);
}
