"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import { MessageCircle, X, Send, Leaf, AlertTriangle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Interface for structured analysis responses
interface AnalysisData {
  format: "analysis";
  positives: string[];
  negatives: string[];
  summary: string;
}

// API Configuration
const API_URL = "/api/chat";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AISidebarProps {
  isOpen: boolean;
  onClose: () => void;
  contextData: string;
  pageType: "dashboard" | "ghg-report";
  title?: string;
  subtitle?: string;
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
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
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
const AnalysisCard = ({ data, isStreaming = false }: { data: AnalysisData; isStreaming?: boolean }) => {
  // Only show sections that have data or are still loading
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
              <span className="text-xs text-emerald-600 animate-pulse">thinking...</span>
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
              <span className="text-xs text-red-600 animate-pulse">thinking...</span>
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
  subtitle = "Powered by GPT-OSS-120B",
}: AISidebarProps) {
  const starGradientId = useId();
  const starHighlightId = useId();
  const exampleQuestions =
    pageType === "dashboard" ? dashboardExamples : ghgReportExamples;

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        pageType === "dashboard"
          ? "Hello! I'm your ESG AI Assistant powered by GPT-OSS-120B. Ask me anything about your GHG emissions data, sustainability metrics, or how to improve your environmental impact."
          : "Hello! I'm your GHG Report AI Assistant powered by GPT-OSS-120B. I can help you summarize emissions data, explain specific emission categories, compare scopes, or analyze any field in this report. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingMessageIndexRef = useRef<number | null>(null);
  const isStreamingJSONRef = useRef<boolean>(false);
  const streamedContentRef = useRef<string>("");

  const startAssistantMessage = () => {
    const placeholder: Message = {
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };
    setMessages((prev) => {
      const updated = [...prev, placeholder];
      streamingMessageIndexRef.current = updated.length - 1;
      return updated;
    });
    // Reset JSON detection refs
    isStreamingJSONRef.current = false;
    streamedContentRef.current = "";
  };

  const updateStreamingMessage = (updater: (msg: Message) => Message) => {
    const index = streamingMessageIndexRef.current;
    if (index === null) return;
    setMessages((prev) => {
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
    const accumulated = streamedContentRef.current.trim();
    
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
    isStreamingJSONRef.current = false;
    streamedContentRef.current = "";
  };

  const remainingExamples = exampleQuestions.filter(
    (q) => !askedQuestions.includes(q)
  );
  const showExamples = remainingExamples.length > 0 && inputMessage.length === 0;

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

  const streamModelResponse = async (question: string) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        contextData,
        pageType,
      }),
    });

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

  const processQuestion = async (question: string, fromExample = false) => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;

    const userMessage: Message = {
      role: "user",
      content: trimmedQuestion,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (fromExample) {
      setAskedQuestions((prev) => [...prev, trimmedQuestion]);
    } else {
      setInputMessage("");
    }

    startAssistantMessage();
    setIsLoading(true);

    try {
      await streamModelResponse(trimmedQuestion);
      setIsLoading(false);
      clearStreamingMessage();
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

  const handleExampleClick = async (question: string) => {
    await processQuestion(question, true);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    await processQuestion(inputMessage, false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className={`bg-white border-l border-gray-200 flex flex-col h-full transition-all duration-300 ease-in-out ${
        isOpen ? "w-[400px] opacity-100" : "w-0 opacity-0 overflow-hidden"
      }`}
    >
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
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400"
        style={{ maxHeight: "calc(100vh - 140px)" }}
      >
        <div
          className={`min-h-full flex flex-col ${
            showExamples ? "justify-end" : "justify-start"
          } space-y-4`}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[95%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-emerald-600 text-white"
                    : "bg-white border border-gray-200 text-gray-800 shadow-sm"
                }`}
              >
                {message.role === "assistant" ? (
                  (() => {
                    const isStreamingMessage = index === streamingMessageIndexRef.current;
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
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                )}
                {isMounted && (
                  <span
                    className={`text-xs mt-2 block ${
                      message.role === "user"
                        ? "text-emerald-100"
                        : "text-gray-400"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
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
                      Analysing
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Example Questions */}
      {showExamples && (
        <div className="px-4 pb-3 bg-gray-50">
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
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-gray-200 bg-white shrink-0">
        <div className="flex gap-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              pageType === "dashboard"
                ? "Ask about your ESG data..."
                : "Ask about GHG report data..."
            }
            className="flex-1 resize-none border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-[44px] max-h-[120px]"
            rows={1}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
