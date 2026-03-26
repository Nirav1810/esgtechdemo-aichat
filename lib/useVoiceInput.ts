import { useState, useRef, useCallback, useEffect } from "react";

interface UseVoiceInputOptions {
  onTranscriptionComplete?: (text: string) => void | Promise<void>;
  onError?: (error: string) => void;
}

interface UseVoiceInputReturn {
  isRecording: boolean;
  isProcessing: boolean;
  transcript: string;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  cancelRecording: () => void;
  resetTranscript: () => void;
  isSupported: boolean;
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function floatTo16BitPCM(output: DataView, offset: number, input: Float32Array) {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
}

function encodeWAV(samples: Float32Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, samples.length * 2, true);

  floatTo16BitPCM(view, 44, samples);

  return new Blob([view], { type: 'audio/wav' });
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

  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const audioDataRef = useRef<Float32Array[]>([]);
  const recordingLengthRef = useRef(0);
  const shouldTranscribeOnStopRef = useRef(true);
  const recognitionRef = useRef<any>(null);

  const stopActiveStream = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    setIsSupported(
      typeof window !== "undefined" &&
      !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    );
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
      setTranscript("");
      audioDataRef.current = [];
      recordingLengthRef.current = 0;
      shouldTranscribeOnStopRef.current = true;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        },
      });

      streamRef.current = stream;

      // Start Live Preview via Web Speech API
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        // This variable keeps track of the final transcript pieces across restarts if we needed to,
        // but continuous stream event.results contains everything from the start of the session.
        recognition.onresult = (event: any) => {
          let fullTranscript = "";
          for (let i = 0; i < event.results.length; ++i) {
            fullTranscript += event.results[i][0].transcript;
          }
          setTranscript(fullTranscript);
        };

        recognition.onerror = (e: any) => {
          console.warn("Speech recognition preview error:", e);
        };

        recognitionRef.current = recognition;
        try {
          recognition.start();
        } catch (e) {
          console.warn("Failed to start speech recognition preview", e);
        }
      }

      const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextCtor({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;

      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (!shouldTranscribeOnStopRef.current) return;
        const channelData = e.inputBuffer.getChannelData(0);
        audioDataRef.current.push(new Float32Array(channelData));
        recordingLengthRef.current += channelData.length;
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      setIsRecording(true);
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : "Failed to start recording";
      // Don't override existing error message unless there's a real failure starting
      if (!error || !error.includes("supported")) {
        setError(errMsg);
        onError?.(errMsg);
      }
      stopActiveStream();
    }
  }, [isSupported, onError, error, stopActiveStream]);

  const stopRecording = useCallback(async () => {
    if (!isRecording) return;

    setIsRecording(false);
    const audioContextSampleRate = audioContextRef.current?.sampleRate || 16000;

    // Disconnect processors
    if (processorRef.current) processorRef.current.disconnect();
    if (sourceRef.current) sourceRef.current.disconnect();

    if (!shouldTranscribeOnStopRef.current) {
      stopActiveStream();
      return;
    }

    setIsProcessing(true);

    try {
      const flattenedData = new Float32Array(recordingLengthRef.current);
      let offset = 0;
      for (let i = 0; i < audioDataRef.current.length; i++) {
        flattenedData.set(audioDataRef.current[i], offset);
        offset += audioDataRef.current[i].length;
      }

      const wavBlob = encodeWAV(flattenedData, audioContextSampleRate);

      const formData = new FormData();
      formData.append("audio", wavBlob, "audio.wav");

      const response = await fetch("/api/voice/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let msg = "Transcription failed";
        try {
          const data = await response.json();
          msg = data.error || msg;
        } catch {
          msg = await response.text() || msg;
        }
        throw new Error(msg);
      }

      const data = await response.json();
      const text = data.transcript || data.text || "";
      setTranscript(text);
      if (text.trim()) {
        await onTranscriptionComplete?.(text);
      }
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : "Transcription failed";
      setError(errMsg);
      onError?.(errMsg);
    } finally {
      setIsProcessing(false);
      stopActiveStream();
    }
  }, [isRecording, onTranscriptionComplete, onError, stopActiveStream]);

  const cancelRecording = useCallback(() => {
    shouldTranscribeOnStopRef.current = false;
    setIsRecording(false);
    setIsProcessing(false);
    stopActiveStream();
  }, [stopActiveStream]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      shouldTranscribeOnStopRef.current = false;
      stopActiveStream();
    };
  }, [stopActiveStream]);

  return {
    isRecording,
    isProcessing,
    transcript,
    error,
    startRecording,
    stopRecording,
    cancelRecording,
    resetTranscript,
    isSupported,
  };
}
