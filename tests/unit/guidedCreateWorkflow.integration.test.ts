import { describe, expect, it, vi } from "vitest";
import type { AgentGuidedSetup } from "@/features/agents/operations/createAgentOperation";
import {
  resolveGuidedCreateCompletion,
  runGuidedCreateWorkflow,
  runGuidedRetryWorkflow,
} from "@/features/agents/operations/guidedCreateWorkflow";

const createSetup = (): AgentGuidedSetup => ({
  agentOverrides: {
    sandbox: { mode: "non-main", workspaceAccess: "ro" },
    tools: { profile: "coding", alsoAllow: ["group:runtime"], deny: ["group:web"] },
  },
  files: {
    "AGENTS.md": "# Mission",
  },
  execApprovals: {
    security: "allowlist",
    ask: "always",
    allowlist: [{ pattern: "/usr/bin/git" }],
  },
});

describe("guidedCreateWorkflow integration", () => {
  it("maps workflow pending outcome to pending setup map update and user error banner", async () => {
    const setup = createSetup();
    const pendingByAgentId: Record<string, AgentGuidedSetup> = {};
    const createAgent = vi.fn(async () => ({ id: "agent-1" }));
    const applySetup = vi.fn(async () => {
      throw new Error("setup failed");
    });

    const result = await runGuidedCreateWorkflow(
      {
        name: "Agent One",
        setup,
        isLocalGateway: true,
      },
      {
        createAgent,
        applySetup,
        upsertPending: (agentId, value) => {
          pendingByAgentId[agentId] = value;
        },
        removePending: (agentId) => {
          delete pendingByAgentId[agentId];
        },
      }
    );

    const completion = resolveGuidedCreateCompletion({
      agentName: "Agent One",
      result,
    });

    expect(result.setupStatus).toBe("pending");
    expect(pendingByAgentId).toEqual({ "agent-1": setup });
    expect(completion.pendingErrorMessage).toBe(
      'Agent "Agent One" was created, but guided setup is pending. Retry or discard setup from chat. setup failed'
    );
  });

  it("maps workflow applied outcome to modal close and reload path", async () => {
    const setup = createSetup();
    const pendingByAgentId: Record<string, AgentGuidedSetup> = { "agent-2": setup };

    const result = await runGuidedCreateWorkflow(
      {
        name: "Agent Two",
        setup,
        isLocalGateway: true,
      },
      {
        createAgent: async () => ({ id: "agent-2" }),
        applySetup: async () => undefined,
        upsertPending: (agentId, value) => {
          pendingByAgentId[agentId] = value;
        },
        removePending: (agentId) => {
          delete pendingByAgentId[agentId];
        },
      }
    );

    const completion = resolveGuidedCreateCompletion({
      agentName: "Agent Two",
      result,
    });

    expect(completion).toEqual({
      shouldReloadAgents: true,
      shouldCloseCreateModal: true,
      pendingErrorMessage: null,
    });
    expect(pendingByAgentId).toEqual({});
  });

  it("manual retry path uses workflow retry outcome and clears busy state", async () => {
    const setup = createSetup();
    const pendingByAgentId: Record<string, AgentGuidedSetup> = { "agent-3": setup };
    let busyAgentId: string | null = null;

    const manualRetry = async (agentId: string) => {
      busyAgentId = agentId;
      try {
        return await runGuidedRetryWorkflow(agentId, {
          applyPendingSetup: async (resolvedAgentId) => {
            return { applied: resolvedAgentId === "agent-3" };
          },
          removePending: (resolvedAgentId) => {
            delete pendingByAgentId[resolvedAgentId];
          },
        });
      } finally {
        busyAgentId = busyAgentId === agentId ? null : busyAgentId;
      }
    };

    const result = await manualRetry("agent-3");

    expect(result).toEqual({ applied: true });
    expect(pendingByAgentId).toEqual({});
    expect(busyAgentId).toBeNull();
  });
});
