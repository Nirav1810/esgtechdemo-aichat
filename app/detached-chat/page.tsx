"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AISidebar from "../components/AISidebar";

function DetachedChatContent() {
  const searchParams = useSearchParams();
  const pageType = (searchParams.get("pageType") as "dashboard" | "ghg-report") || "dashboard";
  const [contextData, setContextData] = useState<string>("");
  const [isReady, setIsReady] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(450);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDockBack = () => {
    if (window.opener) {
      window.opener.postMessage({ type: "dockBack" }, "*");
    }
    window.close();
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "init") {
        setContextData(event.data.contextData);
        setIsReady(true);
      }
      if (event.data.type === "close") {
        window.close();
      }
    };

    window.addEventListener("message", handleMessage);

    if (window.opener) {
      window.opener.postMessage({ type: "readyForChatData" }, "*");
    }

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setWindowWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", updateWidth);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, [isReady]);

  if (!isReady || !contextData) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-screen w-screen">
      <AISidebar
        isOpen={true}
        onClose={handleDockBack}
        contextData={contextData}
        pageType={pageType}
        width={windowWidth}
        isDetached={true}
      />
    </div>
  );
}

export default function DetachedChatPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing environment...</p>
        </div>
      </div>
    }>
      <DetachedChatContent />
    </Suspense>
  );
}
