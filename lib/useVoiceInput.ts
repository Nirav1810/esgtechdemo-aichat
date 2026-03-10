import { useState, useRef, useCallback, useEffect } from "react";

interface UseVoiceInputOptions {
  onTranscriptionComplete?: (text: string) => void;
  onError?: (error: string) => void;
}

interface UseVoiceInputReturn {
  isRecording: boolean;
  isProcessing: boolean;
  transcript: string;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  resetTranscript: () => void;
  isSupported: boolean;
}

export function useVoiceInput(
  options: UseVoiceInputOptions = {}
): UseVoiceInputReturn {
  const { onTranscriptionComplete, onError } = options;

  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    setIsSupported(typeof window !== "undefined" && "MediaRecorder" in window);
  }, []);

  const startRecording = useCallback(async () => {
    if (!isSupported) {
      const errMsg = "Voice recording is not supported in this browser.";
      setError(errMsg);
      onError?.(errMsg);
      return;
    }

    try {
      setError(null);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        },
      });

      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);

        try {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });

          const formData = new FormData();
          formData.append("audio", audioBlob, "audio.webm");

          const response = await fetch("/api/voice/transcribe", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || "Transcription failed");
          }

          const data = await response.json();
          console.log("Transcription response:", data);
          const text = data.transcript || data.text || "";
          console.log("Transcribed text:", text);
          setTranscript(text);
          if (text.trim()) {
            onTranscriptionComplete?.(text);
          }
        } catch (err) {
          const errMsg =
            err instanceof Error ? err.message : "Transcription failed";
          setError(errMsg);
          onError?.(errMsg);
        } finally {
          setIsProcessing(false);
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
          }
        }
      };

      mediaRecorder.start(100);
      setIsRecording(true);
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : "Failed to start recording";
      setError(errMsg);
      onError?.(errMsg);
    }
  }, [isSupported, onTranscriptionComplete, onError]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  return {
    isRecording,
    isProcessing,
    transcript,
    error,
    startRecording,
    stopRecording,
    resetTranscript,
    isSupported,
  };
}
