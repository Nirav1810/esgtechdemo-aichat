"use client";

import React from "react";

interface VoiceRecorderPopoverProps {
  isOpen: boolean;
  isRecording: boolean;
  isProcessing: boolean;
  transcript: string;
  error: string | null;
  onCancel: () => void;
  onStopAndSend: () => void;
}

export default function VoiceRecorderPopover({
  isOpen,
  isRecording,
  isProcessing,
  transcript,
  error,
  onCancel,
  onStopAndSend,
}: VoiceRecorderPopoverProps) {
  if (!isOpen) {
    return null;
  }

  const statusText = isProcessing
    ? "Processing your recording..."
    : isRecording
    ? "Listening... Speak naturally."
    : "Recorder ready.";

  const previewText = transcript.trim() || "Transcript will appear here.";

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Voice recorder"
      className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl shadow-slate-200/80 backdrop-blur sm:w-80"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">Voice recorder</p>
          <p aria-live="polite" className="mt-1 text-sm text-slate-600">
            {statusText}
          </p>
          {error && (
            <p role="alert" className="mt-2 text-sm font-medium text-rose-700">
              {error}
            </p>
          )}
        </div>
        <span
          aria-hidden="true"
          className={`mt-1 h-2.5 w-2.5 flex-none rounded-full ${
            error
              ? "bg-rose-500"
              : isProcessing
              ? "bg-amber-500"
              : isRecording
              ? "bg-emerald-500"
              : "bg-slate-300"
          }`}
        />
      </div>

      <div
        role="status"
        aria-label="Transcript preview"
        aria-live="polite"
        aria-atomic="true"
        className="mt-4 min-h-24 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-700"
      >
        {previewText}
      </div>

      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2"
          aria-label="Cancel recording"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onStopAndSend}
          disabled={isProcessing || !isRecording}
          className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-emerald-300"
          aria-label="Stop and send recording"
        >
          Stop & Send
        </button>
      </div>
    </div>
  );
}
