"use client";

import { useState, useRef, useEffect } from "react";
import type { PersonaState } from "./types";

// ─── Types ────────────────────────────────────────────────────────────────────

type DiffEntry = { label: string; type: "add" | "change" | "remove" };

interface Message {
  id: string;
  role: "user" | "assistant" | "error";
  text: string;
  diff?: DiffEntry[];
  retryText?: string; // original user text to retry
}

interface Props {
  state: PersonaState;
  onApply: (patch: Partial<PersonaState>) => void;
}

// ─── Suggestions metadata ─────────────────────────────────────────────────────

// Sorted by strategic impact from agent_taxonomy_report.pdf:
// Role first (JTBD = most fundamental), then biggest config gaps:
// Guardrails +44pp, Behavior +41pp/+33pp, Format +36pp, Tone
const INITIAL_SUGGESTIONS = [
  // Role — JTBD (taxonomy top categories by popularity + engagement)
  "Customer support",       // 22% popular, #1 category
  "Knowledge base Q&A",     // +8.3pp new users, gateway category
  "Education & training",   // 17.9% popular
  "Domain expert",          // 5,425 avg prompts, highest engagement
  "Lead capture",           // +2.4pp new users
  "Coaching",               // +9.6pp new users

  // Guardrails — biggest config gap +44.2pp
  "Don't make up info",     // core accuracy guardrail
  "Refuse off-topic",       // stay in scope
  "No competitor talk",     // brand safety
  "No medical/legal advice",// liability protection
  "Stay in knowledge base", // KB-specific guardrail
  "Escalate to human",      // escalation rules +30.9pp gap

  // Behavior — follow-up +41.9pp, source citation +33.6pp gaps
  "Ask clarifying questions", // follow-up questions gap
  "Always cite sources",      // source citation gap
  "Collect contact info",     // lead capture behavior
  "Book a call CTA",          // CTA actions gap
  "Match user language",      // language rules gap
  "Friendly greeting",        // greeting script gap

  // Tone — Q2 data from taxonomy report
  "Professional tone",
  "Friendly & warm",
  "Concise & direct",
  "Empathetic tone",
  "Conversational",
  "Formal tone",

  // Format — response format rules +36.4pp gap
  "Bullet point answers",
  "Step-by-step guides",
  "Short & scannable",
  "Detailed responses",
  "Adaptive length",
];

const CHIPS_INITIAL_VISIBLE = 6;

type SuggestionCategory = "role" | "tone" | "format" | "guardrails" | "behavior";

const SUGGESTION_META: Record<string, { icon: string; category: SuggestionCategory }> = {
  // Role
  "Customer support":         { icon: "🎧", category: "role"       },
  "Knowledge base Q&A":       { icon: "📚", category: "role"       },
  "Education & training":     { icon: "🎓", category: "role"       },
  "Domain expert":            { icon: "🧠", category: "role"       },
  "Lead capture":             { icon: "🎯", category: "role"       },
  "Coaching":                 { icon: "🤝", category: "role"       },
  // Guardrails
  "Don't make up info":       { icon: "✓",  category: "guardrails" },
  "Refuse off-topic":         { icon: "⊘",  category: "guardrails" },
  "No competitor talk":       { icon: "✕",  category: "guardrails" },
  "No medical/legal advice":  { icon: "⚠",  category: "guardrails" },
  "Stay in knowledge base":   { icon: "⊞",  category: "guardrails" },
  "Escalate to human":        { icon: "↗",  category: "guardrails" },
  // Behavior
  "Ask clarifying questions": { icon: "?",  category: "behavior"   },
  "Always cite sources":      { icon: "¶",  category: "behavior"   },
  "Collect contact info":     { icon: "✉",  category: "behavior"   },
  "Book a call CTA":          { icon: "📞", category: "behavior"   },
  "Match user language":      { icon: "🌐", category: "behavior"   },
  "Friendly greeting":        { icon: "👋", category: "behavior"   },
  // Tone
  "Professional tone":        { icon: "Aa", category: "tone"       },
  "Friendly & warm":          { icon: "✦",  category: "tone"       },
  "Concise & direct":         { icon: "→",  category: "tone"       },
  "Empathetic tone":          { icon: "♡",  category: "tone"       },
  "Conversational":           { icon: "≈",  category: "tone"       },
  "Formal tone":              { icon: "↑",  category: "tone"       },
  // Format
  "Bullet point answers":     { icon: "≡",  category: "format"     },
  "Step-by-step guides":      { icon: "1→", category: "format"     },
  "Short & scannable":        { icon: "~",  category: "format"     },
  "Detailed responses":       { icon: "≣",  category: "format"     },
  "Adaptive length":          { icon: "◎",  category: "format"     },
};

