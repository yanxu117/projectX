import { NextResponse } from "next/server";

import {
  BEADS_WORKSPACE_NOT_INITIALIZED_ERROR_MESSAGE,
  createTaskControlPlaneBrRunner,
  isBeadsWorkspaceError,
} from "@/lib/task-control-plane/br-runner";
import { buildTaskControlPlaneSnapshot } from "@/lib/task-control-plane/read-model";
import {
  resolveConfiguredSshTarget,
  resolveGatewaySshTargetFromGatewayUrl,
} from "@/lib/ssh/gateway-host";
import { loadStudioSettings } from "@/lib/studio/settings-store";

export const runtime = "nodejs";

const GATEWAY_BEADS_DIR_ENV = "OPENCLAW_TASK_CONTROL_PLANE_GATEWAY_BEADS_DIR";

const resolveTaskControlPlaneSshTarget = (): string | null => {
  if (!process.env[GATEWAY_BEADS_DIR_ENV]) return null;

  const configured = resolveConfiguredSshTarget(process.env);
  if (configured) return configured;

  const settings = loadStudioSettings();
  return resolveGatewaySshTargetFromGatewayUrl(settings.gateway?.url ?? "", process.env);
};

async function loadTaskControlPlaneRawData(): Promise<{
  scopePath: string | null;
  openIssues: unknown;
  inProgressIssues: unknown;
  blockedIssues: unknown;
  doneIssues: unknown;
}> {
  const sshTarget = resolveTaskControlPlaneSshTarget();
  const runner = createTaskControlPlaneBrRunner(sshTarget ? { sshTarget } : undefined);
  const scope = runner.runBrJson(["where"]);
  const openIssues = runner.runBrJson(["list", "--status", "open", "--limit", "0"]);
  const inProgressIssues = runner.runBrJson(["list", "--status", "in_progress", "--limit", "0"]);
  const blockedIssues = runner.runBrJson(["blocked", "--limit", "0"]);
  const doneIssues = runner.runBrJson(["list", "--status", "closed", "--limit", "0"]);
  return {
    scopePath: runner.parseScopePath(scope),
    openIssues,
    inProgressIssues,
    blockedIssues,
    doneIssues,
  };
}

export async function GET() {
  try {
    const raw = await loadTaskControlPlaneRawData();
    const snapshot = buildTaskControlPlaneSnapshot(raw);
    return NextResponse.json({ snapshot });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to load task control plane data.";
    console.error(message);
    if (isBeadsWorkspaceError(message)) {
      return NextResponse.json(
        {
          error: BEADS_WORKSPACE_NOT_INITIALIZED_ERROR_MESSAGE,
        },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
