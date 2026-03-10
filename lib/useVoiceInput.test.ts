import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useVoiceInput } from "./useVoiceInput";

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
};

function createDeferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

class MockMediaRecorder {
  static instances: MockMediaRecorder[] = [];

  ondataavailable: ((event: { data: Blob }) => void) | null = null;
  onstop: (() => void | Promise<void>) | null = null;
  state: "inactive" | "recording" = "inactive";

  constructor(public stream: MediaStream) {
    MockMediaRecorder.instances.push(this);
  }

  start() {
    this.state = "recording";
  }

  stop() {
    this.state = "inactive";
    this.ondataavailable?.({
      data: new Blob(["audio"], { type: "audio/webm" }),
    });
    void this.onstop?.();
  }
}

function createResponse(payload: Record<string, unknown>) {
  return {
    ok: true,
    json: vi.fn().mockResolvedValue(payload),
  };
}

describe("useVoiceInput", () => {
  const getUserMedia = vi.fn();
  const fetchMock = vi.fn();
  const trackStop = vi.fn();
  const originalFetch = globalThis.fetch;
  const originalMediaRecorder = globalThis.MediaRecorder;
  const originalNavigator = window.navigator;
  const originalNavigatorDescriptor = Object.getOwnPropertyDescriptor(
    window,
    "navigator"
  );
  const stream = {
    getTracks: () => [{ stop: trackStop }],
  } as unknown as MediaStream;

  beforeEach(() => {
    MockMediaRecorder.instances = [];
    getUserMedia.mockReset();
    fetchMock.mockReset();
    trackStop.mockReset();

    getUserMedia.mockResolvedValue(stream);
    fetchMock.mockResolvedValue(createResponse({ transcript: "Hello world" }));

    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("MediaRecorder", MockMediaRecorder);

    Object.defineProperty(window, "navigator", {
      configurable: true,
      value: {
        mediaDevices: {
          getUserMedia,
        },
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();

    if (originalNavigatorDescriptor) {
      Object.defineProperty(window, "navigator", originalNavigatorDescriptor);
    }

    expect(globalThis.fetch).toBe(originalFetch);
    expect(globalThis.MediaRecorder).toBe(originalMediaRecorder);
    expect(window.navigator).toBe(originalNavigator);
  });

  it("starts recording when the browser supports voice input", async () => {
    const { result } = renderHook(() => useVoiceInput());

    await waitFor(() => {
      expect(result.current.isSupported).toBe(true);
    });

    await act(async () => {
      await result.current.startRecording();
    });

    expect(getUserMedia).toHaveBeenCalledWith({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 16000,
      },
    });
    expect(result.current.isRecording).toBe(true);
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("enters processing after stop and completes with the transcript", async () => {
    const transcription = createDeferred<{ ok: boolean; json: () => Promise<{ transcript: string }> }>();
    fetchMock.mockReturnValueOnce(transcription.promise);

    const onTranscriptionComplete = vi.fn();
    const { result } = renderHook(() =>
      useVoiceInput({ onTranscriptionComplete })
    );

    await waitFor(() => {
      expect(result.current.isSupported).toBe(true);
    });

    await act(async () => {
      await result.current.startRecording();
    });

    act(() => {
      result.current.stopRecording();
    });

    expect(result.current.isRecording).toBe(false);
    expect(result.current.isProcessing).toBe(true);

    await act(async () => {
      transcription.resolve(createResponse({ transcript: "Hello world" }) as never);
      await transcription.promise;
    });

    await waitFor(() => {
      expect(result.current.isProcessing).toBe(false);
      expect(result.current.transcript).toBe("Hello world");
    });

    expect(onTranscriptionComplete).toHaveBeenCalledWith("Hello world");
    expect(trackStop).toHaveBeenCalledTimes(1);
  });

  it("clears prior transcript and error when a new recording starts", async () => {
    fetchMock.mockResolvedValueOnce(createResponse({ transcript: "First pass" }));

    const { result } = renderHook(() => useVoiceInput());

    await waitFor(() => {
      expect(result.current.isSupported).toBe(true);
    });

    await act(async () => {
      await result.current.startRecording();
    });

    act(() => {
      result.current.stopRecording();
    });

    await waitFor(() => {
      expect(result.current.transcript).toBe("First pass");
    });

    await act(async () => {
      await result.current.startRecording();
    });

    expect(result.current.transcript).toBe("");
    expect(result.current.error).toBeNull();

    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: vi.fn().mockResolvedValue({ error: "Mic failed" }),
    });

    act(() => {
      result.current.stopRecording();
    });

    await waitFor(() => {
      expect(result.current.error).toBe("Mic failed");
    });

    await act(async () => {
      await result.current.startRecording();
    });

    expect(result.current.transcript).toBe("");
    expect(result.current.error).toBeNull();
    expect(result.current.isRecording).toBe(true);
  });

  it("resetTranscript clears transcript and error deterministically", async () => {
    fetchMock
      .mockResolvedValueOnce(createResponse({ transcript: "Saved text" }))
      .mockResolvedValueOnce({
        ok: false,
        json: vi.fn().mockResolvedValue({ error: "Mic failed" }),
      });

    const { result } = renderHook(() => useVoiceInput());

    await waitFor(() => {
      expect(result.current.isSupported).toBe(true);
    });

    await act(async () => {
      await result.current.startRecording();
    });

    act(() => {
      result.current.stopRecording();
    });

    await waitFor(() => {
      expect(result.current.transcript).toBe("Saved text");
    });

    await act(async () => {
      await result.current.startRecording();
    });

    act(() => {
      result.current.stopRecording();
    });

    await waitFor(() => {
      expect(result.current.error).toBe("Mic failed");
    });

    act(() => {
      result.current.resetTranscript();
    });

    expect(result.current.transcript).toBe("");
    expect(result.current.error).toBeNull();
  });

  it("stays processing until an async completion callback settles", async () => {
    const callbackDone = createDeferred<void>();
    const onTranscriptionComplete = vi
      .fn()
      .mockImplementation(() => callbackDone.promise);

    const { result } = renderHook(() =>
      useVoiceInput({ onTranscriptionComplete })
    );

    await waitFor(() => {
      expect(result.current.isSupported).toBe(true);
    });

    await act(async () => {
      await result.current.startRecording();
    });

    act(() => {
      result.current.stopRecording();
    });

    await waitFor(() => {
      expect(onTranscriptionComplete).toHaveBeenCalledWith("Hello world");
    });

    expect(result.current.isProcessing).toBe(true);

    await act(async () => {
      callbackDone.resolve();
      await callbackDone.promise;
    });

    await waitFor(() => {
      expect(result.current.isProcessing).toBe(false);
    });
  });

  it("does not upload or complete transcription when the recorder unmounts during cancel", async () => {
    const onTranscriptionComplete = vi.fn();
    const { result, unmount } = renderHook(() =>
      useVoiceInput({ onTranscriptionComplete })
    );

    await waitFor(() => {
      expect(result.current.isSupported).toBe(true);
    });

    await act(async () => {
      await result.current.startRecording();
    });

    expect(MockMediaRecorder.instances).toHaveLength(1);

    unmount();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(onTranscriptionComplete).not.toHaveBeenCalled();
    expect(trackStop).toHaveBeenCalledTimes(1);
  });

  it("cancels an active recording without uploading audio", async () => {
    const onTranscriptionComplete = vi.fn();
    const { result } = renderHook(() =>
      useVoiceInput({ onTranscriptionComplete })
    );

    await waitFor(() => {
      expect(result.current.isSupported).toBe(true);
    });

    await act(async () => {
      await result.current.startRecording();
    });

    act(() => {
      result.current.cancelRecording();
    });

    expect(result.current.isRecording).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(onTranscriptionComplete).not.toHaveBeenCalled();
    expect(trackStop).toHaveBeenCalledTimes(1);
  });
});
