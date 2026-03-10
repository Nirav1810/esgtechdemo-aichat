"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Mic } from "lucide-react";

import VoiceRecorderPopover from "./VoiceRecorderPopover";
import { useVoiceInput } from "@/lib/useVoiceInput";

interface VoiceInputButtonProps {
  onTranscriptionComplete: (text: string) => void | Promise<void>;
  disabled?: boolean;
}

interface VoiceRecorderSessionProps {
  onClose: () => void;
  onTranscriptionComplete: (text: string) => void | Promise<void>;
}

function VoiceRecorderSession({
  onClose,
  onTranscriptionComplete,
}: VoiceRecorderSessionProps) {
  const {
    isSupported,
    isRecording,
    isProcessing,
    transcript,
    error,
    startRecording,
    stopRecording,
    cancelRecording,
  } = useVoiceInput({
      onTranscriptionComplete: async (text) => {
        try {
          if (text.trim()) {
            await onTranscriptionComplete(text);
          }
        } finally {
          onClose();
        }
      },
    });

  const handleCancel = useCallback(() => {
    cancelRecording();
    onClose();
  }, [cancelRecording, onClose]);

  useEffect(() => {
    if (isSupported) {
      void startRecording();
    }
  }, [isSupported, startRecording]);

  return (
    <VoiceRecorderPopover
      isOpen
      isRecording={isRecording}
      isProcessing={isProcessing}
      transcript={transcript}
      error={error}
      onCancel={handleCancel}
      onStopAndSend={stopRecording}
    />
  );
}

export default function VoiceInputButton({
  onTranscriptionComplete,
  disabled = false,
}: VoiceInputButtonProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    setIsSupported(typeof window !== "undefined" && "MediaRecorder" in window);
  }, []);

  const openPopover = useCallback(() => {
    if (!disabled) {
      setIsPopoverOpen(true);
    }
  }, [disabled]);

  const closePopover = useCallback(() => {
    setIsPopoverOpen(false);
  }, []);

  if (!isSupported) {
    return null;
  }

  return (
    <div className="relative flex items-end">
      <button
        type="button"
        onClick={openPopover}
        disabled={disabled || isPopoverOpen}
        aria-label="Open voice recorder"
        aria-haspopup="dialog"
        aria-expanded={isPopoverOpen}
        className="inline-flex h-11 w-11 items-center justify-center self-end rounded-xl bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-900 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300"
        title={disabled ? "Voice input unavailable" : "Record a voice message"}
      >
        <Mic className="h-5 w-5" />
      </button>

      {isPopoverOpen ? (
        <div className="absolute bottom-full left-0 z-50 mb-3 w-max max-w-[min(24rem,calc(100vw-2rem))]">
          <VoiceRecorderSession
            onClose={closePopover}
            onTranscriptionComplete={onTranscriptionComplete}
          />
        </div>
      ) : null}
    </div>
  );
}
