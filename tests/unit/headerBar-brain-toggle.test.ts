import { createElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { HeaderBar } from "@/features/agents/components/HeaderBar";

describe("HeaderBar settings toggle", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("renders_settings_toggle_and_calls_handler", () => {
    const onOpenSettings = vi.fn();

    render(
      createElement(HeaderBar, {
        status: "disconnected",
        onConnectionSettings: vi.fn(),
        onOpenSettings,
        settingsOpen: false,
      })
    );

    const settingsToggle = screen.getByTestId("settings-toggle");
    expect(settingsToggle).toBeInTheDocument();

    fireEvent.click(settingsToggle);
    expect(onOpenSettings).toHaveBeenCalledTimes(1);
  });

  it("opens_menu_and_calls_connection_settings_handler", () => {
    const onConnectionSettings = vi.fn();

    render(
      createElement(HeaderBar, {
        status: "disconnected",
        onConnectionSettings,
        onOpenSettings: vi.fn(),
        settingsOpen: false,
      })
    );

    fireEvent.click(screen.getByTestId("studio-menu-toggle"));
    fireEvent.click(screen.getByTestId("gateway-settings-toggle"));

    expect(onConnectionSettings).toHaveBeenCalledTimes(1);
  });
});
