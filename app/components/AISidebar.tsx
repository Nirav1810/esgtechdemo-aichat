"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { MessageCircle, X, Send, Leaf, AlertTriangle, Download, Paperclip, FileText, Image as ImageIcon, Clock, Plus, Trash2, LogOut, History, GripVertical, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import VoiceInputButton from "./VoiceInputButton";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import DownloadChatPDF from "./DownloadChatPDF";

// Interface for structured analysis responses
interface AnalysisData {
  format: "analysis";
  positives: string[];
  negatives: string[];
  summary: string;
}

// API Configuration
const API_URL = "/api/chat";
const IMAGE_API_URL = "/api/image-generate";
const MAX_FILES = 5;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const IMAGE_GENERATION_MODELS = [
  "hunyuan-image-3",
  "z-image-turbo",
  "FLUX.1-schnell",
  "Qwen-Image-2512",
];
const ASK_AI_MODELS = [

  "Qwen/Qwen3-235B-A22B-Instruct-2507-TEE",
  "deepseek-ai/DeepSeek-V3.2-TEE",
  "NousResearch/Hermes-4-405B-FP8-TEE",
  "zai-org/GLM-4.7-TEE",
  "Qwen/Qwen3-32B",
];
const TEXTAREA_MIN_HEIGHT = 44;
const TEXTAREA_MAX_HEIGHT = 120;

const isSupportedUpload = (file: File): boolean => {
  const mime = (file.type || "").toLowerCase();
  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  const supportedText = new Set(["txt", "md", "csv", "json", "log", "pdf"]);
  const supportedImages = new Set(["png", "jpg", "jpeg", "webp", "gif"]);
  return (
    mime.startsWith("image/") ||
    mime.startsWith("text/") ||
    mime === "application/pdf" ||
    mime === "application/json" ||
    supportedText.has(extension) ||
    supportedImages.has(extension)
  );
};

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const readFileAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to generate image preview."));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.readAsDataURL(file);
  });

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date | string;
  generatedImageDataUrl?: string;
  generatedImageMimeType?: string;
  generatedImageModel?: string;
  attachments?: {
    name: string;
    size: number;
    kind: "image" | "document";
    previewDataUrl?: string;
  }[];
}

interface Chat {
  _id: string;
  userId: string;
  pageType: "dashboard" | "ghg-report";
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

interface ComposerAttachment {
  file: File;
  name: string;
  size: number;
  kind: "image" | "document";
  previewDataUrl?: string;
}

interface AISidebarProps {
  isOpen: boolean;
  onClose: () => void;
  contextData: string;
  pageType: "dashboard" | "ghg-report";
  title?: string;
  subtitle?: string;
  width?: number;
  onWidthChange?: (width: number) => void;
  isDetached?: boolean;
  onDetach?: () => void;
}

// Helper function to clean LaTeX/math notation from AI responses
const cleanLatex = (content: string): string => {
  return content
    .replace(/\\\[\s*([\s\S]+?)\s*\\\]/g, "$1")
    .replace(/\\\(\s*([\s\S]+?)\s*\\\)/g, "$1")
    .replace(/\$\$\s*([\s\S]+?)\s*\$\$/g, "$1")
    .replace(/\$\s*([^$\n]+?)\s*\$/g, "$1")
    .replace(/\\text\{([^}]+)\}/g, "$1")
    .replace(/\\textbf\{([^}]+)\}/g, "**$1**")
    .replace(/\\textit\{([^}]+)\}/g, "*$1*")
    .replace(/\\begin\{[^}]+\}\s*/g, "")
    .replace(/\\end\{[^}]+\}\s*/g, "")
    .replace(/\\times/g, "×")
    .replace(/\\approx/g, "≈")
    .replace(/\\%/g, "%")
    .replace(/\\,/g, " ")
    .replace(/\\!/g, "")
    .replace(/_\{([^}]+)\}/g, "$1")
    .replace(/\^\{([^}]+)\}/g, "$1")
    .replace(/>\s+</g, "><")  // Only collapse spaces between tags
    .replace(/\n{3,}/g, "\n\n");
};

// Dashboard example questions
const dashboardExamples = [
  "What are Scope 1, 2, and 3 emissions?",
  "How can we reduce our carbon footprint?",
  "Explain the GHG Protocol standards",
  "What does Net Zero mean for our company?",
  "How do I calculate total GHG emissions?",
];

// GHG Report example questions
const ghgReportExamples = [
  "Summarize all emissions data",
  "What is the highest emission source?",
  "Explain what Stationary Combustion means",
  "Compare Scope 1 vs Scope 2 vs Scope 3",
  "Summarize the Purchased Goods data",
  "Which site has the highest emissions?",
  "Explain Fugitive Emissions",
  "What does 'Loop' mean in Purchased Goods?",
];

