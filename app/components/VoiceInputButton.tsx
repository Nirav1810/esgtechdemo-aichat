"use client";

import React from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useVoiceInput } from "@/lib/useVoiceInput";

interface VoiceInputButtonProps {
  onTranscriptionComplete: (text: string) => void;
  disabled?: boolean;
}

export default function VoiceInputButton({
  onTranscriptionComplete,
  disabled = false,
}: VoiceInputButtonProps) {
  const {
    isRecording,
    isProcessing,
    error,
    startRecording,
    stopRecording,
    isSupported,
  } = useVoiceInput({
    onTranscriptionComplete: (text) => {
      console.log("VoiceInputButton received transcription:", text);
      if (text.trim()) {
        onTranscriptionComplete(text);
      }
    },
    onError: (err) => {
      console.error("Voice input error:", err);
    },
  });

  const handleClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || isProcessing}
        className={`p-2.5 rounded-lg transition-all duration-200 ${
          isRecording
            ? "bg-red-500 text-white animate-pulse"
            : isProcessing
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : disabled
            ? "bg-gray-100 text-gray-300 cursor-not-allowed"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
        }`}
        title={
          isRecording
            ? "Stop recording"
            : isProcessing
            ? "Processing..."
            : disabled
            ? "Voice input unavailable"
            : "Click to start voice input"
        }
      >
        {isProcessing ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isRecording ? (
          <MicOff className="w-5 h-5" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </button>

      {error && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-red-100 text-red-700 text-xs rounded-lg whitespace-nowrap z-50">
          {error}
        </div>
      )}

      {isRecording && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs rounded-lg whitespace-nowrap z-50 flex items-center gap-1.5">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          Recording... Click to stop
        </div>
      )}
    </div>
  );
}
