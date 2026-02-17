"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  MessageCircle,
  X,
  Send,
  ChevronDown,
  ChevronUp,
  Settings,
  BarChart3,
  Leaf,
  Factory,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Helper function to clean LaTeX/math notation from AI responses
const cleanLatex = (content: string): string => {
  return content
    // Remove inline math delimiters but preserve content
    .replace(/\\\[\s*([\s\S]+?)\s*\\\]/g, '$1')  // Remove \[ ... \]
    .replace(/\\\(\s*([\s\S]+?)\s*\\\)/g, '$1')  // Remove \( ... \)
    .replace(/\$\$\s*([\s\S]+?)\s*\$\$/g, '$1')    // Remove $$ ... $$
    .replace(/\$\s*([^$\n]+?)\s*\$/g, '$1')        // Remove $ ... $ (single line only)
    // Clean up common LaTeX commands but preserve text inside
    .replace(/\\text\{([^}]+)\}/g, '$1')  // Remove \text{...} wrapper
    .replace(/\\textbf\{([^}]+)\}/g, '**$1**')  // Convert \textbf to markdown bold
    .replace(/\\textit\{([^}]+)\}/g, '*$1*')    // Convert \textit to markdown italic
    // Remove environment tags but keep content
    .replace(/\\begin\{[^}]+\}\s*/g, '')     // Remove \begin{...}
    .replace(/\\end\{[^}]+\}\s*/g, '')       // Remove \end{...}
    // Replace math symbols
    .replace(/\\times/g, '×')             // Replace \times with ×
    .replace(/\\approx/g, '≈')            // Replace \approx with ≈
    .replace(/\\%/g, '%')                 // Replace \% with %
    .replace(/\\,/g, ' ')                 // Replace \, with space
    .replace(/\\!/g, '')                  // Remove \!
    // Clean up subscripts and superscripts (keep the text)
    .replace(/_\{([^}]+)\}/g, '$1')       // Remove _{...} subscripts
    .replace(/\^\{([^}]+)\}/g, '$1')      // Remove ^{...} superscripts
    // Clean up multiple spaces (but preserve line breaks)
    .replace(/[ \t]+/g, ' ')              // Collapse multiple spaces/tabs to single space
    .replace(/\n{3,}/g, '\n\n')           // Limit consecutive line breaks to 2
    .trim();
};

// API Configuration - prefer primary key, fall back to legacy env or fallback key
const PRIMARY_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_PRIMARY_KEY || "";
const FALLBACK_API_KEY =
  process.env.NEXT_PUBLIC_OPENROUTER_FALLBACK_KEY || "";
const API_KEY = PRIMARY_API_KEY || FALLBACK_API_KEY;
const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "openai/gpt-oss-120b:free";
const MAX_TOKENS = 8000;

// Types
interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface DashboardData {
  current_view: string;
  fiscal_year: string;
  total_emissions: number;
  scope_1: { value: number; status: string };
  scope_2: { value: number; status: string };
  scope_3: { value: number; status: string };
  breakdown?: {
    scope_1_percentage: number;
    scope_2_percentage: number;
    scope_3_percentage: number;
  };
  top_emitters?: string[];
  scope1_monthly?: Scope1MonthlyRecord[];
  scope2_monthly?: Scope2MonthlyRecord[];
  scope3_breakdown?: Scope3Slice[];
}

interface Scope1MonthlyRecord {
  month: string;
  stationary: number;
  mobile: number;
  fugitive: number;
}

interface Scope2MonthlyRecord {
  month: string;
  renewable: number;
  imported: number;
  electricity: number;
}

interface Scope3Slice {
  name: string;
  value: number;
  color: string;
}

interface YearDataset {
  summary: DashboardData & {
    breakdown: {
      scope_1_percentage: number;
      scope_2_percentage: number;
      scope_3_percentage: number;
    };
    top_emitters: string[];
  };
  scope1Data: Scope1MonthlyRecord[];
  scope2Data: Scope2MonthlyRecord[];
  scope3Data: Scope3Slice[];
}

