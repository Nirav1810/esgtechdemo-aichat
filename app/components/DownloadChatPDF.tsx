"use client";

import React, { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date | string;
}

interface Chat {
  _id: string;
  title: string;
  pageType: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

interface DownloadChatPDFProps {
  pageType: string;
}

const stripMarkdown = (text: string): string => {
  return text
    .replace(/#{1,6}\s/g, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "")
    .replace(/^[-*+]\s/gm, "")
    .replace(/^\d+\.\s/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const formatTimestamp = (timestamp: Date | string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const formatDate = (timestamp: Date | string): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const DownloadChatPDF: React.FC<DownloadChatPDFProps> = ({ pageType }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (isGenerating) return;

    setIsGenerating(true);

    try {
      const { pdf, Document, Page, Text, View, StyleSheet } = await import("@react-pdf/renderer");

      const res = await fetch(`/api/chats/all?pageType=${pageType}`);
      const data = await res.json();
      
      const chats: Chat[] = data.chats || [];
      
      const allMessages: { chatTitle: string; chatDate: string; messages: Message[] }[] = [];

      chats.forEach((chat) => {
        const filteredMsgs = chat.messages.filter(
          (m) => m.role === "user" || (m.role === "assistant" && m.content?.trim())
        );
        
        if (filteredMsgs.length > 0) {
          allMessages.push({
            chatTitle: chat.title,
            chatDate: chat.createdAt,
            messages: filteredMsgs,
          });
        }
      });

      const pageTypeLabel = pageType === "dashboard" ? "ESG Dashboard" : "GHG Report";
      const totalMessages = allMessages.reduce((sum, c) => sum + c.messages.length, 0);

      const styles = StyleSheet.create({
        page: { padding: 40, fontFamily: "Helvetica" },
        header: { marginBottom: 20, paddingBottom: 15, borderBottomWidth: 2, borderBottomColor: "#059669" },
        headerTitle: { fontSize: 24, fontWeight: "bold", color: "#065f46", marginBottom: 4 },
        headerSubtitle: { fontSize: 12, color: "#6b7280", marginBottom: 4 },
        headerMeta: { fontSize: 10, color: "#9ca3af", marginTop: 4 },
        
        chatSection: { marginBottom: 20 },
        chatTitle: { fontSize: 14, fontWeight: "bold", color: "#065f46", marginBottom: 8, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
        chatDate: { fontSize: 9, color: "#9ca3af", marginBottom: 10 },
        
        messageContainer: { marginBottom: 10, maxWidth: "85%" },
        userMessage: { alignSelf: "flex-end" },
        assistantMessage: { alignSelf: "flex-start" },
        userBubble: { backgroundColor: "#059669", borderRadius: 12, padding: 10 },
        assistantBubble: { backgroundColor: "#f9fafb", borderRadius: 12, padding: 10, borderWidth: 1, borderColor: "#e5e7eb" },
        roleLabel: { fontSize: 8, fontWeight: "bold", marginBottom: 3 },
        userRole: { color: "#a7f3d0" },
        assistantRole: { color: "#6b7280" },
        messageText: { fontSize: 10, lineHeight: 1.4 },
        userText: { color: "#ffffff" },
        assistantText: { color: "#1f2937" },
        timestamp: { fontSize: 7, marginTop: 4, textAlign: "right" },
        userTimestamp: { color: "#a7f3d0" },
        assistantTimestamp: { color: "#9ca3af" },
        emptyState: { textAlign: "center", padding: 40, color: "#6b7280" },
        footer: { position: "absolute", bottom: 30, left: 40, right: 40, borderTopWidth: 1, borderTopColor: "#e5e7eb", paddingTop: 10, flexDirection: "row", justifyContent: "space-between" },
        footerText: { fontSize: 8, color: "#9ca3af" },
      });

      const ChatPDF = () => (
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>ESG AI Chat History</Text>
              <Text style={styles.headerSubtitle}>{pageTypeLabel}</Text>
              <Text style={styles.headerMeta}>
                {allMessages.length} conversations • {totalMessages} messages
              </Text>
            </View>

            {allMessages.length === 0 ? (
              <Text style={styles.emptyState}>No chat history found.</Text>
            ) : (
              allMessages.map((chat, chatIndex) => (
                <View key={chatIndex} style={styles.chatSection}>
                  <Text style={styles.chatTitle}>{chat.chatTitle}</Text>
                  <Text style={styles.chatDate}>{formatDate(chat.chatDate)}</Text>
                  
                  {chat.messages.map((message, msgIndex) => {
                    const isUser = message.role === "user";
                    const cleanContent = stripMarkdown(message.content);
                    
                    return (
                      <View key={msgIndex} style={[styles.messageContainer, isUser ? styles.userMessage : styles.assistantMessage]}>
                        <View style={isUser ? styles.userBubble : styles.assistantBubble}>
                          <Text style={[styles.roleLabel, isUser ? styles.userRole : styles.assistantRole]}>
                            {isUser ? "You" : "ESG AI"}
                          </Text>
                          <Text style={[styles.messageText, isUser ? styles.userText : styles.assistantText]}>
                            {cleanContent}
                          </Text>
                          <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.assistantTimestamp]}>
                            {formatTimestamp(message.timestamp)}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              ))
            )}

            <View style={styles.footer} fixed>
              <Text style={styles.footerText}>Generated by ESG AI</Text>
              <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
            </View>
          </Page>
        </Document>
      );

      const blob = await pdf(<ChatPDF />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `esg-chat-history-${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors"
      title="Download full chat history as PDF"
    >
      {isGenerating ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <FileDown className="w-4 h-4" />
      )}
      <span className="hidden sm:inline">PDF</span>
    </button>
  );
};

export default DownloadChatPDF;
