import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import VoiceRecorderPopover from "./VoiceRecorderPopover";

function createProps(overrides = {}) {
  return {
    isOpen: true,
    isRecording: true,
    isProcessing: false,
    transcript: "Captured intro text",
    error: null,
    onCancel: vi.fn(),
    onStopAndSend: vi.fn(),
    ...overrides,
  };
}

describe("VoiceRecorderPopover", () => {
  it("does not render when closed", () => {
    const { container } = render(
      <VoiceRecorderPopover {...createProps({ isOpen: false })} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders listening state with transcript preview and actions", () => {
    const props = createProps();

    render(<VoiceRecorderPopover {...props} />);

    expect(
      screen.getByRole("dialog", { name: "Voice recorder" })
    ).toBeInTheDocument();
    expect(screen.getByText("Listening... Speak naturally.")).toBeInTheDocument();
    expect(screen.getByRole("status", { name: "Transcript preview" })).toHaveAttribute(
      "aria-live",
      "polite"
    );
    expect(screen.getByRole("status", { name: "Transcript preview" })).toHaveAttribute(
      "aria-atomic",
      "true"
    );
    expect(screen.getByLabelText("Transcript preview")).toHaveTextContent(
      "Captured intro text"
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancel recording" }));
    fireEvent.click(screen.getByRole("button", { name: "Stop and send recording" }));

    expect(props.onCancel).toHaveBeenCalledTimes(1);
    expect(props.onStopAndSend).toHaveBeenCalledTimes(1);
  });

  it("renders processing state and disables stop while sending", () => {
    render(
      <VoiceRecorderPopover
        {...createProps({
          isRecording: false,
          isProcessing: true,
          transcript: "Final transcript",
        })}
      />
    );

    expect(screen.getByText("Processing your recording...")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Stop and send recording" })
    ).toBeDisabled();
  });

  it("prioritizes error messaging and shows placeholder when transcript is empty", () => {
    render(
      <VoiceRecorderPopover
        {...createProps({
          isRecording: false,
          error: "Microphone permission denied",
          transcript: "",
        })}
      />
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Microphone permission denied"
    );
    expect(screen.getByText("Recorder ready.")).toHaveAttribute(
      "aria-live",
      "polite"
    );
    expect(screen.getByLabelText("Transcript preview")).toHaveTextContent(
      "Transcript will appear here."
    );
  });
});