const CATEGORY_CONFIG: Record<SuggestionCategory, { chip: string }> = {
  role:       { chip: "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800/60 text-indigo-800 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 hover:border-indigo-400 dark:hover:border-indigo-600" },
  guardrails: { chip: "bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800/60 text-violet-800 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/40 hover:border-violet-400 dark:hover:border-violet-600" },
  behavior:   { chip: "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/40 hover:border-rose-400 dark:hover:border-rose-600" },
  tone:       { chip: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 hover:border-amber-400 dark:hover:border-amber-600" },
  format:     { chip: "bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800/60 text-sky-800 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/40 hover:border-sky-400 dark:hover:border-sky-600" },
};

const DIFF_FIELD_LABELS: Partial<Record<keyof PersonaState, string>> = {
  agentName: "Name", role: "Role", mission: "Mission",
  audience: "Audience", boundaries: "Boundaries", outputStyle: "Output style",
};

function computeDiff(before: PersonaState, patch: Partial<PersonaState>): DiffEntry[] {
  const entries: DiffEntry[] = [];
  for (const [key, newVal] of Object.entries(patch)) {
    if (key === "additionalInstructions") continue;
    const oldVal = before[key as keyof PersonaState];
    if (key === "tone" && typeof newVal === "number" && typeof oldVal === "number") {
      const dir = newVal < oldVal ? "more formal" : "more casual";
      entries.push({ label: `Tone → ${newVal}/100 (${dir})`, type: "change" });
    } else if (Array.isArray(newVal) && Array.isArray(oldVal)) {
      (newVal as string[]).filter((v: string) => !(oldVal as string[]).includes(v))
        .forEach((v: string) => entries.push({ label: v, type: "add" }));
      (oldVal as string[]).filter((v: string) => !(newVal as string[]).includes(v))
        .forEach((v: string) => entries.push({ label: v, type: "remove" }));
    } else if (typeof newVal === "string" && newVal !== oldVal && newVal) {
      const label = DIFF_FIELD_LABELS[key as keyof PersonaState] ?? key;
      entries.push({ label: `${label} set`, type: "change" });
    }
  }
  return entries;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BuilderChat({ state, onApply }: Props) {
  const INIT_ID = "init";
  const [messages, setMessages] = useState<Message[]>([
    { id: INIT_ID, role: "assistant", text: "What would you like to adjust? Pick a suggestion or describe it in your own words." },
  ]);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>(INITIAL_SUGGESTIONS);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showAllChips, setShowAllChips] = useState(false);
  const [activeTab, setActiveTab] = useState<SuggestionCategory | "all">("role");
  const [followUpText, setFollowUpText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const prevStateRef = useRef<PersonaState | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function handleUndo() {
    if (!prevStateRef.current) return;
    onApply(prevStateRef.current);
    prevStateRef.current = null;
    setCanUndo(false);
  }

  async function sendText(text: string) {
    if (!text.trim() || loading) return;
    setShowSuggestions(false);
    setFollowUpText(null);
    setCanUndo(false);
    prevStateRef.current = null;
    setInput("");

    const userMsg: Message = { id: `${Date.now()}-u`, role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/natural-mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, state }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { id: `${Date.now()}-e`, role: "error", text: data.reply ?? "Something went wrong. Please try again.", retryText: text },
        ]);
        return;
      }

      let diff: DiffEntry[] = [];
      if (data.patch) {
        diff = computeDiff(state, data.patch);
        prevStateRef.current = { ...state };
        setCanUndo(true);
        const existing = state.additionalInstructions?.trim();
        const additionalInstructions = existing ? `${existing}\n${text}` : text;
        onApply({ ...data.patch, additionalInstructions });
      }

      const assistantMsg: Message = {
        id: `${Date.now()}-a`,
        role: "assistant",
        text: data.reply,
        diff: diff.length > 0 ? diff : undefined,
      };
      setMessages((prev) => [...prev, assistantMsg]);

      if (data.followUp) setFollowUpText(data.followUp);

      if (data.nextSuggestions?.length) {
        setSuggestions(data.nextSuggestions);
        setShowAllChips(true);
        setActiveTab("all");
        setShowSuggestions(true);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-e`, role: "error", text: "Connection error. Please try again.", retryText: text },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const allChips = suggestions;
  const isInitialSuggestions = allChips.every((s) => SUGGESTION_META[s]);

  // Filter by active tab, then apply show-more
  const tabFilteredChips = activeTab === "all"
    ? allChips
    : allChips.filter((s) => SUGGESTION_META[s]?.category === activeTab);

  const TABS: { id: SuggestionCategory | "all"; label: string; activeClass: string }[] = [
    { id: "all",        label: "All",        activeClass: "bg-gray-800 dark:bg-[#C8D8EE] text-white dark:text-[#0B1426]" },
    { id: "role",       label: "Role",       activeClass: "bg-indigo-500 text-white" },
    { id: "guardrails", label: "Guardrails", activeClass: "bg-violet-500 text-white" },
    { id: "behavior",   label: "Behavior",   activeClass: "bg-rose-500 text-white" },
    { id: "tone",       label: "Tone",       activeClass: "bg-amber-500 text-white" },
    { id: "format",     label: "Format",     activeClass: "bg-sky-500 text-white" },
  ];
  const isEmptyState = messages.length === 1 && messages[0].id === INIT_ID;

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">

        {/* Zero-data empty state */}
        {isEmptyState ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 px-8 text-center">
            <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-500 dark:text-violet-400 text-xl">
              ✦
            </div>
            <p className="text-sm text-gray-500 dark:text-[#7A9BBF] leading-relaxed max-w-xs">
              {messages[0].text}
            </p>
          </div>
        ) : (
        <>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
            <div
              className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed
                ${msg.role === "user"
                  ? "bg-violet-600 text-white rounded-br-sm"
                  : msg.role === "error"
                    ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-bl-sm"
                    : "bg-white dark:bg-[#111D30] text-gray-700 dark:text-[#C8D8EE] border border-gray-100 dark:border-[#1E3050] rounded-bl-sm"
                }`}
            >
              {msg.text}
              {msg.role === "error" && msg.retryText && (
                <button
                  onClick={() => sendText(msg.retryText!)}
                  className="mt-2 flex items-center gap-1 text-xs font-semibold text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                >
                  <span>↺</span> Retry
                </button>
              )}
            </div>

            {/* Inline diff tags */}
            {msg.diff && msg.diff.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5 max-w-[85%]">
                {msg.diff.map((entry, i) => (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border
                      ${entry.type === "add"
                        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                        : entry.type === "remove"
                          ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 border-red-200 dark:border-red-800"
                          : "bg-gray-50 dark:bg-[#162238] text-gray-500 dark:text-[#7A9BBF] border-gray-200 dark:border-[#1E3050]"
                      }`}
                  >
                    {entry.type === "add" && <span>+</span>}
                    {entry.type === "remove" && <span>−</span>}
                    {entry.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-[#111D30] border border-gray-100 dark:border-[#1E3050] rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-[#7A9BBF] animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
        </>
        )}
      </div>

      {/* Suggestion card — above input */}
      {showSuggestions && !loading && (
        <div className="shrink-0 px-4 pt-3 pb-1 border-t border-gray-100 dark:border-[#1E3050]">
          <style>{`
            @keyframes suggest-in {
              0%   { opacity: 0; transform: translateY(10px) scale(0.98); }
              60%  { opacity: 1; transform: translateY(-2px) scale(1.005); }
              100% { opacity: 1; transform: translateY(0) scale(1); }
            }
            @media (prefers-reduced-motion: no-preference) {
              .suggest-card { animation: suggest-in 0.32s cubic-bezier(0.22, 1, 0.36, 1) both; }
            }
          `}</style>
          <div className="suggest-card bg-white dark:bg-[#111D30] rounded-2xl border border-gray-100 dark:border-[#1E3050] overflow-hidden">

            {/* Category tabs — only for initial suggestions */}
            {isInitialSuggestions && !followUpText && (
              <div className="flex gap-1 px-3 pt-3 pb-2 border-b border-gray-100 dark:border-[#1E3050]">
                {TABS.map(({ id, label, activeClass }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all duration-150 ${
                      activeTab === id
                        ? activeClass
                        : "text-gray-400 dark:text-[#7A9BBF] hover:text-gray-600 dark:hover:text-[#C8D8EE] hover:bg-gray-100 dark:hover:bg-[#1E3050]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            <div className="px-4 py-3 space-y-3">
            {/* Follow-up question */}
            {followUpText && (
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-widest text-sky-500 dark:text-sky-400 mb-1">Suggestion</span>
                <p className="text-xs text-sky-800 dark:text-sky-300 leading-relaxed">{followUpText}</p>
              </div>
            )}

            {/* Chips — fixed to 2 rows */}
            <div className="flex flex-wrap items-start gap-1.5 overflow-hidden" style={{ height: "62px" }}>
              {tabFilteredChips.map((item) => {
                const meta = SUGGESTION_META[item];
                const cfg = meta ? CATEGORY_CONFIG[meta.category] : null;
                return (
                  <button
                    key={item}
                    onClick={() => sendText(item)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border transition-all duration-150 hover:scale-[1.04] hover:shadow-sm active:scale-[0.97] ${
                      cfg
                        ? cfg.chip
                        : "bg-white dark:bg-[#111D30] border-gray-200 dark:border-[#1E3050] text-gray-600 dark:text-[#C8D8EE] hover:border-violet-400 hover:text-violet-700 dark:hover:border-violet-600 dark:hover:text-violet-300"
                    }`}
                  >
                    {meta && <span className="font-bold opacity-60 text-[11px] leading-none">{meta.icon}</span>}
                    {item}
                  </button>
                );
              })}
            </div>

            {/* Undo */}
            {canUndo && (
              <div className="pt-1 border-t border-gray-100 dark:border-[#1E3050]">
                <button
                  onClick={handleUndo}
                  className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-[#7A9BBF] hover:text-gray-700 dark:hover:text-[#C8D8EE] transition-colors"
                >
                  <span>↩</span>
                  <span>Undo last change</span>
                </button>
              </div>
            )}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="shrink-0 px-4 py-3 border-t border-gray-200 dark:border-[#1E3050] flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !loading) sendText(input); }}
          placeholder="e.g. make responses shorter and more direct…"
          disabled={loading}
          className="flex-1 px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-[#1E3050] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 bg-white dark:bg-[#162238] text-gray-800 dark:text-[#C8D8EE] placeholder:text-gray-400 dark:placeholder:text-[#7A9BBF] disabled:opacity-50 transition-all"
          autoFocus
        />
        <button
          onClick={() => sendText(input)}
          disabled={!input.trim() || loading}
          className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors shrink-0"
        >
          {loading ? "…" : "Apply"}
        </button>
      </div>
    </div>
  );
}
