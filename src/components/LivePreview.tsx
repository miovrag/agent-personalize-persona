"use client";

import { useEffect, useState } from "react";

interface PreviewData {
  greeting: string;
  response: string;
  suggestions: string[];
}

interface LivePreviewProps {
  agentName: string;
  previewData: PreviewData;
  tone: number;
}

export default function LivePreview({ agentName, previewData, tone }: LivePreviewProps) {
  const [displayData, setDisplayData] = useState(previewData);
  const [isUpdating, setIsUpdating] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setIsUpdating(true);
    const timer = setTimeout(() => {
      setDisplayData(previewData);
      setKey((k) => k + 1);
      setIsUpdating(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [previewData]);

  // Derive avatar initials and colors from agent name
  const initials = agentName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "AI";

  const accentColor = tone < 30
    ? "#2563eb"
    : tone < 60
    ? "#7c3aed"
    : tone < 80
    ? "#ea580c"
    : "#16a34a";

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm">
      {/* Preview header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ backgroundColor: accentColor }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
            {initials}
          </div>
          <div>
            <p className="text-white text-sm font-semibold leading-tight">{agentName || "Your Agent"}</p>
            <p className="text-white/70 text-xs">Live preview</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${isUpdating ? "bg-yellow-300 pulse-soft" : "bg-emerald-300"}`} />
          <span className="text-white/70 text-xs">{isUpdating ? "Updating..." : "Live"}</span>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {/* Greeting bubble */}
        <div key={`greeting-${key}`} className="flex gap-2.5 preview-refresh">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
            style={{ backgroundColor: accentColor }}
          >
            {initials.charAt(0)}
          </div>
          <div className="bg-white rounded-2xl rounded-tl-sm px-3.5 py-2.5 shadow-sm border border-gray-100 max-w-[85%]">
            <p className="text-sm text-gray-700">{displayData.greeting}</p>
          </div>
        </div>

        {/* Suggested questions */}
        <div key={`suggestions-${key}`} className="ml-9 space-y-1.5 preview-refresh" style={{ animationDelay: "0.1s" }}>
          {displayData.suggestions.map((s, i) => (
            <button
              key={i}
              className="block w-full text-left text-xs px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors truncate"
              style={{ borderLeftColor: accentColor, borderLeftWidth: "2px" }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Sample user message */}
        <div key={`user-${key}`} className="flex justify-end preview-refresh" style={{ animationDelay: "0.15s" }}>
          <div className="bg-gray-200 rounded-2xl rounded-tr-sm px-3.5 py-2.5 max-w-[75%]">
            <p className="text-sm text-gray-700">{displayData.suggestions[0]}</p>
          </div>
        </div>

        {/* Agent response */}
        <div key={`response-${key}`} className="flex gap-2.5 preview-refresh" style={{ animationDelay: "0.2s" }}>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
            style={{ backgroundColor: accentColor }}
          >
            {initials.charAt(0)}
          </div>
          <div className="bg-white rounded-2xl rounded-tl-sm px-3.5 py-2.5 shadow-sm border border-gray-100 max-w-[85%]">
            <p className="text-sm text-gray-700 leading-relaxed">{displayData.response}</p>
          </div>
        </div>
      </div>

      {/* Input bar */}
      <div className="px-4 py-3 border-t border-gray-100 bg-white">
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full">
          <span className="text-xs text-gray-400 flex-1">Ask something...</span>
          <button
            className="w-6 h-6 rounded-full flex items-center justify-center transition-colors"
            style={{ backgroundColor: accentColor }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 1L9 5L5 9M1 5H9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