const YEAR_DATASETS = {
  "FY 2024-25": {
    summary: {
      current_view: "GHG Dashboard",
      fiscal_year: "2024-25",
      total_emissions: 3369.47,
      scope_1: { value: 486.59, status: "Data available" },
      scope_2: { value: 2693.44, status: "Data available" },
      scope_3: { value: 189.44, status: "Data available" },
      breakdown: {
        scope_1_percentage: 14.44,
        scope_2_percentage: 79.94,
        scope_3_percentage: 5.62,
      },
      top_emitters: [
        "Scope 2 - Imported Electricity (79.94%)",
        "Scope 1 - Stationary Combustion (14.44%)",
        "Scope 3 - Employee Commute (4.25%)",
      ],
    },
    scope1Data: [
      { month: "Apr", stationary: 0, mobile: 0, fugitive: 0 },
      { month: "May", stationary: 0, mobile: 0, fugitive: 0 },
      { month: "Jun", stationary: 0, mobile: 0, fugitive: 0 },
      { month: "Jul", stationary: 0, mobile: 0, fugitive: 0 },
      { month: "Aug", stationary: 0, mobile: 0, fugitive: 0 },
      { month: "Sep", stationary: 0, mobile: 0, fugitive: 0 },
      { month: "Oct", stationary: 0, mobile: 0, fugitive: 0 },
      { month: "Nov", stationary: 0, mobile: 0, fugitive: 0 },
      { month: "Dec", stationary: 0, mobile: 0, fugitive: 0 },
      { month: "Jan", stationary: 0, mobile: 0, fugitive: 0 },
      { month: "Feb", stationary: 0, mobile: 0, fugitive: 0 },
      { month: "Mar", stationary: 486.59, mobile: 0, fugitive: 0 },
    ],
    scope2Data: [
      { month: "Apr", renewable: 0, imported: 0, electricity: 0 },
      { month: "May", renewable: 0, imported: 0, electricity: 0 },
      { month: "Jun", renewable: 0, imported: 0, electricity: 0 },
      { month: "Jul", renewable: 0, imported: 0, electricity: 0 },
      { month: "Aug", renewable: 0, imported: 0, electricity: 0 },
      { month: "Sep", renewable: 0, imported: 0, electricity: 0 },
      { month: "Oct", renewable: 0, imported: 0, electricity: 0 },
      { month: "Nov", renewable: 0, imported: 0, electricity: 0 },
      { month: "Dec", renewable: 0, imported: 0, electricity: 0 },
      { month: "Jan", renewable: 0, imported: 0, electricity: 0 },
      { month: "Feb", renewable: 0, imported: 0, electricity: 0 },
      { month: "Mar", renewable: 0, imported: 0, electricity: 2693.44 },
    ],
    scope3Data: [
      { name: "Business Travel (Air)", value: 0, color: "#10b981" },
      { name: "Business Travel (Sea)", value: 0, color: "#3b82f6" },
      { name: "Business Travel (Land)", value: 0, color: "#8b5cf6" },
      { name: "Employee Commute", value: 143.26, color: "#06b6d4" },
      { name: "Water Treatment", value: 0, color: "#84cc16" },
      { name: "Water Supply", value: 0, color: "#f59e0b" },
      { name: "Downstream Activities", value: 0, color: "#ef4444" },
      { name: "Transmission & Distribution", value: 0, color: "#ec4899" },
      { name: "Waste Disposal", value: 46.18, color: "#6366f1" },
    ],
  },
  "FY 2023-24": {
    summary: {
      current_view: "GHG Dashboard",
      fiscal_year: "2023-24",
      total_emissions: 3448.81,
      scope_1: { value: 401.67, status: "Data available" },
      scope_2: { value: 2928.55, status: "Data available" },
      scope_3: { value: 118.6, status: "Data available" },
      breakdown: {
        scope_1_percentage: 11.65,
        scope_2_percentage: 84.91,
        scope_3_percentage: 3.44,
      },
      top_emitters: [
        "Scope 2 - Imported Electricity (84.91%)",
        "Scope 1 - Stationary Combustion (11.65%)",
        "Scope 3 - Employee Commute (3.44%)",
      ],
    },
    scope1Data: [
      { month: "Apr", stationary: 0, mobile: 0, fugitive: 0 },
      { month: "May", stationary: 0, mobile: 0, fugitive: 0 },
      { month: "Jun", stationary: 0, mobile: 0, fugitive: 0 },
      { month: "Jul", stationary: 0, mobile: 0, fugitive: 0 },
      { month: "Aug", stationary: 0, mobile: 0, fugitive: 0 },
      { month: "Sep", stationary: 0, mobile: 0, fugitive: 0 },
      { month: "Oct", stationary: 0, mobile: 0, fugitive: 0 },
      { month: "Nov", stationary: 0, mobile: 0, fugitive: 0 },
      { month: "Dec", stationary: 0, mobile: 0, fugitive: 0 },
      { month: "Jan", stationary: 0, mobile: 0, fugitive: 0 },
      { month: "Feb", stationary: 0, mobile: 0, fugitive: 0 },
      { month: "Mar", stationary: 401.67, mobile: 0, fugitive: 0 },
    ],
    scope2Data: [
      { month: "Apr", renewable: 0, imported: 0, electricity: 0 },
      { month: "May", renewable: 0, imported: 0, electricity: 0 },
      { month: "Jun", renewable: 0, imported: 0, electricity: 0 },
      { month: "Jul", renewable: 0, imported: 0, electricity: 0 },
      { month: "Aug", renewable: 0, imported: 0, electricity: 0 },
      { month: "Sep", renewable: 0, imported: 0, electricity: 0 },
      { month: "Oct", renewable: 0, imported: 0, electricity: 0 },
      { month: "Nov", renewable: 0, imported: 0, electricity: 0 },
      { month: "Dec", renewable: 0, imported: 0, electricity: 0 },
      { month: "Jan", renewable: 0, imported: 0, electricity: 0 },
      { month: "Feb", renewable: 0, imported: 0, electricity: 2928.55 },
      { month: "Mar", renewable: 0, imported: 0, electricity: 0 },
    ],
    scope3Data: [
      { name: "Employee Commute", value: 112.61, color: "#06b6d4" },
      { name: "Waste Disposal", value: 6, color: "#84cc16" },
      { name: "Business Travel (Air)", value: 0, color: "#10b981" },
      { name: "Business Travel (Sea)", value: 0, color: "#3b82f6" },
      { name: "Business Travel (Land)", value: 0, color: "#8b5cf6" },
      { name: "Transmission & Distribution", value: 0, color: "#ec4899" },
      { name: "Downstream Activities", value: 0, color: "#ef4444" },
    ],
  },
} satisfies Record<string, YearDataset>;

