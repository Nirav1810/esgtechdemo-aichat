import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import VoiceInputButton from "./VoiceInputButton";

const { mockUseVoiceInput } = vi.hoisted(() => ({
  mockUseVoiceInput: vi.fn(),
}));

vi.mock("@/lib/useVoiceInput", () => ({
  useVoiceInput: mockUseVoiceInput,
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
    cancelRecording: vi.fn(),
    ...overrides,
  };
}

beforeEach(() => {
  mockUseVoiceInput.mockReturnValue(createUseVoiceInputState());
  vi.unstubAllGlobals();
});

describe("VoiceInputButton", () => {
  it("opens the voice recorder popover when the trigger is pressed", async () => {
    const startRecording = vi.fn();

    vi.stubGlobal("MediaRecorder", vi.fn());
    mockUseVoiceInput.mockReturnValue(
      createUseVoiceInputState({
        isRecording: true,
        startRecording,
      })
    );

    render(<VoiceInputButton onTranscriptionComplete={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Open voice recorder" }));

    expect(
      await screen.findByRole("dialog", { name: "Voice recorder" })
    ).toBeInTheDocument();
    expect(startRecording).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Open voice recorder" })).toBeDisabled();
  });

  it("waits for hook support before starting recording", async () => {
    const startRecording = vi.fn();
    let currentState = createUseVoiceInputState({
      isSupported: false,
      startRecording,
    });

    vi.stubGlobal("MediaRecorder", vi.fn());
    mockUseVoiceInput.mockImplementation(() => currentState);

    const { rerender } = render(
      <VoiceInputButton onTranscriptionComplete={vi.fn()} />
    );

    fireEvent.click(screen.getByRole("button", { name: "Open voice recorder" }));

    expect(
      await screen.findByRole("dialog", { name: "Voice recorder" })
    ).toBeInTheDocument();
    expect(startRecording).not.toHaveBeenCalled();

    currentState = createUseVoiceInputState({
      isSupported: true,
      isRecording: true,
      startRecording,
    });

    rerender(<VoiceInputButton onTranscriptionComplete={vi.fn()} />);

    await waitFor(() => {
      expect(startRecording).toHaveBeenCalledTimes(1);
    });
  });

  it("closes the popover on cancel without sending the recording", async () => {
    const stopRecording = vi.fn();
    const cancelRecording = vi.fn();

    vi.stubGlobal("MediaRecorder", vi.fn());
    mockUseVoiceInput.mockReturnValue(
      createUseVoiceInputState({
        isRecording: true,
        stopRecording,
        cancelRecording,
      })
    );

    render(<VoiceInputButton onTranscriptionComplete={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Open voice recorder" }));
    fireEvent.click(await screen.findByRole("button", { name: "Cancel recording" }));

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: "Voice recorder" })
      ).not.toBeInTheDocument();
    });
    expect(cancelRecording).toHaveBeenCalledTimes(1);
    expect(stopRecording).not.toHaveBeenCalled();
  });

  it("closes the popover after a successful transcription", async () => {
    const onTranscriptionComplete = vi.fn();
    let latestOptions:
      | {
          onTranscriptionComplete?: (text: string) => void | Promise<void>;
          onError?: (error: string) => void;
        }
      | undefined;

    vi.stubGlobal("MediaRecorder", vi.fn());
    mockUseVoiceInput.mockImplementation((options) => {
      latestOptions = options;

      return createUseVoiceInputState({
        isRecording: false,
        isProcessing: true,
        transcript: "Draft transcript",
      });
    });

    render(
      <VoiceInputButton onTranscriptionComplete={onTranscriptionComplete} />
    );

    fireEvent.click(screen.getByRole("button", { name: "Open voice recorder" }));
    await screen.findByRole("dialog", { name: "Voice recorder" });

    await act(async () => {
      await latestOptions?.onTranscriptionComplete?.("Draft transcript");
    });

    expect(onTranscriptionComplete).toHaveBeenCalledWith("Draft transcript");
    expect(
      screen.queryByRole("dialog", { name: "Voice recorder" })
    ).not.toBeInTheDocument();
  });

  it("keeps the popover open so recorder errors stay visible", async () => {
    let latestOptions:
      | {
          onTranscriptionComplete?: (text: string) => void | Promise<void>;
          onError?: (error: string) => void;
        }
      | undefined;

    vi.stubGlobal("MediaRecorder", vi.fn());
    mockUseVoiceInput.mockImplementation((options) => {
      latestOptions = options;

      return createUseVoiceInputState({
        isRecording: false,
        error: "Microphone permission denied",
      });
    });

    render(<VoiceInputButton onTranscriptionComplete={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Open voice recorder" }));
    await screen.findByRole("dialog", { name: "Voice recorder" });

    act(() => {
      latestOptions?.onError?.("Microphone permission denied");
    });

    expect(screen.getByRole("dialog", { name: "Voice recorder" })).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Microphone permission denied"
    );
  });

  it("does not render when voice input is unsupported", () => {
    const { container } = render(
      <VoiceInputButton onTranscriptionComplete={vi.fn()} />
    );

    expect(container.firstChild).toBeNull();
  });
});
