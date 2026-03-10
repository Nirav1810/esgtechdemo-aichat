"use client";

import React, { useState, useEffect, useRef } from "react";

interface DetachedAIChatProps {
  isOpen: boolean;
  onClose: () => void;
  contextData: string;
  pageType: "dashboard" | "ghg-report";
  onDock: () => void;
}

export default function DetachedAIChat({
  isOpen,
  onClose,
  contextData,
  pageType,
  onDock,
}: DetachedAIChatProps) {
  const [isWindowReady, setIsWindowReady] = useState(false);
  const openedWindowRef = useRef<Window | null>(null);
  const dataRef = useRef({ contextData, pageType });

  useEffect(() => {
    dataRef.current = { contextData, pageType };
  }, [contextData, pageType]);

  useEffect(() => {
    if (!isOpen) return;

    const openDetachedWindow = () => {
      const width = 450;
      const height = 700;
      const left = window.screen.width - width - 20;
      const top = 20;

      const windowFeatures = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;

      const newWindow = window.open(
        `/detached-chat?pageType=${pageType}`,
        "ESG-AI-Chat",
        windowFeatures
      );

      if (!newWindow) {
        console.error("Failed to open new window. Popup blocker may be enabled.");
        onDock();
        return;
      }

      openedWindowRef.current = newWindow;
      setIsWindowReady(true);
    };

    openDetachedWindow();

    return () => {
      if (openedWindowRef.current && !openedWindowRef.current.closed) {
        openedWindowRef.current.close();
      }
    };
  }, [isOpen, pageType, onDock]);

  useEffect(() => {
    const sendDataToWindow = () => {
      if (isWindowReady && openedWindowRef.current && !openedWindowRef.current.closed) {
        openedWindowRef.current.postMessage(
          {
            type: "init",
            contextData: dataRef.current.contextData,
            pageType: dataRef.current.pageType,
          },
          "*"
        );
      }
    };

    const handleReadyMessage = (event: MessageEvent) => {
      if (event.data.type === "readyForChatData") {
        sendDataToWindow();
      }
    };

    window.addEventListener("message", handleReadyMessage);
    
    const checkReady = setInterval(() => {
      if (openedWindowRef.current && !openedWindowRef.current.closed) {
        try {
          if (openedWindowRef.current.document.readyState === "complete") {
            sendDataToWindow();
            clearInterval(checkReady);
          }
        } catch (e) {
          clearInterval(checkReady);
        }
      } else {
        clearInterval(checkReady);
      }
    }, 100);

    setTimeout(() => clearInterval(checkReady), 5000);

    return () => {
      window.removeEventListener("message", handleReadyMessage);
      clearInterval(checkReady);
    };
  }, [isWindowReady]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "windowClosed") {
        onDock();
      }
      if (event.data.type === "dockBack") {
        onDock();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onDock]);

  return null;
}