type YearKey = keyof typeof YEAR_DATASETS;

const formatDelta = (delta: number, digits = 2) => {
  const rounded = Math.abs(delta).toFixed(digits);
  if (Number(rounded) === 0) {
    return "0";
  }
  return `${delta >= 0 ? "+" : "-"}${rounded}`;
};

const buildContextPayload = (dataset: YearDataset) =>
  JSON.stringify(
    {
      ...dataset.summary,
      scope1_monthly: dataset.scope1Data,
      scope2_monthly: dataset.scope2Data,
      scope3_breakdown: dataset.scope3Data,
    },
    null,
    2
  );

// Circular Progress Component
const CircularProgress = ({
  value,
  max,
  color,
  size = 80,
}: {
  value: number;
  max: number;
  color: string;
  size?: number;
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-semibold text-gray-700">
          {percentage.toFixed(2)}%
        </span>
      </div>
    </div>
  );
};

// Scope Card Component
const ScopeCard = ({
  title,
  value,
  unit,
  color,
  percentage,
  baselineValue,
  baselineYear,
}: {
  title: string;
  value: number;
  unit: string;
  color: string;
  percentage: number;
  baselineValue?: number;
  baselineYear?: string | null;
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-gray-900">
              {value.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">{unit}</span>
          </div>
        </div>
        <CircularProgress value={percentage} max={100} color={color} size={70} />
      </div>
      {baselineYear && typeof baselineValue === "number" && (
        <p className="text-xs text-gray-500 mt-3">
          vs {baselineYear}: {formatDelta(value - baselineValue)} {unit}
        </p>
      )}
    </div>
  );
};

// AI Chat Sidebar Component
const AISidebar = ({
  isOpen,
  onClose,
  contextData,
}: {
  isOpen: boolean;
  onClose: () => void;
  contextData: string;
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your ESG AI Assistant powered by GPT-OSS-120B. Ask me anything about your GHG emissions data, sustainability metrics, or how to improve your environmental impact.",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingMessageIndexRef = useRef<number | null>(null);

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
  };

  // Example questions for users
  const exampleQuestions = [
    "What are Scope 1, 2, and 3 emissions?",
    "How can we reduce our carbon footprint?",
    "Explain the GHG Protocol standards",
    "What does Net Zero mean for our company?",
    "How do I calculate total GHG emissions?",
  ];

  // Filter out already asked questions
  const remainingExamples = exampleQuestions.filter(q => !askedQuestions.includes(q));
  
  // Show examples if there are remaining ones and user isn't typing
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
              : delta || (Array.isArray(messageContent) ? messageContent.join("") : messageContent);

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

  const streamModelResponse = async (model: string, question: string) => {
    console.log(`Trying model: ${model}`);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "ESGtech.ai Dashboard",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: `You are an expert ESG (Environmental, Social, and Governance) consultant assistant. You help users understand their greenhouse gas emissions data, provide sustainability insights, and suggest improvements.

CRITICAL INSTRUCTION: You MUST respond ONLY in English. Do NOT use any other language including Chinese, Korean, Japanese, or any other language. All responses must be in clear, professional English.

You have access to the current dashboard data which will be provided in each user message. Analyze this data professionally and provide actionable recommendations.`,
          },
          {
            role: "user",
            content: `Here is the current dashboard context data:
${contextData}

IMPORTANT: Respond in English only.

User question: ${question}`,
          },
        ],
        temperature: 0.7,
        max_tokens: MAX_TOKENS,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`API Error for ${model}:`, errorData);
      throw new Error(`API Error: ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/event-stream")) {
      await handleStream(response.body);
      return;
    }

    const data = await response.json();
    if (data.error) {
      console.error(`OpenRouter Error for ${model}:`, data.error);
      throw new Error(data.error.message || "API returned an error");
    }

    const aiResponse = data.choices?.[0]?.message?.content;
    if (!aiResponse || aiResponse.trim() === "") {
      throw new Error("Empty response from AI model");
    }

    appendToStreamingMessage(aiResponse);
  };

  const processQuestion = async (question: string, fromExample = false) => {
    if (!API_KEY) return;
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

    const models = [
      MODEL,
      "upstage/solar-pro-3:free",
      "meta-llama/llama-3.1-8b-instruct:free",
      "google/gemini-flash-1.5:free",
    ];
    let lastError = "";

    for (const model of models) {
      try {
        await streamModelResponse(model, trimmedQuestion);
        setIsLoading(false);
        clearStreamingMessage();
        return;
      } catch (error) {
        console.error(`Error with model ${model}:`, error);
        lastError = error instanceof Error ? error.message : "Unknown error";
        setStreamingMessageContent("");
        continue;
      }
    }

    console.error("All models failed");
    setStreamingMessageContent(
      `⚠️ Error: ${lastError}. All available models failed. Please try again in a moment.`
    );
    clearStreamingMessage();
    setIsLoading(false);
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
            <h3 className="font-semibold text-white">AI Companion</h3>
            <p className="text-xs text-emerald-100">Powered by GPT-OSS-120B</p>
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
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400" style={{ maxHeight: 'calc(100vh - 140px)' }}>
        <div className={`min-h-full flex flex-col ${showExamples ? 'justify-end' : 'justify-start'} space-y-4`}>
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
              ) : (
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
                  <span
                    className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></span>
                </div>
                <span className="text-sm text-gray-500">Thinking...</span>
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
            placeholder="Ask about your ESG data..."
            className="flex-1 resize-none border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-[44px] max-h-[120px]"
            rows={1}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim() || !API_KEY}
            className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        {!API_KEY && (
          <p className="text-xs text-red-500 mt-2">
            ⚠️ Please set NEXT_PUBLIC_OPENROUTER_PRIMARY_KEY or NEXT_PUBLIC_OPENROUTER_FALLBACK_KEY
          </p>
        )}
      </div>
    </div>
  );
};

// Developer Context Panel Component
const DeveloperPanel = ({
  contextData,
  setContextData,
}: {
  contextData: string;
  setContextData: (data: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-gray-900 text-white rounded-t-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-800 hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="font-medium text-sm">Developer Data Context</span>
          <span className="text-xs text-gray-400">
            (Live Dashboard Data - System Prompt)
          </span>
        </div>
        {isOpen ? (
          <ChevronDown className="w-5 h-5" />
        ) : (
          <ChevronUp className="w-5 h-5" />
        )}
      </button>
      {isOpen && (
        <div className="p-4">
          <p className="text-xs text-gray-400 mb-2">
            Edit this JSON to simulate different dashboard states. The AI will
            receive this data with every message.
          </p>
          <textarea
            value={contextData}
            onChange={(e) => setContextData(e.target.value)}
            className="w-full h-48 bg-gray-800 border border-gray-700 rounded-lg p-3 font-mono text-xs text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y"
            spellCheck={false}
          />
        </div>
      )}
    </div>
  );
};

// Main Dashboard Component
export default function ESGDashboard() {
  const yearOptions = Object.keys(YEAR_DATASETS) as YearKey[];
  const defaultYear = yearOptions[0];
  const defaultBaseline = (yearOptions[1] ?? "") as YearKey | "";
  const [selectedYear, setSelectedYear] = useState<YearKey>(defaultYear);
  const [baselineYear, setBaselineYear] = useState<YearKey | "">(
    defaultBaseline
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contextData, setContextData] = useState<string>(() =>
    buildContextPayload(YEAR_DATASETS[defaultYear])
  );

  useEffect(() => {
    setContextData(buildContextPayload(YEAR_DATASETS[selectedYear]));
  }, [selectedYear]);

  const currentYearDataset = YEAR_DATASETS[selectedYear];
  const baselineDataset = baselineYear ? YEAR_DATASETS[baselineYear] : null;

  const dashboardData: DashboardData = JSON.parse(contextData);
  const { scope1Data, scope2Data, scope3Data } = currentYearDataset;
  const baselineSummary = baselineDataset?.summary;
  const baselineLabel = baselineYear || null;
  const scope1BaselineValue = baselineSummary?.scope_1.value;
  const scope2BaselineValue = baselineSummary?.scope_2.value;
  const scope3BaselineValue = baselineSummary?.scope_3.value;
  const totalDelta = baselineSummary
    ? dashboardData.total_emissions - baselineSummary.total_emissions
    : null;

  // Calculate percentages based on total
  const total = dashboardData.total_emissions || 1;
  const scope1Percentage = (dashboardData.scope_1.value / total) * 100;
  const scope2Percentage = (dashboardData.scope_2.value / total) * 100;
  const scope3Percentage = (dashboardData.scope_3.value / total) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Content */}
      <main
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "mr-[400px]" : ""
        }`}
      >
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-[1600px] mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo & Nav */}
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">
                    ESGtech<span className="text-emerald-600">.ai</span>
                  </span>
                </div>

                <nav className="hidden md:flex items-center gap-6">
                  <a
                    href="#"
                    className="text-sm font-medium text-emerald-600 border-b-2 border-emerald-600 pb-4 -mb-4"
                  >
                    Dashboard
                  </a>
                  <a
                    href="#"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors pb-4 -mb-4"
                  >
                    Sites
                  </a>
                  <a
                    href="#"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors pb-4 -mb-4"
                  >
                    GHG Reports
                  </a>
                  <a
                    href="#"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors pb-4 -mb-4"
                  >
                    Help
                  </a>
                </nav>
              </div>

              {/* Right Side */}
              <div className="flex items-center gap-4 flex-wrap justify-end">
                <div className="flex flex-wrap gap-4 items-end bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                  <div className="flex flex-col min-w-[150px]">
                    <span className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">
                      Current Year
                    </span>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value as YearKey)}
                      className="mt-1 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col min-w-[180px]">
                    <span className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">
                      Baseline Year (Optional)
                    </span>
                    <select
                      value={baselineYear}
                      onChange={(e) =>
                        setBaselineYear(
                          e.target.value === ""
                            ? ""
                            : (e.target.value as YearKey)
                        )
                      }
                      className="mt-1 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">None</option>
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* AI Button */}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    sidebarOpen
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800"
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>✨ Ask AI</span>
                </button>

                <div className="h-6 w-px bg-gray-200"></div>

                {/* User Profile */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 hidden sm:block">
                    Nirav Surti
                  </span>
                  <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center border-2 border-emerald-200">
                    <span className="text-sm font-semibold text-emerald-700">
                      NS
                    </span>
                  </div>
                </div>

                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-[1600px] mx-auto px-6 py-8">
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">GHG Dashboard</h1>
              <p className="text-gray-500 mt-1">
                Monitor your greenhouse gas emissions across all scopes
              </p>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              {/* Main Total Emissions Card */}
              <div className="lg:col-span-1 bg-gradient-to-br from-[#3e6b3e] to-[#2d522d] rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Factory className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    FY {dashboardData.fiscal_year}
                  </span>
                </div>
                <h3 className="text-emerald-100 text-sm font-medium mb-2">
                  Total GHG Emissions
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">
                    {dashboardData.total_emissions.toLocaleString()}
                  </span>
                  <span className="text-emerald-200 text-sm">TCO2Eq</span>
                </div>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="flex items-center gap-2 text-sm text-emerald-100">
                    <BarChart3 className="w-4 h-4" />
                    <span>Across all scopes</span>
                  </div>
                  {baselineSummary && baselineLabel && totalDelta !== null && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-emerald-100/90">
                      <span className="text-sm font-semibold text-white">
                        {formatDelta(totalDelta)} TCO2Eq
                      </span>
                      <span>vs {baselineLabel}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Scope 1 Card */}
              <ScopeCard
                title="Scope 1"
                value={dashboardData.scope_1.value}
                unit="TCO2Eq"
                color="#10b981"
                percentage={scope1Percentage}
                baselineValue={scope1BaselineValue}
                baselineYear={baselineLabel}
              />

              {/* Scope 2 Card */}
              <ScopeCard
                title="Scope 2"
                value={dashboardData.scope_2.value}
                unit="TCO2Eq"
                color="#ec4899"
                percentage={scope2Percentage}
                baselineValue={scope2BaselineValue}
                baselineYear={baselineLabel}
              />

              {/* Scope 3 Card */}
              <ScopeCard
                title="Scope 3"
                value={dashboardData.scope_3.value}
                unit="TCO2Eq"
                color="#3b82f6"
                percentage={scope3Percentage}
                baselineValue={scope3BaselineValue}
                baselineYear={baselineLabel}
              />
            </div>

            {/* Charts Section */}
            <div className="space-y-6">
              {/* Scope 1 Chart */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Scope 1
                    </h3>
                    <p className="text-sm text-gray-500">
                      Direct emissions from owned or controlled sources
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                      Detailed
                    </button>
                    <button className="px-3 py-1 text-xs font-medium text-white bg-emerald-600 rounded-lg">
                      Overall
                    </button>
                  </div>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scope1Data}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#f3f4f6"
                      />
                      <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar
                        dataKey="stationary"
                        stackId="a"
                        fill="#10b981"
                        radius={[0, 0, 0, 0]}
                      />
                      <Bar
                        dataKey="mobile"
                        stackId="a"
                        fill="#ec4899"
                        radius={[0, 0, 0, 0]}
                      />
                      <Bar
                        dataKey="fugitive"
                        stackId="a"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="text-gray-600">
                      Stationary Combustion (FY 2024-25)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-pink-500"></span>
                    <span className="text-gray-600">
                      Mobile Combustion (FY 2024-25)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="text-gray-600">
                      Fugitive Emissions (FY 2024-25)
                    </span>
                  </div>
                </div>
              </div>

              {/* Scope 2 Chart */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Scope 2
                    </h3>
                    <p className="text-sm text-gray-500">
                      Indirect emissions from purchased energy
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                      Detailed
                    </button>
                    <button className="px-3 py-1 text-xs font-medium text-white bg-emerald-600 rounded-lg">
                      Overall
                    </button>
                  </div>
                </div>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={scope2Data}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#f3f4f6"
                      />
                      <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="renewable"
                        stackId="a"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="imported"
                        stackId="a"
                        stroke="#ec4899"
                        fill="#ec4899"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="electricity"
                        stackId="a"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="text-gray-600">
                      Renewable Electricity Generation (FY 2024-25)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-pink-500"></span>
                    <span className="text-gray-600">
                      Imported Energy (FY 2024-25)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="text-gray-600">
                      Imported Electricity (FY 2024-25)
                    </span>
                  </div>
                </div>
              </div>

              {/* Scope 3 Chart */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Scope 3
                  </h3>
                  <p className="text-sm text-gray-500">
                    All other indirect emissions in your value chain
                  </p>
                </div>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={scope3Data}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={140}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {scope3Data.map((entry: Scope3Slice, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                        formatter={(value) => {
                          const numValue = typeof value === 'number' ? value : 0;
                          return [`${numValue} TCO2Eq`, ''];
                        }}
                      />
                      <Legend
                        verticalAlign="middle"
                        align="right"
                        layout="vertical"
                        iconType="circle"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Developer Context Panel */}
            <div className="mt-8">
              <DeveloperPanel
                contextData={contextData}
                setContextData={setContextData}
              />
            </div>
          </div>
        </div>
      </main>

      {/* AI Sidebar */}
      <div className="fixed right-0 top-0 h-full z-50">
        <AISidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          contextData={contextData}
        />
      </div>
    </div>
  );
}
