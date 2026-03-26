"use client";

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hjp-Ek-_EeA.woff2",
      fontWeight: 600,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hjp-Ek-_EeA.woff2",
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
    fontFamily: "Inter",
  },
  header: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#059669",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: "#065f46",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 10,
    color: "#6b7280",
  },
  chatInfo: {
    fontSize: 10,
    color: "#9ca3af",
    marginTop: 4,
  },
  messageContainer: {
    marginBottom: 12,
  },
  userMessage: {
    alignSelf: "flex-end",
    maxWidth: "85%",
  },
  assistantMessage: {
    alignSelf: "flex-start",
    maxWidth: "85%",
  },
  userBubble: {
    backgroundColor: "#059669",
    borderRadius: 16,
    padding: 12,
    paddingBottom: 8,
  },
  assistantBubble: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    padding: 12,
    paddingBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  roleLabel: {
    fontSize: 9,
    fontWeight: 600,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  userRole: {
    color: "#a7f3d0",
  },
  assistantRole: {
    color: "#6b7280",
  },
  messageText: {
    fontSize: 11,
    lineHeight: 1.5,
  },
  userText: {
    color: "#ffffff",
  },
  assistantText: {
    color: "#1f2937",
  },
  timestamp: {
    fontSize: 8,
    marginTop: 6,
    textAlign: "right",
  },
  userTimestamp: {
    color: "#a7f3d0",
  },
  assistantTimestamp: {
    color: "#9ca3af",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: "#9ca3af",
  },
  pageNumber: {
    fontSize: 8,
    color: "#9ca3af",
  },
  noMessages: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    color: "#9ca3af",
    fontSize: 12,
  },
  emptyState: {
    textAlign: "center",
    padding: 40,
    color: "#6b7280",
    fontSize: 12,
  },
});

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date | string;
}

interface ChatHistoryPDFProps {
  messages: Message[];
  chatTitle: string;
  pageType: string;
}

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

const formatDateRange = (messages: Message[]): string => {
  if (!messages || messages.length === 0) return "";
  
  const dates = messages.map(m => new Date(m.timestamp).getTime());
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));
  
  const formatDate = (d: Date) => d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  
  if (formatDate(minDate) === formatDate(maxDate)) {
    return formatDate(minDate);
  }
  return `${formatDate(minDate)} - ${formatDate(maxDate)}`;
};

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

const ChatHistoryPDF: React.FC<ChatHistoryPDFProps> = ({
  messages,
  chatTitle,
  pageType,
}) => {
  const filteredMessages = messages.filter(
    (m) => m.role === "user" || (m.role === "assistant" && m.content?.trim())
  );

  const pageTypeLabel = pageType === "dashboard" ? "ESG Dashboard" : "GHG Report";

  const renderMessage = (message: Message, index: number) => {
    const isUser = message.role === "user";
    const cleanContent = stripMarkdown(message.content);

    return (
      <View
        key={index}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.assistantMessage,
        ]}
      >
        <View style={isUser ? styles.userBubble : styles.assistantBubble}>
          <Text
            style={[
              styles.roleLabel,
              isUser ? styles.userRole : styles.assistantRole,
            ]}
          >
            {isUser ? "You" : "ESG AI Assistant"}
          </Text>
          <Text style={[styles.messageText, isUser ? styles.userText : styles.assistantText]}>
            {cleanContent}
          </Text>
          <Text
            style={[
              styles.timestamp,
              isUser ? styles.userTimestamp : styles.assistantTimestamp,
            ]}
          >
            {formatTimestamp(message.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>ESG AI Chat History</Text>
          <Text style={styles.headerSubtitle}>{chatTitle}</Text>
          <Text style={styles.chatInfo}>
            {pageTypeLabel} • {filteredMessages.length} messages • {formatDateRange(filteredMessages)}
          </Text>
        </View>

        {filteredMessages.length > 0 ? (
          filteredMessages.map((message, index) => renderMessage(message, index))
        ) : (
          <Text style={styles.emptyState}>No messages in this conversation.</Text>
        )}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Generated by ESG AI</Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
};

export default ChatHistoryPDF;