// Try to parse structured analysis JSON from content
const parseAnalysisData = (content: string): AnalysisData | null => {
  try {
    let trimmed = content.trim();

    // Remove markdown code fences if present (```json ... ```)
    const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      trimmed = codeBlockMatch[1].trim();
    }

    // Check if content looks like JSON
    if (trimmed.startsWith("{")) {
      // For partial JSON during streaming, try to parse what we have
      // Remove any trailing incomplete content
      let jsonToParse = trimmed;

      // Find the last complete string/array/object
      // This is a best-effort approach for streaming JSON
      if (!trimmed.endsWith("}")) {
        // Try to find a valid JSON substring
        const lastBrace = trimmed.lastIndexOf("}");
        const lastBracket = trimmed.lastIndexOf("]");
        const lastQuote = trimmed.lastIndexOf('"');
        const lastValidEnd = Math.max(lastBrace, lastBracket, lastQuote);

        if (lastValidEnd > 0) {
          // Try parsing up to the last valid closing character
          jsonToParse = trimmed.substring(0, lastValidEnd + 1);
          // Make sure we have a closing brace for the object
          if (!jsonToParse.endsWith("}")) {
            jsonToParse += "}";
          }
        }
      }

      try {
        const parsed = JSON.parse(jsonToParse);

        // Validate the structure - be more lenient during streaming
        if (parsed.format === "analysis") {
          return {
            format: "analysis",
            positives: Array.isArray(parsed.positives) ? parsed.positives : [],
            negatives: Array.isArray(parsed.negatives) ? parsed.negatives : [],
            summary: typeof parsed.summary === "string" ? parsed.summary : "",
          } as AnalysisData;
        }
      } catch {
        // Try parsing the original without modification
        const parsed = JSON.parse(trimmed);
        if (parsed.format === "analysis") {
          return {
            format: "analysis",
            positives: Array.isArray(parsed.positives) ? parsed.positives : [],
            negatives: Array.isArray(parsed.negatives) ? parsed.negatives : [],
            summary: typeof parsed.summary === "string" ? parsed.summary : "",
          } as AnalysisData;
        }
      }
    }
  } catch {
    // Not valid JSON, return null
  }
  return null;
};

