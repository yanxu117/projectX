import { NextResponse } from "next/server";

import {
  BEADS_WORKSPACE_NOT_INITIALIZED_ERROR_MESSAGE,
  coerceBrSingleRecord,
  createTaskControlPlaneBrRunner,
  isBeadsWorkspaceError,
} from "@/lib/task-control-plane/br-runner";
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

const extractId = (request: Request): string => {
  let id: string | null = null;
  try {
    id = new URL(request.url).searchParams.get("id");
  } catch {
    id = null;
  }
  const trimmed = id?.trim() ?? "";
  if (!trimmed) {
    throw new Error('Missing required query parameter: "id".');
  }
  return trimmed;
};

export async function GET(request: Request) {
  try {
    const id = extractId(request);
    const sshTarget = resolveTaskControlPlaneSshTarget();
    const runner = createTaskControlPlaneBrRunner(sshTarget ? { sshTarget } : undefined);
    const raw = runner.runBrJson(["show", id]);
    const bead = coerceBrSingleRecord(raw, { command: "show", id });
    return NextResponse.json({ bead });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to load task details.";
    if (message.includes('Missing required query parameter: "id"')) {
      return NextResponse.json({ error: message }, { status: 400 });
    }
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
