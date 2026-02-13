import { describe, expect, it } from "vitest";

import { buildAgentInstruction } from "@/lib/text/message-extract";

describe("buildAgentInstruction", () => {
  it("returns trimmed message with approval wait policy for normal prompts", () => {
    const message = buildAgentInstruction({
      message: " Ship it ",
    });
    expect(message.startsWith("Ship it\n\nExecution approval policy:")).toBe(true);
    expect(message).toContain('reply exactly: "Waiting for approved command result."');
  });

  it("returns command messages untouched", () => {
    const message = buildAgentInstruction({
      message: "/help",
    });
    expect(message).toBe("/help");
  });
});