// Analysis Card Component - renders positives in green, negatives in red
const AnalysisCard = ({
  data,
  isStreaming = false,
}: {
  data: AnalysisData;
  isStreaming?: boolean;
}) => {
  const showPositives = data.positives.length > 0 || isStreaming;
  const showNegatives = data.negatives.length > 0 || isStreaming;

  return (
    <div className="space-y-4">
      {/* Summary */}
      {(data.summary || isStreaming) && (
        <p className="text-gray-700 text-sm leading-relaxed">
          {data.summary || (isStreaming && <span className="inline-flex items-center gap-1">Analyzing<span className="animate-pulse">...</span></span>)}
        </p>
      )}

      {/* Positives Section - Only show if we have data or are streaming */}
      {showPositives && (
        <div className={`bg-emerald-50 border border-emerald-200 rounded-xl p-4 ${isStreaming && data.positives.length === 0 ? 'opacity-70' : ''}`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4 text-emerald-600" />
            </div>
            <h4 className="font-semibold text-emerald-800">Positives</h4>
            {isStreaming && data.positives.length === 0 && (
              <span className="text-xs text-emerald-600 animate-pulse">Analysing...</span>
            )}
          </div>
          {data.positives.length > 0 ? (
            <ul className="space-y-2">
              {data.positives.map((point, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5 flex-shrink-0">+</span>
                  <span className="text-emerald-700 text-sm">{point}</span>
                </li>
              ))}
            </ul>
          ) : isStreaming ? (
            <div className="space-y-2">
              <div className="h-4 bg-emerald-200/50 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-emerald-200/50 rounded animate-pulse w-1/2"></div>
            </div>
          ) : null}
        </div>
      )}

      {/* Negatives Section - Only show if we have data or are streaming */}
      {showNegatives && (
        <div className={`bg-red-50 border border-red-200 rounded-xl p-4 ${isStreaming && data.negatives.length === 0 ? 'opacity-70' : ''}`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <h4 className="font-semibold text-red-800">Negatives</h4>
            {isStreaming && data.negatives.length === 0 && (
              <span className="text-xs text-red-600 animate-pulse">Analysing...</span>
            )}
          </div>
          {data.negatives.length > 0 ? (
            <ul className="space-y-2">
              {data.negatives.map((point, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5 flex-shrink-0">-</span>
                  <span className="text-red-700 text-sm">{point}</span>
                </li>
              ))}
            </ul>
          ) : isStreaming ? (
            <div className="space-y-2">
              <div className="h-4 bg-red-200/50 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-red-200/50 rounded animate-pulse w-1/2"></div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default function AISidebar({
  isOpen,
  onClose,
  contextData,
  pageType,
  title = "AI Companion",
  subtitle = "Powered by Chutes AI",
  width: initialWidth,
  onWidthChange,
  isDetached = false,
  onDetach,
}: AISidebarProps) {
  const starGradientId = useId();
  const starHighlightId = useId();
  const exampleQuestions =
    pageType === "dashboard" ? dashboardExamples : ghgReportExamples;

  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        pageType === "dashboard"
          ? "Hello! I'm your ESG AI Assistant. Ask me anything about your GHG emissions data, sustainability metrics, or how to improve your environmental impact."
          : "Hello! I'm your GHG Report AI Assistant. I can help you summarize emissions data, explain specific emission categories, compare scopes, or analyze any field in this report. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [imageMessages, setImageMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your Image Generator. Describe what you want, or attach a reference image and I will create a variation.",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);
  const [isGeneratingPPT, setIsGeneratingPPT] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<ComposerAttachment[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedImageModel, setSelectedImageModel] = useState<string>(
    IMAGE_GENERATION_MODELS[0]
  );
  const [selectedAskModel, setSelectedAskModel] = useState<string>(
    ASK_AI_MODELS[0]
  );
  const [interactionMode, setInteractionMode] = useState<"chat" | "image">(
    "chat"
  );
  const [loadingLabel, setLoadingLabel] = useState<string>("Analysing");
  const [sidebarWidth, setSidebarWidth] = useState<number>(initialWidth || 400);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarWidthRef = useRef(initialWidth || 400);
  const isResizingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const streamingMessageIndexRef = useRef<number | null>(null);
  const streamingModeRef = useRef<"chat" | "image" | null>(null);
  const isStreamingJSONRef = useRef<boolean>(false);
  const streamedContentRef = useRef<string>("");

  const chatMessagesRef = useRef<Message[]>(chatMessages);
  const imageMessagesRef = useRef<Message[]>(imageMessages);

  useEffect(() => {
    chatMessagesRef.current = chatMessages;
  }, [chatMessages]);

  useEffect(() => {
    imageMessagesRef.current = imageMessages;
  }, [imageMessages]);

  // Session and Chat History
  const { data: session, status } = useSession();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [showChatList, setShowChatList] = useState(false);

  // Load chats when session is available and sidebar opens
  useEffect(() => {
    if (session?.user && isOpen) {
      loadChats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, isOpen, pageType]);

  // Sync width from props
  useEffect(() => {
    if (initialWidth) {
      setSidebarWidth(initialWidth);
    }
  }, [initialWidth]);

  // Resize handlers - using direct DOM manipulation for smooth performance
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizingRef.current = true;
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current || !containerRef.current) return;
      const newWidth = window.innerWidth - e.clientX;
      const clampedWidth = Math.min(Math.max(newWidth, 250), 800);
      sidebarWidthRef.current = clampedWidth;
      // Direct DOM manipulation - no re-render during drag
      containerRef.current.style.width = `${clampedWidth}px`;
    };

    const handleMouseUp = () => {
      if (isResizingRef.current) {
        isResizingRef.current = false;
        setIsResizing(false);
        // Sync final width to React state and parent
        setSidebarWidth(sidebarWidthRef.current);
        onWidthChange?.(sidebarWidthRef.current);
      }
    };

    if (isResizing) {
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, onWidthChange]);

  const loadChats = async () => {
    if (!session?.user) return;
    setIsLoadingChats(true);
    try {
      const res = await fetch(`/api/chats?pageType=${pageType}`);
      const data = await res.json();
      if (data.chats) {
        setChats(data.chats);
      }
    } catch (error) {
      console.error("Error loading chats:", error);
    } finally {
      setIsLoadingChats(false);
    }
  };

  const createNewChat = async () => {
    // Just clear messages and reset currentChatId - don't create empty chat in DB
    // A new chat will be created when the user sends their first message
    setCurrentChatId(null);
    setChatMessages(getInitialMessages());
    setShowChatList(false);
  };

  const createNewChatWithMessages = async (chatPageType: string, messages: Message[]) => {
    if (!session?.user) {
      return;
    }
    try {
      // Get title from first user message
      const firstUserMessage = messages.find(m => m.role === 'user');
      const title = firstUserMessage
        ? firstUserMessage.content.slice(0, 50) + (firstUserMessage.content.length > 50 ? '...' : '')
        : 'New Chat';

      // Serialize messages - convert Date to string
      const serializedMessages = messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp instanceof Date ? msg.timestamp.toISOString() : msg.timestamp,
      }));

      const res = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageType: chatPageType,
          title,
          messages: serializedMessages,
        }),
      });

      if (!res.ok) {
        const errorData = await res.text();
        console.error("Failed to create chat:", res.status, errorData);
        return;
      }

      const data = await res.json();
      if (data.chat) {
        setChats(prevChats => [data.chat, ...prevChats]);
        setCurrentChatId(data.chat._id);
      }
    } catch (error) {
      console.error("Error creating chat with messages:", error);
    }
  };

  const selectChat = async (chatId: string) => {
    if (!session?.user) return;
    try {
      const res = await fetch(`/api/chats/${chatId}`);
      const data = await res.json();
      if (data.chat) {
        const loadedMessages = data.chat.messages.map((msg: Message) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setChatMessages(loadedMessages);
        setCurrentChatId(chatId);
        setShowChatList(false);
      }
    } catch (error) {
      console.error("Error loading chat:", error);
    }
  };

  const saveChat = async (messages: Message[]) => {
    if (!session?.user || !currentChatId) return;
    try {
      // Get first user message as title, or use default
      const firstUserMessage = messages.find(m => m.role === 'user');
      const title = firstUserMessage
        ? firstUserMessage.content.slice(0, 50) + (firstUserMessage.content.length > 50 ? '...' : '')
        : 'New Chat';

      // Serialize messages - convert Date to string
      const serializedMessages = messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp instanceof Date ? msg.timestamp.toISOString() : msg.timestamp,
      }));

      const res = await fetch(`/api/chats/${currentChatId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: serializedMessages,
          title,
        }),
      });

      if (!res.ok) {
        const errorData = await res.text();
        console.error("Failed to save chat:", res.status, errorData);
        return;
      }

      // Update chat in local list
      setChats(prevChats => prevChats.map(chat =>
        chat._id === currentChatId
          ? { ...chat, title, messages, updatedAt: new Date().toISOString() }
          : chat
      ));
    } catch (error) {
      console.error("Error saving chat:", error);
    }
  };

  const deleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session?.user) return;
    try {
      await fetch(`/api/chats/${chatId}`, { method: 'DELETE' });
      setChats(chats.filter(chat => chat._id !== chatId));
      if (currentChatId === chatId) {
        setCurrentChatId(null);
        setChatMessages(getInitialMessages());
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const getInitialMessages = () => [
    {
      role: "assistant" as const,
      content:
        pageType === "dashboard"
          ? "Hello! I'm your ESG AI Assistant. Ask me anything about your GHG emissions data, sustainability metrics, or how to improve your environmental impact."
          : "Hello! I'm your GHG Report AI Assistant. I can help you summarize emissions data, explain specific emission categories, compare scopes, or analyze any field in this report. What would you like to know?",
      timestamp: new Date(),
    },
  ];

  const resizeTextarea = (element: HTMLTextAreaElement) => {
    if (!element.value.trim()) {
      element.style.height = `${TEXTAREA_MIN_HEIGHT}px`;
      element.style.overflowY = "hidden";
      return;
    }

    element.style.height = "auto";
    const targetHeight = Math.min(
      Math.max(element.scrollHeight, TEXTAREA_MIN_HEIGHT),
      TEXTAREA_MAX_HEIGHT
    );
    element.style.height = `${targetHeight}px`;
    element.style.overflowY =
      element.scrollHeight > TEXTAREA_MAX_HEIGHT ? "auto" : "hidden";
  };

  const updateMessagesForMode = (
    mode: "chat" | "image",
    updater: (prev: Message[]) => Message[]
  ) => {
    if (mode === "chat") {
      setChatMessages(updater);
      return;
    }
    setImageMessages(updater);
  };

  const activeMessages = interactionMode === "chat" ? chatMessages : imageMessages;

  const resetTextareaHeight = () => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = `${TEXTAREA_MIN_HEIGHT}px`;
    textareaRef.current.style.overflowY = "hidden";
  };

  const startAssistantMessage = (mode: "chat" | "image") => {
    const placeholder: Message = {
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };
    updateMessagesForMode(mode, (prev) => {
      const updated = [...prev, placeholder];
      streamingMessageIndexRef.current = updated.length - 1;
      streamingModeRef.current = mode;
      return updated;
    });
    // Reset JSON detection refs
    isStreamingJSONRef.current = false;
    streamedContentRef.current = "";
  };

  const updateStreamingMessage = (updater: (msg: Message) => Message) => {
    const mode = streamingModeRef.current;
    const index = streamingMessageIndexRef.current;
    if (index === null || !mode) return;
    updateMessagesForMode(mode, (prev) => {
      if (index < 0 || index >= prev.length) return prev;
      const updated = [...prev];
      updated[index] = updater(updated[index]);
      return updated;
    });
  };

  const appendToStreamingMessage = (text: string) => {
    if (!text) return;

    // Accumulate content for JSON detection
    streamedContentRef.current += text;
    const accumulated = streamedContentRef.current;

    // Check if this looks like JSON (starts with { or ```json)
    const looksLikeJSON = accumulated.startsWith("{") ||
      accumulated.startsWith("```json") ||
      accumulated.startsWith("```");

    if (looksLikeJSON) {
      // Mark as JSON streaming
      isStreamingJSONRef.current = true;

      // Always update the message content so we can parse it in the render
      // The AnalysisCard will handle the rendering when valid JSON is detected
      setStreamingMessageContent(accumulated);
      return;
    }

    // Not JSON, show normally
    updateStreamingMessage((msg) => ({
      ...msg,
      content: `${msg.content}${text}`,
      timestamp: new Date(),
    }));
  };

  const setStreamingMessageContent = (text: string) => {
    updateStreamingMessage((msg) => ({
      ...msg,
      content: text,
      timestamp: new Date(),
    }));
  };

  const clearStreamingMessage = () => {
    streamingMessageIndexRef.current = null;
    streamingModeRef.current = null;
    isStreamingJSONRef.current = false;
    streamedContentRef.current = "";
  };

  const remainingExamples = exampleQuestions.filter(
    (q) => !askedQuestions.includes(q)
  );
  const showExamples =
    interactionMode === "chat" &&
    remainingExamples.length > 0 &&
    inputMessage.length === 0;

  const handleStream = async (body: ReadableStream<Uint8Array> | null) => {
    if (!body) {
      throw new Error("Streaming not supported by this browser");
    }

    const reader = body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let received = false;
    let doneReading = false;

    while (!doneReading) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";

      for (const event of events) {
        const lines = event.split("\n");
        for (const rawLine of lines) {
          const line = rawLine.trim();
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (!payload) continue;
          if (payload === "[DONE]") {
            doneReading = true;
            break;
          }

          try {
            const data = JSON.parse(payload);
            const delta = data.choices?.[0]?.delta?.content;
            const messageContent = data.choices?.[0]?.message?.content;
            const chunk = Array.isArray(delta)
              ? delta.join("")
              : delta ||
              (Array.isArray(messageContent)
                ? messageContent.join("")
                : messageContent);

            if (chunk) {
              appendToStreamingMessage(chunk);
              received = true;
            }
          } catch (error) {
            console.error("Error parsing stream chunk", error);
          }
        }
      }
    }

    if (!received) {
      throw new Error("Empty response from AI model");
    }
  };

  const streamModelResponse = async (question: string, files: File[], history: Message[] = []) => {
    let response: Response;

    // Convert messages to simple format for API
    const historyForApi = history.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    if (files.length > 0) {
      const formData = new FormData();
      formData.append("question", question);
      formData.append("contextData", contextData);
      formData.append("pageType", pageType);
      formData.append("model", selectedAskModel);
      formData.append("history", JSON.stringify(historyForApi));
      files.forEach((file) => {
        formData.append("files", file);
      });

      response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });
    } else {
      response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          contextData,
          pageType,
          model: selectedAskModel,
          history: historyForApi,
        }),
      });
    }

    if (!response.ok) {
      const errorData = await response.text();
      console.error("API Error from /api/chat:", errorData);
      throw new Error(`API Error: ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/event-stream")) {
      await handleStream(response.body);
      return;
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(
        typeof data.error === "string"
          ? data.error
          : data.error.message || "API returned an error"
      );
    }

    const aiResponse =
      data.answer ||
      data.content ||
      data.message ||
      data.choices?.[0]?.message?.content;
    if (!aiResponse || aiResponse.trim() === "") {
      throw new Error("Empty response from AI model");
    }

    appendToStreamingMessage(aiResponse);
  };

  const requestImageGeneration = async (prompt: string, files: File[]) => {
    const cleanedPrompt = prompt
      .replace(/^\/(image|img)\s+/i, "")
      .trim();
    let response: Response;
    const referenceImage = files.find((file) =>
      (file.type || "").toLowerCase().startsWith("image/")
    );

    if (referenceImage) {
      const formData = new FormData();
      formData.append("prompt", cleanedPrompt);
      formData.append("model", selectedImageModel);
      formData.append("referenceImage", referenceImage);

      response = await fetch(IMAGE_API_URL, {
        method: "POST",
        body: formData,
      });
    } else {
      response = await fetch(IMAGE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: cleanedPrompt,
          model: selectedImageModel,
        }),
      });
    }

    if (!response.ok) {
      const raw = await response.text();
      try {
        const parsed = JSON.parse(raw);
        const message =
          typeof parsed?.error === "string"
            ? parsed.error
            : typeof parsed?.details === "string"
              ? parsed.details
              : raw;
        throw new Error(message || `Image API error: ${response.status}`);
      } catch {
        throw new Error(raw || `Image API error: ${response.status}`);
      }
    }

    const data = await response.json();
    if (!data?.imageDataUrl) {
      throw new Error("Image API returned no image data.");
    }

    return {
      imageDataUrl: data.imageDataUrl as string,
      mimeType: (data.mimeType as string) || "image/png",
      modelUsed: (data.modelUsed as string) || selectedImageModel,
    };
  };

  const processQuestion = async (question: string, fromExample = false) => {
    const trimmedQuestion = question.trim();
    const effectiveQuestion =
      trimmedQuestion ||
      (attachedFiles.length > 0
        ? interactionMode === "image"
          ? "Create a high quality ESG-themed variation of the attached image."
          : "Please summarize the attached file(s)."
        : "");
    if (!effectiveQuestion) return;

    const userMessage: Message = {
      role: "user",
      content: effectiveQuestion,
      timestamp: new Date(),
      attachments: attachedFiles.length
        ? attachedFiles.map((file) => ({
          name: file.name,
          size: file.size,
          kind: file.kind,
          previewDataUrl: file.previewDataUrl,
        }))
        : undefined,
    };

    const activeMode = interactionMode;
    updateMessagesForMode(activeMode, (prev) => [...prev, userMessage]);
    if (fromExample) {
      setAskedQuestions((prev) => [...prev, effectiveQuestion]);
    } else {
      setInputMessage("");
      resetTextareaHeight();
    }

    const filesForRequest = attachedFiles.map((item) => item.file);
    const shouldGenerateImage = interactionMode === "image";
    // Clear picker chips immediately after send so attachments don't linger in composer.
    setAttachedFiles([]);
    setUploadError(null);

    if (shouldGenerateImage) {
      setLoadingLabel("Generating image");
      setIsLoading(true);

      try {
        const generated = await requestImageGeneration(
          effectiveQuestion,
          filesForRequest
        );
        updateMessagesForMode(activeMode, (prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Generated with ${generated.modelUsed}`,
            generatedImageDataUrl: generated.imageDataUrl,
            generatedImageMimeType: generated.mimeType,
            generatedImageModel: generated.modelUsed,
            timestamp: new Date(),
          },
        ]);
      } catch (error) {
        console.error("Error while generating image", error);
        updateMessagesForMode(activeMode, (prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              error instanceof Error && error.message
                ? error.message
                : "⚠️ Error: Unable to generate an image right now. Please try a different prompt or model.",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
        setLoadingLabel("Analysing");
      }
      return;
    }

    startAssistantMessage(activeMode);
    setLoadingLabel("Analysing");
    setIsLoading(true);

    // Get current messages for conversation history
    const currentMessages = activeMode === "chat" ? chatMessages : imageMessages;

    try {
      await streamModelResponse(effectiveQuestion, filesForRequest, currentMessages);
      setIsLoading(false);
      clearStreamingMessage();

      // Small delay to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 100));

      // Save chat to database if logged in
      if (session?.user) {
        // Get updated messages after the response (includes assistant's response)
        const updatedMessages = activeMode === "chat"
          ? [...chatMessagesRef.current]
          : [...imageMessagesRef.current];

        // Filter out empty assistant messages
        const validMessages = updatedMessages.filter(m =>
          m.role === 'user' || (m.role === 'assistant' && m.content && m.content.trim().length > 0)
        );

        if (currentChatId) {
          // Save to existing chat
          await saveChat(updatedMessages);
        } else if (validMessages.length > 0) {
          // Create new chat with messages
          await createNewChatWithMessages(pageType, validMessages);
        }
      }
    } catch (error) {
      console.error("Error while contacting AI backend", error);
      setStreamingMessageContent(
        "⚠️ Error: Unable to get a response right now. Please try again in a moment."
      );
      // Reset JSON refs on error
      isStreamingJSONRef.current = false;
      streamedContentRef.current = "";
      clearStreamingMessage();
      setIsLoading(false);
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const addFilesToComposer = async (selected: File[]) => {
    if (selected.length === 0) return;

    setUploadError(null);
    const nextFiles = [...attachedFiles];

    for (const file of selected) {
      if (nextFiles.length >= MAX_FILES) {
        setUploadError(`You can attach up to ${MAX_FILES} files.`);
        break;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        setUploadError(`${file.name || "File"} is too large. Max size is 10 MB.`);
        continue;
      }

      if (!isSupportedUpload(file)) {
        setUploadError(`${file.name || "This file"} is not a supported file type.`);
        continue;
      }

      const kind = file.type.startsWith("image/") ? "image" : "document";
      let previewDataUrl: string | undefined;

      if (kind === "image") {
        try {
          previewDataUrl = await readFileAsDataUrl(file);
        } catch {
          previewDataUrl = undefined;
        }
      }

      const fallbackName =
        kind === "image"
          ? `pasted-image-${Date.now()}-${nextFiles.length + 1}.png`
          : `document-${Date.now()}-${nextFiles.length + 1}`;

      nextFiles.push({
        file,
        name: file.name || fallbackName,
        size: file.size,
        kind,
        previewDataUrl,
      });
    }

    setAttachedFiles(nextFiles);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files || []);
    await addFilesToComposer(selected);
    event.target.value = "";
  };

  const handleTextareaPaste = async (
    event: React.ClipboardEvent<HTMLTextAreaElement>
  ) => {
    const items = Array.from(event.clipboardData?.items || []);
    const pastedImages = items
      .map((item) => (item.kind === "file" ? item.getAsFile() : null))
      .filter((file): file is File => Boolean(file && file.type.startsWith("image/")));

    if (pastedImages.length === 0) {
      return;
    }

    event.preventDefault();
    await addFilesToComposer(pastedImages);
  };

  const removeAttachedFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleExampleClick = async (question: string) => {
    await processQuestion(question, true);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!textareaRef.current) return;
    resizeTextarea(textareaRef.current);
  }, [inputMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages, interactionMode]);

  const handleVoiceTranscriptionComplete = (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) {
      return;
    }

    setInputMessage((prev) => {
      const nextValue = prev ? `${prev} ${trimmedText}` : trimmedText;

      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          resizeTextarea(textareaRef.current);
        }
      });

      return nextValue;
    });
  };

  const sendMessage = async () => {
    await processQuestion(inputMessage, false);
  };

  const handleGeneratePPT = async () => {
    if (isGeneratingPPT) return;
    setIsGeneratingPPT(true);
    try {
      const response = await fetch("/api/generate-ppt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contextData,
          pageType,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Request failed: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "esg-presentation.pptx";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PPT generation error:", error);
      alert("Failed to generate PPT. Please try again.");
    } finally {
      setIsGeneratingPPT(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`bg-white border-l border-gray-200 flex flex-col h-full transition-all duration-300 ease-in-out ${isOpen ? "opacity-100" : "w-0 opacity-0 overflow-hidden"
        }`}
      style={{
        width: isOpen ? (isResizing ? sidebarWidthRef.current : sidebarWidth) : 0,
        transition: isResizing ? 'none' : undefined
      }}
    >
      {/* Resize Handle - only show when not detached */}
      {!isDetached && (
        <div
          className={`absolute left-0 top-0 h-full w-1.5 cursor-ew-resize hover:bg-emerald-400 transition-colors z-10 ${isResizing ? 'bg-emerald-500' : ''}`}
          onMouseDown={handleMouseDown}
          title="Drag to resize"
        />
      )}
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-emerald-600 to-emerald-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">{title}</h3>
            <p className="text-xs text-emerald-100">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isDetached ? (
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
              title="Back to sidebar"
            >
              <ArrowDownLeft className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={onDetach}
              className="text-white/80 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
              title="Pop out as window"
            >
              <ArrowUpRight className="w-5 h-5" />
            </button>
          )}
          {session?.user && (
            <button
              onClick={() => setShowChatList(!showChatList)}
              className="text-white/80 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
              title="Chat History"
            >
              <History className="w-5 h-5" />
            </button>
          )}
          <DownloadChatPDF
            pageType={pageType}
          />
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat History Panel */}
      {showChatList && session?.user && (
        <div className="border-b border-gray-200 bg-gray-50 p-3 max-h-[300px] overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700">Chat History</h4>
            <button
              onClick={createNewChat}
              className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </button>
          </div>
          {isLoadingChats ? (
            <div className="text-center py-4 text-gray-500 text-sm">Loading...</div>
          ) : chats.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">No chats yet</div>
          ) : (
            <div className="space-y-1">
              {chats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => selectChat(chat._id)}
                  className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${currentChatId === chat._id
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'hover:bg-gray-100 text-gray-700'
                    }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{chat.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(chat.updatedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                  </div>
                  <button
                    onClick={(e) => deleteChat(chat._id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 hover:text-red-600 rounded transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="border-b border-gray-200 bg-white px-3 py-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setInteractionMode("chat")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${interactionMode === "chat"
              ? "bg-emerald-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            Ask AI
          </button>
          <button
            type="button"
            onClick={() => setInteractionMode("image")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${interactionMode === "image"
              ? "bg-emerald-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            Generate Image
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-[11px] font-medium text-gray-500">Model</span>
          <select
            value={interactionMode === "image" ? selectedImageModel : selectedAskModel}
            onChange={(event) => {
              if (interactionMode === "image") {
                setSelectedImageModel(event.target.value);
              } else {
                setSelectedAskModel(event.target.value);
              }
            }}
            disabled={isLoading}
            className="max-w-[220px] rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
          >
            {(interactionMode === "image" ? IMAGE_GENERATION_MODELS : ASK_AI_MODELS).map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400"
        style={{ maxHeight: "calc(100vh - 140px)" }}
      >
        {/* Login Prompt for unauthenticated users */}
        {!session?.user && status !== 'loading' && (
          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <p className="text-sm text-emerald-800 mb-3">
              Sign in to save your chat history and continue conversations later.
            </p>
            <div className="flex gap-2">
              <a
                href="/login"
                className="flex-1 text-center py-2 px-4 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Sign In
              </a>
              <a
                href="/register"
                className="flex-1 text-center py-2 px-4 bg-white border border-emerald-300 text-emerald-700 text-sm font-medium rounded-lg hover:bg-emerald-50 transition-colors"
              >
                Sign Up
              </a>
            </div>
          </div>
        )}
        <div
          className="min-h-full flex flex-col justify-start space-y-4"
        >
          {activeMessages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`max-w-[95%] rounded-2xl px-4 py-3 ${message.role === "user"
                  ? "bg-emerald-600 text-white"
                  : "bg-white border border-gray-200 text-gray-800 shadow-sm"
                  }`}
              >
                {message.role === "assistant" ? (
                  (() => {
                    const isStreamingMessage =
                      streamingModeRef.current === interactionMode &&
                      index === streamingMessageIndexRef.current;
                    const analysisData = parseAnalysisData(message.content);

                    // Check if content looks like it might be JSON (starts with { or ```json)
                    const looksLikeJSON = message.content.trim().startsWith("{") ||
                      message.content.trim().startsWith("```json") ||
                      message.content.trim().startsWith("```");

                    if (analysisData) {
                      // Valid JSON - render the analysis card
                      return <AnalysisCard data={analysisData} isStreaming={isStreamingMessage && isLoading} />;
                    } else if (looksLikeJSON && isStreamingMessage) {
                      // Looks like JSON but not valid yet (still streaming) - show skeleton card
                      return <AnalysisCard data={{ format: "analysis", positives: [], negatives: [], summary: "" }} isStreaming={true} />;
                    }

                    if (message.generatedImageDataUrl) {
                      return (
                        <div className="space-y-3">
                          <Image
                            src={message.generatedImageDataUrl}
                            alt="AI generated"
                            width={1024}
                            height={1024}
                            unoptimized
                            className="h-auto w-full max-h-[360px] rounded-xl border border-gray-200 object-contain bg-white"
                          />
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs text-gray-500 truncate">
                              {message.generatedImageModel || "Generated image"}
                            </p>
                            <a
                              href={message.generatedImageDataUrl}
                              download={`generated-${Date.now()}.${(message.generatedImageMimeType || "image/png").includes("jpeg") ? "jpg" : "png"}`}
                              className="inline-flex items-center gap-1 rounded-full border border-emerald-200 px-2.5 py-1 text-xs text-emerald-700 hover:bg-emerald-50"
                            >
                              <Download className="h-3.5 w-3.5" />
                              Download
                            </a>
                          </div>
                          {message.content ? (
                            <p className="text-xs text-gray-600">{message.content}</p>
                          ) : null}
                        </div>
                      );
                    }

                    // Not JSON - render markdown normally
                    return (
                      <div className="text-sm prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-strong:text-gray-900 break-words">
                        <div className="max-w-full">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              table: ({ children }) => (
                                <div className="overflow-x-auto my-2 border border-gray-200 rounded-lg">
                                  <table className="min-w-full">{children}</table>
                                </div>
                              ),
                            }}
                          >
                            {cleanLatex(message.content)}
                          </ReactMarkdown>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {message.attachments.map((file, attachmentIndex) => (
                          <span
                            key={`${file.name}-${attachmentIndex}`}
                            className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-[11px] text-white"
                          >
                            {file.kind === "image" && file.previewDataUrl ? (
                              <span
                                className="h-4 w-4 rounded bg-white/30 bg-cover bg-center"
                                style={{ backgroundImage: `url(${file.previewDataUrl})` }}
                              />
                            ) : file.kind === "image" ? (
                              <ImageIcon className="h-3 w-3" />
                            ) : (
                              <FileText className="h-3 w-3" />
                            )}
                            <span className="max-w-[170px] truncate">{file.name}</span>
                            <span className="text-white/85">({formatBytes(file.size)})</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {isMounted && (
                  <span
                    className={`text-xs mt-2 block ${message.role === "user"
                      ? "text-emerald-100"
                      : "text-gray-400"
                      }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center w-8 h-8">
                    <div className="absolute w-7 h-7 rounded-full bg-emerald-200/70 blur-md animate-pulse" />
                    <svg
                      viewBox="0 0 64 64"
                      className="relative w-7 h-7 animate-pulse drop-shadow-[0_2px_8px_rgba(16,185,129,0.5)]"
                      aria-hidden="true"
                    >
                      <defs>
                        <linearGradient id={starGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#e6f9ff" />
                          <stop offset="45%" stopColor="#6ee7b7" />
                          <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                        <linearGradient id={starHighlightId} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ffffff" />
                          <stop offset="100%" stopColor="#bbf7d0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M32 2 L41 23 L62 32 L41 41 L32 62 L23 41 L2 32 L23 23 Z"
                        fill={`url(#${starGradientId})`}
                      />
                      <path
                        d="M32 12 L37 26 L52 32 L37 38 L32 52 L27 38 L12 32 L27 26 Z"
                        fill={`url(#${starHighlightId})`}
                        opacity="0.9"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-emerald-700">
                      {loadingLabel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Example Questions & PPT Button */}
      {showExamples && (
        <div className="px-4 pb-3 bg-gray-50 space-y-3">
          <p className="text-xs text-gray-500 mb-2 font-medium">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {remainingExamples.map((question, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(question)}
                className="text-xs bg-white border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-full hover:bg-emerald-50 hover:border-emerald-300 transition-colors text-left shadow-sm"
              >
                {question}
              </button>
            ))}
          </div>
          <button
            onClick={handleGeneratePPT}
            disabled={isGeneratingPPT}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download className="h-4 w-4" />
            {isGeneratingPPT ? "Generating PPT..." : "Generate PPT"}
          </button>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-gray-200 bg-white shrink-0">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          accept=".txt,.md,.csv,.json,.log,.pdf,.png,.jpg,.jpeg,.webp,.gif,text/plain,text/markdown,text/csv,application/json,application/pdf,image/*"
          onChange={handleFileChange}
        />
        {attachedFiles.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {attachedFiles.map((file, index) => {
              return (
                <div
                  key={`${file.name}-${index}`}
                  className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs text-emerald-800"
                >
                  {file.kind === "image" && file.previewDataUrl ? (
                    <span
                      className="h-4 w-4 rounded bg-emerald-200 bg-cover bg-center"
                      style={{ backgroundImage: `url(${file.previewDataUrl})` }}
                    />
                  ) : file.kind === "image" ? (
                    <ImageIcon className="h-3.5 w-3.5" />
                  ) : (
                    <FileText className="h-3.5 w-3.5" />
                  )}
                  <span className="max-w-[160px] truncate">{file.name}</span>
                  <span className="text-emerald-600">({formatBytes(file.size)})</span>
                  <button
                    type="button"
                    onClick={() => removeAttachedFile(index)}
                    className="ml-1 text-emerald-700 hover:text-emerald-900"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
        {uploadError && (
          <p className="mb-2 text-xs text-red-600">{uploadError}</p>
        )}
        <div className="flex gap-2">
          <VoiceInputButton
            onTranscriptionComplete={handleVoiceTranscriptionComplete}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={handleAttachmentClick}
            disabled={isLoading || attachedFiles.length >= MAX_FILES}
            className="h-11 self-end bg-gray-100 text-gray-700 p-3 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Attach files"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={(e) => {
              setInputMessage(e.target.value);
              resizeTextarea(e.target);
            }}
            onPaste={handleTextareaPaste}
            onKeyPress={handleKeyPress}
            placeholder={
              interactionMode === "image"
                ? "Describe the image you want to generate..."
                : pageType === "dashboard"
                  ? "Ask about your ESG data or attach files..."
                  : "Ask about GHG report data or attach files..."
            }
            className="flex-1 resize-none overflow-y-hidden border border-gray-300 rounded-xl px-3 py-2.5 text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-[44px]"
            rows={1}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || (!inputMessage.trim() && attachedFiles.length === 0)}
            className="h-11 self-end bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
