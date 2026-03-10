import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import AISidebar from "./AISidebar";

const { mockUseVoiceInput } = vi.hoisted(() => ({
  mockUseVoiceInput: vi.fn(),
}));

vi.mock("@/lib/useVoiceInput", () => ({
  useVoiceInput: mockUseVoiceInput,
}));

vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated" }),
  signOut: vi.fn(),
}));

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} alt={props.alt ?? ""} />,
}));

function createUseVoiceInputState(overrides = {}) {
  return {
    isSupported: true,
    isRecording: false,
    isProcessing: false,
    transcript: "",
    error: null,
    startRecording: vi.fn(),
    stopRecording: vi.fn(),
    resetTranscript: vi.fn(),
    cancelRecording: vi.fn(),
    ...overrides,
  };
}

beforeEach(() => {
  mockUseVoiceInput.mockReturnValue(createUseVoiceInputState());
  vi.stubGlobal("MediaRecorder", vi.fn());
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

describe("AISidebar voice input integration", () => {
  it("inserts a completed popup transcription into the composer once and closes the recorder", async () => {
    let latestOptions:
      | {
          onTranscriptionComplete?: (text: string) => void | Promise<void>;
          onError?: (error: string) => void;
        }
      | undefined;

    mockUseVoiceInput.mockImplementation((options) => {
      latestOptions = options;

      return createUseVoiceInputState({
        isRecording: false,
        isProcessing: true,
        transcript: "Draft transcript",
      });
    });

    render(
      <AISidebar
        isOpen
        onClose={vi.fn()}
        contextData=""
        pageType="dashboard"
      />
    );

    const composer = screen.getByPlaceholderText(
      "Ask about your ESG data or attach files..."
    );

    fireEvent.change(composer, { target: { value: "Existing prompt" } });
    fireEvent.click(screen.getByRole("button", { name: "Open voice recorder" }));

    await screen.findByRole("dialog", { name: "Voice recorder" });

    await act(async () => {
      await latestOptions?.onTranscriptionComplete?.("Draft transcript");
    });

    await waitFor(() => {
      expect(composer).toHaveValue("Existing prompt Draft transcript");
    });
    expect(screen.queryByRole("dialog", { name: "Voice recorder" })).not.toBeInTheDocument();
  });

  it("keeps the composer unchanged when the recorder is cancelled", async () => {
    render(
      <AISidebar
        isOpen
        onClose={vi.fn()}
        contextData=""
        pageType="dashboard"
      />
    );

    const composer = screen.getByPlaceholderText(
      "Ask about your ESG data or attach files..."
    );

    fireEvent.change(composer, { target: { value: "Existing prompt" } });
    fireEvent.click(screen.getByRole("button", { name: "Open voice recorder" }));
    fireEvent.click(await screen.findByRole("button", { name: "Cancel recording" }));

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: "Voice recorder" })
      ).not.toBeInTheDocument();
    });
    expect(composer).toHaveValue("Existing prompt");
  });
});
