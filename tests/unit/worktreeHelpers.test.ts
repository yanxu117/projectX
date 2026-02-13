import { describe, expect, it } from "vitest";

import { buildAgentInstruction } from "@/lib/text/message-extract";

describe("buildAgentInstruction", () => {
  it("returns plain message text with approval wait policy", () => {
    const message = buildAgentInstruction({
      message: "Ship it",
    });

    expect(message.startsWith("Ship it\n\nExecution approval policy:")).toBe(true);
  });
});
