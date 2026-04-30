"use client";

import { useState } from "react";
import { PRESET_AVATARS } from "./avatarPresets";

const FONT_STACKS: Record<string, string> = {
  "inter":        "var(--font-inter), Inter, system-ui, sans-serif",
  "public-sans":  "var(--font-public-sans), 'Public Sans', system-ui, sans-serif",
  "nunito":       "var(--font-nunito), Nunito, system-ui, sans-serif",
  "merriweather": "var(--font-merriweather), Merriweather, Georgia, serif",
  "roboto":       "var(--font-roboto), Roboto, system-ui, sans-serif",
};

const BG_PRESETS: Record<string, string> = {
  chalk:   "linear-gradient(160deg,#f9fafb 0%,#f3f4f6 100%)",
  mist:    "linear-gradient(160deg,#ede9fe 0%,#e0f2fe 100%)",
  blush:   "linear-gradient(160deg,#fce7f3 0%,#ede9fe 100%)",
  rose:    "linear-gradient(160deg,#fff1f2 0%,#fce7f3 100%)",
  ocean:   "linear-gradient(160deg,#0ea5e9 0%,#6366f1 100%)",
  aurora:  "linear-gradient(160deg,#7c3aed 0%,#db2777 50%,#f59e0b 100%)",
  dusk:    "linear-gradient(160deg,#1e1b4b 0%,#4c1d95 100%)",
  carbon:  "linear-gradient(160deg,#111827 0%,#1f2937 100%)",
  forest:  "linear-gradient(160deg,#064e3b 0%,#065f46 100%)",
  golden:  "linear-gradient(160deg,#92400e 0%,#d97706 100%)",
  slate:   "linear-gradient(160deg,#0f172a 0%,#334155 100%)",
  mesh:    "radial-gradient(ellipse at 20% 20%,#a78bfa 0%,transparent 50%),radial-gradient(ellipse at 80% 80%,#38bdf8 0%,transparent 50%),#1e1b4b",
};

type TypingStyle = "dots" | "wave" | "pulse" | "bars";

const INDICATOR_OPTIONS: { id: TypingStyle; label: string; desc: string }[] = [
  { id: "dots",  label: "Bounce",  desc: "Three dots bouncing" },
  { id: "wave",  label: "Wave",    desc: "Cascading ripple" },
  { id: "pulse", label: "Pulse",   desc: "Expanding ring" },
  { id: "bars",  label: "Bars",    desc: "Equalizer bars" },
];

const KEYFRAMES = `
@keyframes lp-bounce {
  0%,80%,100% { transform: translateY(0); opacity: 0.5; }
  40%          { transform: translateY(-6px); opacity: 1; }
}
@keyframes lp-wave {
  0%,60%,100% { transform: scale(0.7); opacity: 0.4; }
  30%          { transform: scale(1.15); opacity: 1; }
}
@keyframes lp-bar {
  0%,100% { height: 4px; opacity: 0.5; }
  50%      { height: 14px; opacity: 1; }
}
@keyframes lp-pulse-dot {
  0%,100% { transform: scale(0.9); opacity: 0.7; }
  50%      { transform: scale(1.1); opacity: 1; }
}
@keyframes lp-pulse-ring {
  0%   { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(2.4); opacity: 0; }
}
`;

function TypingIndicator({ style, color, size = "sm" }: { style: TypingStyle; color: string; size?: "sm" | "md" }) {
  const dot = size === "md" ? "w-2.5 h-2.5" : "w-2 h-2";
  const gap = size === "md" ? "gap-2" : "gap-1.5";

  if (style === "dots") {
    return (
      <div className={`flex ${gap} items-center`}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`${dot} rounded-full`}
            style={{ backgroundColor: color, animation: `lp-bounce 1.4s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    );
  }

  if (style === "wave") {
    return (
      <div className={`flex ${gap} items-center`}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`${dot} rounded-full`}
            style={{ backgroundColor: color, animation: `lp-wave 1.4s ease-in-out infinite`, animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </div>
    );
  }

  if (style === "pulse") {
    const ringSize = size === "md" ? "w-2.5 h-2.5" : "w-2 h-2";
    return (
      <div className="relative flex items-center justify-center" style={{ width: size === "md" ? 24 : 20, height: size === "md" ? 20 : 16 }}>
        <span
          className={`${dot} rounded-full`}
          style={{ backgroundColor: color, animation: "lp-pulse-dot 1.5s ease-in-out infinite" }}
        />
        <span
          className={`absolute ${ringSize} rounded-full border-2`}
          style={{ borderColor: color, animation: "lp-pulse-ring 1.5s ease-out infinite" }}
        />
      </div>
    );
  }

  // bars
  const barW = size === "md" ? "w-[5px]" : "w-1";
  const barGap = size === "md" ? "gap-1.5" : "gap-1";
  return (
    <div className={`flex ${barGap} items-end`} style={{ height: size === "md" ? 18 : 14 }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`${barW} rounded-full`}
          style={{ backgroundColor: color, animation: `lp-bar 1.2s ease-in-out infinite`, animationDelay: `${i * 0.2}s`, height: 4 }}
        />
      ))}
    </div>
  );
}

interface LivePreviewProps {
  agentName: string;
  agentColor: string;
  agentStyle: "sharp" | "soft" | "round";
  agentAvatarUrl?: string;
  fontFamily?: string;
  backgroundType?: "image" | "color";
  backgroundColor?: string;
  backgroundImageUrl?: string;
  typingIndicatorStyle?: TypingStyle;
  onTypingIndicatorChange?: (v: TypingStyle) => void;
}

export default function LivePreview({
  agentName, agentColor, agentStyle, agentAvatarUrl,
  fontFamily = "inter",
  backgroundType = "color",
  backgroundColor = "",
  backgroundImageUrl = "",
  typingIndicatorStyle = "dots",
  onTypingIndicatorChange,
}: LivePreviewProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const fontStack = FONT_STACKS[fontFamily] ?? FONT_STACKS["inter"];

  function resolveBg(): React.CSSProperties {
    if (backgroundType === "color" && backgroundColor) {
      return { backgroundColor };
    }
    if (backgroundType === "image") {
      if (backgroundImageUrl.startsWith("preset:")) {
        const id = backgroundImageUrl.replace("preset:", "");
        const css = BG_PRESETS[id];
        if (css) return { background: css };
      } else if (backgroundImageUrl) {
        return { backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" };
      }
    }
    return {};
  }
  const bgStyle = resolveBg();
  const initials = agentName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "AI";

  const r = {
    sharp: { bubble: "rounded-sm", bubbleUser: "rounded-sm", input: "rounded-sm", btn: "rounded-sm", chip: "rounded-sm" },
    soft:  { bubble: "rounded-2xl rounded-tl-sm", bubbleUser: "rounded-2xl rounded-tr-sm", input: "rounded-xl", btn: "rounded-xl", chip: "rounded-lg" },
    round: { bubble: "rounded-3xl rounded-tl-md", bubbleUser: "rounded-3xl rounded-tr-md", input: "rounded-2xl", btn: "rounded-2xl", chip: "rounded-xl" },
  }[agentStyle];

  const color = /^#[0-9a-fA-F]{6}$/.test(agentColor) ? agentColor : "#7367F0";

  function avatarContent(): React.ReactNode {
    if (!agentAvatarUrl || agentAvatarUrl === "preset:initials") return initials.charAt(0);
    if (agentAvatarUrl.startsWith("preset:")) {
      const id = agentAvatarUrl.slice(7);
      const preset = PRESET_AVATARS.find((a) => a.id === id);
      if (preset) return <div className="w-full h-full">{preset.svg}</div>;
    }
    return <img src={agentAvatarUrl} alt="" className="w-full h-full object-cover" />;
  }
  const avatarNode = avatarContent();

  function headerTextColor(): string {
    if ("background" in bgStyle || "backgroundImage" in bgStyle) return "#ffffff";
    const hex = (bgStyle as { backgroundColor?: string }).backgroundColor ?? "#FAFAFA";
    const r2 = parseInt(hex.slice(1, 3), 16) / 255;
    const g2 = parseInt(hex.slice(3, 5), 16) / 255;
    const b2 = parseInt(hex.slice(5, 7), 16) / 255;
    const lum = 0.299 * r2 + 0.587 * g2 + 0.114 * b2;
    return lum > 0.55 ? "#171717" : "#ffffff";
  }
  const headerFg = headerTextColor();

  const suggestions = [
    "How do I get started with your services?",
    "Tell me about what you can help me with",
    "Where can I find more information?",
  ];

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div className="flex flex-col h-full overflow-hidden border border-[#E5E5E5] dark:border-[#1E3050] bg-white dark:bg-[#111D30] shadow-sm" style={{ borderRadius: agentStyle === "sharp" ? "4px" : agentStyle === "soft" ? "16px" : "24px" }}>
        {/* Header */}
        <div
          className={`px-4 py-3 flex items-center justify-between shrink-0 ${Object.keys(bgStyle).length === 0 ? "bg-[#FAFAFA] dark:bg-[#0B1426]" : ""}`}
          style={bgStyle}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: `${color}cc`, fontFamily: "Roboto, system-ui, sans-serif" }}>
              {avatarNode}
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight" style={{ color: headerFg }}>{agentName || "Your Agent"}</p>
              <p className="text-xs" style={{ color: headerFg, opacity: 0.6 }}>Live preview</p>
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div
          className={`flex-1 overflow-y-auto p-4 space-y-3 ${Object.keys(bgStyle).length === 0 ? "bg-[#FAFAFA] dark:bg-[#0B1426]" : ""}`}
          style={{ fontFamily: fontStack, ...bgStyle }}
        >
          {/* Greeting bubble */}
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 mt-0.5 flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: color, fontFamily: "Roboto, system-ui, sans-serif" }}>
              {avatarNode}
            </div>
            <div className={`bg-white dark:bg-[#111D30] ${r.bubble} px-3.5 py-2.5 shadow-sm border border-[#F5F5F5] dark:border-[#1E3050] max-w-[85%]`}>
              <p className="text-sm text-[#404040] dark:text-[#C8D8EE]">
                Hi! I&apos;m {agentName || "your agent"}. How can I help you today?
              </p>
            </div>
          </div>

          {/* Suggestion chips */}
          <div className="ml-9 space-y-1.5">
            {suggestions.map((s, i) => (
              <button
                key={i}
                className={`block w-full text-left text-xs px-3 py-2 ${r.chip} bg-white dark:bg-[#111D30] border border-[#E5E5E5] dark:border-[#1E3050] text-[#525252] dark:text-[#C8D8EE] hover:bg-[#FAFAFA] dark:hover:bg-[#162238] transition-colors truncate`}
                style={{ borderLeftColor: color, borderLeftWidth: "2px" }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* User message */}
          <div className="flex justify-end">
            <div className={`${r.bubbleUser} px-3.5 py-2.5 max-w-[75%] text-white text-sm`} style={{ backgroundColor: color }}>
              {suggestions[0]}
            </div>
          </div>

          {/* Agent response */}
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 mt-0.5 flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: color, fontFamily: "Roboto, system-ui, sans-serif" }}>
              {avatarNode}
            </div>
            <div className={`bg-white dark:bg-[#111D30] ${r.bubble} px-3.5 py-2.5 shadow-sm border border-[#F5F5F5] dark:border-[#1E3050] max-w-[85%]`}>
              <p className="text-sm text-[#404040] dark:text-[#C8D8EE] leading-relaxed">
                Of course! I can help you get started. What specific aspect are you most interested in?
              </p>
            </div>
          </div>

          {/* Typing indicator — clickable to change style */}
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 mt-0.5 flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: color, fontFamily: "Roboto, system-ui, sans-serif" }}>
              {avatarNode}
            </div>
            <button
              onClick={() => setPickerOpen(true)}
              title="Click to change typing indicator"
              className={`group relative bg-white dark:bg-[#111D30] ${r.bubble} px-3.5 py-2.5 shadow-sm border transition-all duration-150 cursor-pointer`}
              style={{ borderColor: pickerOpen ? color : "transparent" }}
              onMouseEnter={(e) => { if (!pickerOpen) (e.currentTarget as HTMLElement).style.borderColor = `${color}80`; }}
              onMouseLeave={(e) => { if (!pickerOpen) (e.currentTarget as HTMLElement).style.borderColor = "transparent"; }}
            >
              <TypingIndicator style={typingIndicatorStyle} color={color} />
              <span className="absolute -top-6 left-0 text-[9px] font-medium text-[#A3A3A3] dark:text-[#7A9BBF] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Click to change
              </span>
            </button>
          </div>
        </div>

        {/* Input bar — floats on the chat background */}
        <div className="px-4 pb-3 pt-1 shrink-0" style={{ fontFamily: fontStack, ...bgStyle }}>
          <div className={`flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-[#111D30]/80 backdrop-blur-sm border border-[#E5E5E5] dark:border-[#1E3050] shadow-sm ${r.input}`}>
            <span className="text-xs text-[#A3A3A3] flex-1">Ask something...</span>
            <button
              className={`w-6 h-6 ${r.btn} flex items-center justify-center shrink-0`}
              style={{ backgroundColor: color }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 1L9 5L5 9M1 5H9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Typing indicator picker modal */}
      {pickerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setPickerOpen(false)}
        >
          <div
            className="bg-white dark:bg-[#111D30] rounded-2xl border border-[#E5E5E5] dark:border-[#1E3050] shadow-[0_8px_40px_rgba(23,23,23,0.16)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)] p-5 w-72"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-[#262626] dark:text-[#C8D8EE]">Loading indicator</h3>
                <p className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF] mt-0.5">Shown while the agent is typing</p>
              </div>
              <button
                onClick={() => setPickerOpen(false)}
                className="p-1.5 rounded-lg text-[#A3A3A3] hover:text-[#404040] dark:hover:text-[#C8D8EE] hover:bg-[#F5F5F5] dark:hover:bg-[#1E3050] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {INDICATOR_OPTIONS.map(({ id, label, desc }) => {
                const active = typingIndicatorStyle === id;
                return (
                  <button
                    key={id}
                    onClick={() => {
                      onTypingIndicatorChange?.(id);
                      setPickerOpen(false);
                    }}
                    className={`flex flex-col items-center gap-3 px-3 py-4 rounded-xl border-2 transition-all duration-150
                      ${active
                        ? "border-[color] bg-[color]/5"
                        : "border-[#E5E5E5] dark:border-[#1E3050] bg-white dark:bg-[#162238] hover:border-[color]/50"
                      }`}
                    style={{
                      borderColor: active ? color : undefined,
                      backgroundColor: active ? `${color}0f` : undefined,
                    }}
                  >
                    <div className="flex items-center justify-center h-6">
                      <TypingIndicator style={id} color={color} size="md" />
                    </div>
                    <div className="text-center">
                      <p className={`text-xs font-semibold leading-tight ${active ? "text-[#262626] dark:text-[#C8D8EE]" : "text-[#525252] dark:text-[#C8D8EE]"}`}>
                        {label}
                      </p>
                      <p className="text-[10px] text-[#A3A3A3] dark:text-[#7A9BBF] mt-0.5">{desc}</p>
                    </div>
                    {active && (
                      <span className="absolute top-2 right-2 hidden">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
