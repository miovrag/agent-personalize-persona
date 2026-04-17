"use client";

import { useState, useRef, useEffect } from "react";
import type { PersonaState } from "./types";
import { generateInstruction } from "./generateInstruction";

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
// Agent archetype tabs (5.2 Growth Opportunities) + original config tabs:
// • Expert  — 5,425 avg prompts (5× mean), only 1.2% new users → goldmine
// • Ops     — 2,613 avg prompts, enterprise-embedded, only 0.6% new users
// • Coaching — 13.7% new users but lowest engagement (609 prompts) → churn fix

type SuggestionCategory =
  | "support" | "expert" | "ops" | "coaching" | "content"
  | "guardrails" | "behavior" | "tone" | "format";

const SUGGESTION_META: Record<string, { icon: string; category: SuggestionCategory }> = {
  // ── Archetypes ──────────────────────────────────────────────────────────────
  // Support — #1 by popularity (22%), gateway archetype
  "Customer support":         { icon: "🎧", category: "support"    },
  "Knowledge base Q&A":       { icon: "📖", category: "support"    },
  "Book a call CTA":          { icon: "📞", category: "support"    },
  "Match user language":      { icon: "🌐", category: "support"    },
  "Collect contact info":     { icon: "✉️",  category: "support"    },
  "Friendly greeting":        { icon: "👋", category: "support"    },
  "Lead capture":             { icon: "🎯", category: "support"    },
  "Education & training":     { icon: "🎓", category: "support"    },

  // Expert — Domain advisor goldmine (5.2 growth opp #1)
  "Legal Q&A agent":          { icon: "⚖️",  category: "expert"     },
  "Tax advisor":              { icon: "💰", category: "expert"     },
  "Medical info guide":       { icon: "🏥", category: "expert"     },
  "Add disclaimer logic":     { icon: "⚠️",  category: "expert"     },
  "Cite authoritative sources":{ icon:"📚", category: "expert"     },
  "Domain-only scope":        { icon: "🔒", category: "expert"     },
  "Structured advice format": { icon: "📋", category: "expert"     },
  "Domain expert":            { icon: "🧠", category: "expert"     },

  // Ops — Internal ops & HR enterprise potential (5.2 growth opp #2)
  "HR policy bot":            { icon: "👥", category: "ops"        },
  "Onboarding assistant":     { icon: "🧑‍💼", category: "ops"        },
  "SOP documentation":        { icon: "📄", category: "ops"        },
  "Workflow guide":           { icon: "🔄", category: "ops"        },
  "IT helpdesk":              { icon: "🎫", category: "ops"        },
  "Internal use only":        { icon: "🔐", category: "ops"        },
  "Data retrieval agent":     { icon: "📊", category: "ops"        },
  "Process automation":       { icon: "⚙️",  category: "ops"        },

  // Coaching — fix churn (5.2 growth opp #3) with structured programs
  "Goal-setting framework":   { icon: "🎯", category: "coaching"   },
  "Structured check-ins":     { icon: "✅", category: "coaching"   },
  "Progress tracking":        { icon: "📈", category: "coaching"   },
  "Accountability prompts":   { icon: "🔁", category: "coaching"   },
  "Session recap":            { icon: "📝", category: "coaching"   },
  "Milestone celebrations":   { icon: "🏆", category: "coaching"   },
  "Learning modules":         { icon: "🧠", category: "coaching"   },
  "Motivation boosts":        { icon: "💪", category: "coaching"   },

  // Content — brand & creative
  "Content creator":          { icon: "✍️",  category: "content"    },
  "Brand voice guide":        { icon: "🎨", category: "content"    },
  "Social media copy":        { icon: "📱", category: "content"    },
  "SEO writing":              { icon: "🔍", category: "content"    },
  "Ideation assistant":       { icon: "💡", category: "content"    },
  "Content calendar":         { icon: "📅", category: "content"    },

  // ── Config tabs (original) ──────────────────────────────────────────────────
  // Guardrails — biggest config gap +44.2pp
  "Don't make up info":            { icon: "✓",  category: "guardrails" },
  "Refuse off-topic":              { icon: "⊘",  category: "guardrails" },
  "No competitor talk":            { icon: "✕",  category: "guardrails" },
  "No medical/legal advice":       { icon: "⚠",  category: "guardrails" },
  "Stay in knowledge base":        { icon: "⊞",  category: "guardrails" },
  "Escalate to human":             { icon: "↗",  category: "guardrails" },
  "Never reveal system prompt":    { icon: "🔒", category: "guardrails" },
  "No personal opinions":          { icon: "○",  category: "guardrails" },
  "Always add disclaimer":         { icon: "!",  category: "guardrails" },
  "No pricing commitments":        { icon: "⊘",  category: "guardrails" },
  "Decline harmful requests":      { icon: "⊗",  category: "guardrails" },
  "No sensitive data collection":  { icon: "🛡", category: "guardrails" },
  "Scope to business hours":       { icon: "⏱",  category: "guardrails" },
  "No unauthorized promises":      { icon: "✕",  category: "guardrails" },
  "Warn before sensitive topics":  { icon: "⚠",  category: "guardrails" },
  "Only answer in English":        { icon: "Aa", category: "guardrails" },
  "No code execution":             { icon: "⊗",  category: "guardrails" },
  "Require user confirmation":     { icon: "✓",  category: "guardrails" },

  // Behavior — follow-up +41.9pp, citation +33.6pp gaps
  "Ask clarifying questions": { icon: "?",  category: "behavior"   },
  "Always cite sources":      { icon: "¶",  category: "behavior"   },
  "Ask for feedback":         { icon: "★",  category: "behavior"   },
  "Proactive suggestions":    { icon: "→",  category: "behavior"   },
  "Summarise at end":         { icon: "≡",  category: "behavior"   },
  "Confirm before acting":    { icon: "✓",  category: "behavior"   },

  // Tone — taxonomy Q2 data
  "Professional tone":        { icon: "Aa", category: "tone"       },
  "Friendly & warm":          { icon: "✦",  category: "tone"       },
  "Concise & direct":         { icon: "→",  category: "tone"       },
  "Empathetic tone":          { icon: "♡",  category: "tone"       },
  "Conversational":           { icon: "≈",  category: "tone"       },
  "Formal tone":              { icon: "↑",  category: "tone"       },

  // Format — response format rules +36.4pp gap
  "Bullet point answers":     { icon: "≡",  category: "format"     },
  "Step-by-step guides":      { icon: "1→", category: "format"     },
  "Short & scannable":        { icon: "~",  category: "format"     },
  "Detailed responses":       { icon: "≣",  category: "format"     },
  "Adaptive length":          { icon: "◎",  category: "format"     },
  "Use headers & sections":   { icon: "§",  category: "format"     },
};

// Initial visible chips — mix of growth opps + popular archetypes + config classics
const INITIAL_SUGGESTIONS = [
  "Customer support", "Knowledge base Q&A", "Legal Q&A agent",
  "Tax advisor", "HR policy bot", "Goal-setting framework",
  "Don't make up info", "Professional tone", "Bullet point answers",
  "Escalate to human", "Empathetic tone", "Always cite sources",
  // Guardrails — expanded for granular persona definition
  "Refuse off-topic", "No competitor talk", "No medical/legal advice",
  "Stay in knowledge base", "Never reveal system prompt", "No personal opinions",
  "Always add disclaimer", "No pricing commitments", "Decline harmful requests",
  "No sensitive data collection", "No unauthorized promises",
  "Warn before sensitive topics", "No code execution", "Require user confirmation",
];

const CHIPS_INITIAL_VISIBLE = 6;

// Popularity rank — lower index = more popular (based on archetype usage data)
const POPULARITY_ORDER = [
  // Support (22% of agents — most popular archetype)
  "Customer support", "Knowledge base Q&A", "Friendly greeting", "Match user language",
  "Collect contact info", "Lead capture", "Book a call CTA", "Education & training",
  // Guardrails (biggest config gap +44.2pp — most commonly added)
  "Don't make up info", "Escalate to human", "Refuse off-topic", "No competitor talk",
  "No medical/legal advice", "Stay in knowledge base", "Always add disclaimer",
  "Decline harmful requests", "Never reveal system prompt", "No personal opinions",
  "No pricing commitments", "No sensitive data collection", "No unauthorized promises",
  "Warn before sensitive topics", "No code execution", "Require user confirmation",
  // Behavior (follow-up +41.9pp, citation +33.6pp gaps)
  "Always cite sources", "Ask clarifying questions", "Summarise at end",
  "Ask for feedback", "Proactive suggestions", "Confirm before acting",
  // Tone
  "Professional tone", "Friendly & warm", "Empathetic tone",
  "Concise & direct", "Conversational", "Formal tone",
  // Format (+36.4pp gap)
  "Bullet point answers", "Short & scannable", "Step-by-step guides",
  "Adaptive length", "Detailed responses", "Use headers & sections",
  // Expert (growth opp #1 — 5,425 avg prompts but only 1.2% new users)
  "Legal Q&A agent", "Tax advisor", "Medical info guide", "Domain expert",
  "Add disclaimer logic", "Cite authoritative sources", "Domain-only scope",
  "Structured advice format",
  // Ops (growth opp #2 — enterprise embedded)
  "HR policy bot", "Onboarding assistant", "IT helpdesk", "SOP documentation",
  "Workflow guide", "Internal use only", "Data retrieval agent", "Process automation",
  // Coaching (growth opp #3 — highest new-user share but lowest engagement)
  "Goal-setting framework", "Structured check-ins", "Progress tracking",
  "Accountability prompts", "Session recap", "Learning modules",
  "Milestone celebrations", "Motivation boosts",
  // Content
  "Content creator", "Brand voice guide", "Social media copy",
  "SEO writing", "Ideation assistant", "Content calendar",
];

const CATEGORY_CONFIG: Record<SuggestionCategory, { chip: string; label: string; dot: string; desc: string }> = {
  support:    { label: "Support",    dot: "bg-teal-400",   desc: "Handle customer queries, capture leads, and guide users to the right answer.",           chip: "bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800/60 text-teal-800 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/40 hover:border-teal-400 dark:hover:border-teal-600" },
  expert:     { label: "Expert",     dot: "bg-indigo-400", desc: "Deliver authoritative domain advice with disclaimers, citations, and scoped expertise.",   chip: "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800/60 text-indigo-800 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 hover:border-indigo-400 dark:hover:border-indigo-600" },
  ops:        { label: "Ops",        dot: "bg-slate-400",  desc: "Power internal workflows — HR, onboarding, SOPs, and IT helpdesk automation.",            chip: "bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/40 hover:border-slate-400 dark:hover:border-slate-600" },
  coaching:   { label: "Coaching",   dot: "bg-amber-400",  desc: "Guide users through goals, check-ins, progress tracking, and structured programs.",        chip: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 hover:border-amber-400 dark:hover:border-amber-600" },
  content:    { label: "Content",    dot: "bg-rose-400",   desc: "Generate on-brand copy, social posts, SEO content, and creative ideas.",                   chip: "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/40 hover:border-rose-400 dark:hover:border-rose-600" },
  guardrails: { label: "Guardrails", dot: "bg-violet-400", desc: "Define what the agent must never do — protect users, brand, and legal boundaries.",        chip: "bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800/60 text-violet-800 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/40 hover:border-violet-400 dark:hover:border-violet-600" },
  behavior:   { label: "Behavior",   dot: "bg-sky-400",    desc: "Shape how the agent acts — clarifying questions, citations, summaries, and follow-ups.",   chip: "bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800/60 text-sky-800 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/40 hover:border-sky-400 dark:hover:border-sky-600" },
  tone:       { label: "Tone",       dot: "bg-orange-400", desc: "Set the agent's voice — from formal and authoritative to warm and conversational.",         chip: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/60 text-orange-800 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/40 hover:border-orange-400 dark:hover:border-orange-600" },
  format:     { label: "Format",     dot: "bg-cyan-400",   desc: "Control response structure — bullets, step-by-step guides, headers, or adaptive length.",   chip: "bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800/60 text-cyan-800 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 hover:border-cyan-400 dark:hover:border-cyan-600" },
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
    { id: INIT_ID, role: "assistant", text: "What would you like to change? Pick a suggestion or type your own." },
  ]);
  const [input, setInput] = useState("");
  const [chipsExpanded, setChipsExpanded] = useState(false);
  const [suggestionsCollapsed, setSuggestionsCollapsed] = useState(true);
  const [followUpQuestion, setFollowUpQuestion] = useState<string | null>(null);
  const [followUpSuggestions, setFollowUpSuggestions] = useState<string[] | null>(null);
  const [phIndex, setPhIndex] = useState(0);
  const [phVisible, setPhVisible] = useState(true);

  const PLACEHOLDERS = [
    "Make responses shorter and more direct…",
    "Only answer questions about our product…",
    "Always greet users warmly by first name…",
    "Refuse to discuss competitor products…",
    "Use bullet points for all answers…",
    "Add a disclaimer when giving advice…",
    "Speak in a friendly, casual tone…",
  ];

  useEffect(() => {
    const cycle = setInterval(() => {
      setPhVisible(false);
      setTimeout(() => {
        setPhIndex((i) => (i + 1) % PLACEHOLDERS.length);
        setPhVisible(true);
      }, 250);
    }, 3200);
    return () => clearInterval(cycle);
  }, []);
  const [tabsCanScrollRight, setTabsCanScrollRight] = useState(false);
  const [tabsCanScrollLeft, setTabsCanScrollLeft] = useState(false);
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const [sortOrder, setSortOrder] = useState<"importance" | "alpha" | "type" | "popular">("importance");
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [sortMenuPos, setSortMenuPos] = useState<{ top: number; right: number } | null>(null);
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  function checkTabsScroll() {
    const el = tabsScrollRef.current;
    if (!el) return;
    setTabsCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
    setTabsCanScrollLeft(el.scrollLeft > 2);
  }

  function scrollTabsRight() {
    tabsScrollRef.current?.scrollBy({ left: 120, behavior: "smooth" });
  }

  function scrollTabsLeft() {
    tabsScrollRef.current?.scrollBy({ left: -120, behavior: "smooth" });
  }
  const [activeTab, setActiveTab] = useState<SuggestionCategory | "all" | "actions">("all");
  const [loading, setLoading] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [expandedDiffs, setExpandedDiffs] = useState<Set<string>>(new Set());

  function toggleDiff(id: string) {
    setExpandedDiffs((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  const prevStateRef = useRef<PersonaState | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    checkTabsScroll();
  }, [suggestionsCollapsed]);

  useEffect(() => {
    checkTabsScroll();
    window.addEventListener("resize", checkTabsScroll);
    return () => window.removeEventListener("resize", checkTabsScroll);
  }, []);

  useEffect(() => {
    if (!sortMenuOpen) return;
    function handleOutside(e: MouseEvent) {
      const t = e.target as Node;
      const inButton = sortMenuRef.current?.contains(t);
      const inDropdown = sortDropdownRef.current?.contains(t);
      if (!inButton && !inDropdown) setSortMenuOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [sortMenuOpen]);

  function handleUndo() {
    if (!prevStateRef.current) return;
    onApply(prevStateRef.current);
    prevStateRef.current = null;
    setCanUndo(false);
  }

  async function sendText(text: string) {
    if (!text.trim() || loading) return;
    setFollowUpQuestion(null);
    setFollowUpSuggestions(null);
    setCanUndo(false);
    prevStateRef.current = null;
    setInput("");
    // Reset textarea height after clearing
    const ta = document.querySelector<HTMLTextAreaElement>("#builder-input");
    if (ta) { ta.style.height = "auto"; }

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
        // Compute the full instruction from the new state and save it into
        // additionalInstructions so Settings > Detailed instructions stays in sync.
        const newState: PersonaState = { ...state, ...data.patch, additionalInstructions: "" };
        const additionalInstructions = generateInstruction(newState);
        onApply({ ...data.patch, additionalInstructions });
      }

      const assistantMsg: Message = {
        id: `${Date.now()}-a`,
        role: "assistant",
        text: data.reply,
        diff: diff.length > 0 ? diff : undefined,
      };
      setMessages((prev) => [...prev, assistantMsg]);

      if (data.followUp) setFollowUpQuestion(data.followUp);
      if (data.nextSuggestions?.length) setFollowUpSuggestions(data.nextSuggestions);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-e`, role: "error", text: "Connection error. Please try again.", retryText: text },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const CAT_ORDER: SuggestionCategory[] = ["support","guardrails","expert","ops","coaching","content","behavior","tone","format"];

  function applySort(chips: string[]): string[] {
    if (sortOrder === "alpha") return chips.slice().sort((a, b) => a.localeCompare(b));
    if (sortOrder === "type") return chips.slice().sort((a, b) => {
      const iA = CAT_ORDER.indexOf(SUGGESTION_META[a]?.category ?? "" as SuggestionCategory);
      const iB = CAT_ORDER.indexOf(SUGGESTION_META[b]?.category ?? "" as SuggestionCategory);
      return iA !== iB ? iA - iB : a.localeCompare(b);
    });
    if (sortOrder === "popular") return chips.slice().sort((a, b) => {
      const iA = POPULARITY_ORDER.indexOf(a);
      const iB = POPULARITY_ORDER.indexOf(b);
      const rankA = iA === -1 ? 999 : iA;
      const rankB = iB === -1 ? 999 : iB;
      return rankA !== rankB ? rankA - rankB : a.localeCompare(b);
    });
    // importance — preserve curated INITIAL_SUGGESTIONS order
    return chips.slice().sort((a, b) => INITIAL_SUGGESTIONS.indexOf(a) - INITIAL_SUGGESTIONS.indexOf(b));
  }

  // Filter by active tab
  const tabFilteredChips = applySort(
    activeTab === "all"
      ? INITIAL_SUGGESTIONS
      : INITIAL_SUGGESTIONS.filter((s) => SUGGESTION_META[s]?.category === activeTab)
  );

  const TABS: { id: SuggestionCategory | "all" | "actions"; label: string; activeClass: string }[] = [
    { id: "all",        label: "All",        activeClass: "bg-gray-800 dark:bg-[#C8D8EE] text-white dark:text-[#0B1426]" },
    { id: "support",    label: "Support",    activeClass: "bg-gray-800 dark:bg-[#C8D8EE] text-white dark:text-[#0B1426]" },
    { id: "guardrails", label: "Guardrails", activeClass: "bg-gray-800 dark:bg-[#C8D8EE] text-white dark:text-[#0B1426]" },
    { id: "expert",     label: "Expert ✦",   activeClass: "bg-gray-800 dark:bg-[#C8D8EE] text-white dark:text-[#0B1426]" },
    { id: "ops",        label: "Ops ✦",      activeClass: "bg-gray-800 dark:bg-[#C8D8EE] text-white dark:text-[#0B1426]" },
    { id: "coaching",   label: "Coaching",   activeClass: "bg-gray-800 dark:bg-[#C8D8EE] text-white dark:text-[#0B1426]" },
    { id: "content",    label: "Content",    activeClass: "bg-gray-800 dark:bg-[#C8D8EE] text-white dark:text-[#0B1426]" },
    { id: "behavior",   label: "Behavior",   activeClass: "bg-gray-800 dark:bg-[#C8D8EE] text-white dark:text-[#0B1426]" },
    { id: "tone",       label: "Tone",       activeClass: "bg-gray-800 dark:bg-[#C8D8EE] text-white dark:text-[#0B1426]" },
    { id: "format",     label: "Format",     activeClass: "bg-gray-800 dark:bg-[#C8D8EE] text-white dark:text-[#0B1426]" },
    { id: "actions",    label: "Actions",    activeClass: "bg-gray-800 dark:bg-[#C8D8EE] text-white dark:text-[#0B1426]" },
  ];
  const isEmptyState = messages.length === 1 && messages[0].id === INIT_ID;

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">

        {/* Zero-data empty state */}
        {isEmptyState ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
            {/* Logo with shimmer reflection */}
            <div className="relative w-20 h-20 rounded-3xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center overflow-hidden logo-pulse">
              <img src="/customgpt-mark.svg" alt="" width={44} height={44} className="star-icon relative z-10" />
              <div className="logo-shimmer absolute inset-0 z-20 pointer-events-none" />
            </div>
            <p className="text-sm text-gray-400 dark:text-[#7A9BBF] leading-relaxed max-w-xs">
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

            {/* Inline diff tags — read-only, collapsible */}
            {msg.diff && msg.diff.length > 0 && (
              <div className="mt-1.5 max-w-[85%]">
                <button
                  onClick={() => toggleDiff(msg.id)}
                  className="flex items-center gap-1 text-[10px] font-medium text-gray-400 dark:text-[#7A9BBF] hover:text-gray-600 dark:hover:text-[#C8D8EE] transition-colors mb-1"
                >
                  <span>{msg.diff.length} change{msg.diff.length !== 1 ? "s" : ""}</span>
                  <svg
                    width="10" height="10" viewBox="0 0 10 10" fill="none"
                    className={`transition-transform duration-200 ${expandedDiffs.has(msg.id) ? "rotate-180" : ""}`}
                  >
                    <path d="M2 6.5L5 3.5L8 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {expandedDiffs.has(msg.id) && (
                  <div className="flex flex-wrap gap-x-2 gap-y-1">
                    {msg.diff.map((entry, i) => (
                      <span
                        key={i}
                        className={`inline-flex items-center gap-0.5 text-[10px] font-medium
                          ${entry.type === "add"
                            ? "text-emerald-600 dark:text-emerald-500"
                            : entry.type === "remove"
                              ? "text-red-400 dark:text-red-400 line-through"
                              : "text-gray-400 dark:text-[#7A9BBF]"
                          }`}
                      >
                        {entry.type === "add" && (
                          <span className="text-emerald-400 dark:text-emerald-600 leading-none">✓</span>
                        )}
                        {entry.label}
                      </span>
                    ))}
                  </div>
                )}
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

        {/* Inline follow-up suggestions — below last AI message */}
        {!loading && (followUpQuestion || followUpSuggestions?.length) && (
          <div className="flex flex-col items-start gap-2.5 pt-1">
            {followUpQuestion && (
              <div className="flex items-start gap-2 max-w-[90%]">
                <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-violet-500 dark:text-violet-400 text-[9px] font-bold leading-none">?</span>
                <p className="text-sm font-medium text-gray-700 dark:text-[#C8D8EE] leading-snug">
                  {followUpQuestion}
                </p>
              </div>
            )}
            {followUpSuggestions && (
              <div className="flex flex-wrap gap-2">
                {followUpSuggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendText(s)}
                    className="px-3.5 py-2 text-xs font-semibold rounded-xl border-2 border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/40 hover:border-violet-400 dark:hover:border-violet-600 transition-all duration-150 hover:scale-[1.03] active:scale-[0.97] shadow-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div ref={bottomRef} />
        </>
        )}
      </div>

      {/* Bottom dock — suggestions + input share a 2-col grid so card width = input width */}
      <div className="shrink-0 px-4">
        <style>{`
          @keyframes suggest-in {
            0%   { opacity: 0; transform: translateY(10px) scale(0.98); }
            60%  { opacity: 1; transform: translateY(-2px) scale(1.005); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes tab-in {
            0%   { opacity: 0; transform: translateY(4px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes star-spin {
            0%   { transform: rotate(0deg) scale(1); }
            80%  { transform: rotate(340deg) scale(1.08); }
            100% { transform: rotate(360deg) scale(1); }
          }
          @keyframes logo-reflect {
            0%   { transform: translateX(-220%) skewX(-18deg); opacity: 0; }
            8%   { opacity: 1; }
            92%  { opacity: 1; }
            100% { transform: translateX(420%) skewX(-18deg); opacity: 0; }
          }
          @keyframes logo-breathe {
            0%, 100% { box-shadow: 0 0 0 0 rgba(139,92,246,0.15), 0 4px 24px rgba(139,92,246,0.08); }
            50%       { box-shadow: 0 0 0 8px rgba(139,92,246,0), 0 8px 32px rgba(139,92,246,0.18); }
          }
          @media (prefers-reduced-motion: no-preference) {
            .suggest-card { animation: suggest-in 0.32s cubic-bezier(0.22, 1, 0.36, 1) both; }
            .tab-content   { animation: tab-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both; }
            .star-icon { animation: star-spin 1.6s cubic-bezier(0.22, 1, 0.36, 1) 0.3s 1 both; }
            .logo-shimmer {
              background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.55) 50%, transparent 80%);
              animation: logo-reflect 2.8s ease-in-out 1.2s infinite;
            }
            .logo-pulse { animation: logo-breathe 3s ease-in-out infinite; }
          }
          .tabs-scroll::-webkit-scrollbar { display: none; }
        `}</style>
        <div className="flex flex-col">

          {/* Suggestions card — full width */}
          <div className="pt-2 pb-2">
          <div className="suggest-card bg-white dark:bg-[#111D30] rounded-2xl border border-gray-100 dark:border-[#1E3050] shadow-md dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)] overflow-visible">

            {/* Collapsed label-only mode */}
            {suggestionsCollapsed ? (
              <Tip label="Open suggestions">
                <button
                  onClick={() => setSuggestionsCollapsed(false)}
                  className="w-full px-3 py-2 flex items-center justify-between text-[11px] font-semibold text-gray-400 dark:text-[#7A9BBF] hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors rounded-2xl"
                >
                  <span>CustomGPT.ai suggestions</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18 15 12 9 6 15"/>
                  </svg>
                </button>
              </Tip>
            ) : (<>

            {/* Category tabs */}
            {(
              <div className="flex items-center border-b border-gray-100 dark:border-[#1E3050]">
                {/* Scrollable tabs — flex-1 min-w-0 overflow-hidden so it never pushes action buttons off-screen */}
                <div className="flex items-center gap-1 flex-1 min-w-0 overflow-hidden px-3 pt-2.5 pb-2">
                  {tabsCanScrollLeft && (
                    <button
                      onClick={scrollTabsLeft}
                      className="shrink-0 p-1 rounded-md text-gray-400 dark:text-[#7A9BBF] hover:text-gray-600 dark:hover:text-[#C8D8EE] hover:bg-gray-100 dark:hover:bg-[#1E3050] transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"/>
                      </svg>
                    </button>
                  )}
                  <div
                    ref={tabsScrollRef}
                    onScroll={checkTabsScroll}
                    className="tabs-scroll flex gap-1 flex-1 overflow-x-auto min-w-0"
                    style={{ scrollbarWidth: "none" }}
                  >
                    {TABS.map(({ id, label, activeClass }) => (
                      <button
                        key={id}
                        onClick={(e) => {
                          setActiveTab(id);
                          const btn = e.currentTarget as HTMLElement;
                          const container = tabsScrollRef.current;
                          if (!container) return;
                          const btnRight = btn.offsetLeft + btn.offsetWidth;
                          const visibleRight = container.scrollLeft + container.clientWidth - 32;
                          const visibleLeft = container.scrollLeft + 32;
                          if (btnRight > visibleRight) {
                            container.scrollBy({ left: btnRight - visibleRight + 8, behavior: "smooth" });
                          } else if (btn.offsetLeft < visibleLeft) {
                            container.scrollBy({ left: btn.offsetLeft - visibleLeft - 8, behavior: "smooth" });
                          }
                        }}
                        className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all duration-150 ${
                          activeTab === id
                            ? activeClass
                            : "text-gray-400 dark:text-[#7A9BBF] hover:text-gray-600 dark:hover:text-[#C8D8EE] hover:bg-gray-100 dark:hover:bg-[#1E3050]"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {tabsCanScrollRight && (
                    <button
                      onClick={scrollTabsRight}
                      className="shrink-0 p-1 rounded-md text-gray-400 dark:text-[#7A9BBF] hover:text-gray-600 dark:hover:text-[#C8D8EE] hover:bg-gray-100 dark:hover:bg-[#1E3050] transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </button>
                  )}
                </div>
                {/* Action buttons — shrink-0 sibling, always fully visible */}
                <div className="shrink-0 flex items-center gap-1 pr-2 pt-2.5 pb-2">
                  {/* Sort button */}
                  <div ref={sortMenuRef}>
                    <Tip label="Sort">
                      <button
                        onClick={(e) => {
                          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                          setSortMenuPos({ top: rect.top - 8, right: window.innerWidth - rect.right });
                          setSortMenuOpen((v) => !v);
                        }}
                        className={`p-1 rounded-md transition-colors ${sortMenuOpen ? "bg-gray-100 dark:bg-[#1E3050] text-gray-700 dark:text-[#C8D8EE]" : "text-gray-400 dark:text-[#7A9BBF] hover:text-gray-600 dark:hover:text-[#C8D8EE] hover:bg-gray-100 dark:hover:bg-[#1E3050]"}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="9" y2="18"/>
                        </svg>
                      </button>
                    </Tip>
                  </div>
                  <Tip label={chipsExpanded ? "Collapse" : "Expand"}>
                    <button
                      onClick={() => setChipsExpanded((v) => !v)}
                      className="p-1 rounded-md text-gray-400 dark:text-[#7A9BBF] hover:text-gray-600 dark:hover:text-[#C8D8EE] hover:bg-gray-100 dark:hover:bg-[#1E3050] transition-colors"
                    >
                      {chipsExpanded ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/>
                          <line x1="10" y1="14" x2="3" y2="21"/><line x1="21" y1="3" x2="14" y2="10"/>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
                          <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
                        </svg>
                      )}
                    </button>
                  </Tip>
                  <Tip label="Minimize">
                    <button
                      onClick={() => setSuggestionsCollapsed(true)}
                      className="p-1 rounded-md text-gray-400 dark:text-[#7A9BBF] hover:text-gray-600 dark:hover:text-[#C8D8EE] hover:bg-gray-100 dark:hover:bg-[#1E3050] transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </Tip>
                </div>
              </div>
            )}

            <div className="px-4 pt-3 pb-0 space-y-3 w-full overflow-x-hidden">
            {/* Content area — fixed height when collapsed, auto when expanded */}
            <div style={{ height: chipsExpanded ? "35vh" : "110px", overflow: "hidden", transition: "height 0.35s cubic-bezier(0.34, 1.2, 0.64, 1)" }}>
            <div key={activeTab} className="tab-content h-full">
            {activeTab === "actions" ? (
              <div className="flex items-start gap-3 py-1">
                <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-teal-500 dark:text-teal-400 shrink-0 text-sm">
                  ⚡
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-xs font-semibold text-gray-700 dark:text-[#C8D8EE]">Enhance your agent with actions.</p>
                    <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wide bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800/60">Available soon</span>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-[#7A9BBF] leading-relaxed">Add capabilities like document analysis, response verification, lead capture, webpage awareness, custom CTAs, and web search.</p>
                  <button className="mt-2 px-3 py-1.5 text-xs font-semibold rounded-xl bg-gray-800 dark:bg-[#C8D8EE] text-white dark:text-[#0B1426] hover:opacity-90 transition-opacity">
                    Open Actions
                  </button>
                </div>
              </div>
            ) : /* Chips */
            chipsExpanded && activeTab === "all" ? (
              /* Expanded "All" — grouped by archetype */
              <div className="overflow-y-auto max-h-[35vh] pr-3">
                {(["support","expert","ops","coaching","content","guardrails","behavior","tone","format"] as SuggestionCategory[]).map((cat) => {
                  const items = applySort(INITIAL_SUGGESTIONS.filter((s) => SUGGESTION_META[s]?.category === cat));
                  if (!items.length) return null;
                  const cfg = CATEGORY_CONFIG[cat];
                  return (
                    <div key={cat} className="group/cat">
                      <div className="sticky top-0 bg-white dark:bg-[#111D30] -mx-1 px-1 -mt-3 pt-3 z-10 cursor-default pb-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-transform duration-150 group-hover/cat:scale-125 ${cfg.dot}`} />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-[#7A9BBF] group-hover/cat:text-gray-600 dark:group-hover/cat:text-[#C8D8EE] transition-colors duration-150">{cfg.label}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 dark:text-[#7A9BBF] leading-relaxed pl-3">{cfg.desc}</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pb-3 pl-0.5">
                        {items.map((item) => {
                          const meta = SUGGESTION_META[item];
                          return (
                            <button key={item} onClick={() => sendText(item)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border transition-all duration-150 ${cfg.chip}`}>
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Collapsed or single-tab */
              <div
                className="flex flex-col"
                style={{ height: "100%" }}
              >
                {activeTab in CATEGORY_CONFIG && (
                  <p className="shrink-0 text-[10px] text-gray-400 dark:text-[#7A9BBF] leading-relaxed mb-2">{CATEGORY_CONFIG[activeTab as SuggestionCategory].desc}</p>
                )}
                <div
                  className={`tabs-scroll flex-1 flex flex-wrap items-start content-start gap-1.5 pl-0.5 overflow-x-hidden overflow-y-auto`}
                  style={{ scrollbarWidth: "none" }}
                >
                  {tabFilteredChips.map((item) => {
                    const meta = SUGGESTION_META[item];
                    const cfg = meta ? CATEGORY_CONFIG[meta.category] : null;
                    return (
                      <button key={item} onClick={() => sendText(item)}
                        className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border transition-all duration-150 ${
                          cfg ? cfg.chip : "bg-white dark:bg-[#111D30] border-gray-200 dark:border-[#1E3050] text-gray-600 dark:text-[#C8D8EE] hover:border-violet-400 hover:text-violet-700 dark:hover:border-violet-600 dark:hover:text-violet-300"
                        }`}>
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            </div>{/* end tab-content */}
            </div>{/* end content area */}


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
            </>)}
          </div>
          </div>
          {/* Input + Send — flex row */}
          <div className="py-3 flex items-center gap-2">
            <div className="relative flex-1 min-w-0 flex items-center">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !loading) {
                    e.preventDefault();
                    sendText(input);
                  }
                }}
                placeholder=""
                disabled={loading}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-[#1E3050] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 bg-white dark:bg-[#162238] text-gray-800 dark:text-[#C8D8EE] disabled:opacity-50 transition-all resize-none overflow-hidden leading-5"
                id="builder-input"
                style={{ maxHeight: "8rem" }}
                autoFocus
              />
              {!input && (
                <span
                  className="pointer-events-none absolute left-3.5 text-sm text-gray-400 dark:text-[#7A9BBF] transition-all duration-200 whitespace-nowrap overflow-hidden"
                  style={{
                    top: "50%",
                    opacity: phVisible ? 1 : 0,
                    transform: `translateY(${phVisible ? "-50%" : "calc(-50% + 6px)"})`,
                  }}
                >
                  {PLACEHOLDERS[phIndex]}
                </span>
              )}
            </div>
            <button
              onClick={() => sendText(input)}
              disabled={!input.trim() || loading}
              className="shrink-0 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors"
            >
              {loading ? "…" : "Send"}
            </button>
          </div>

        </div>{/* end flex col */}
      </div>{/* end bottom dock */}

      {/* Sort dropdown — fixed so it escapes overflow-hidden ancestors */}
      {sortMenuOpen && sortMenuPos && (
        <div
          ref={sortDropdownRef}
          style={{ position: "fixed", top: sortMenuPos.top, right: sortMenuPos.right, transform: "translateY(-100%)", zIndex: 200 }}
          className="bg-white dark:bg-[#111D30] border border-gray-200 dark:border-[#1E3050] rounded-xl shadow-lg py-1 min-w-[148px]"
        >
          {([
            { id: "popular",    label: "Most popular" },
            { id: "importance", label: "By importance" },
            { id: "alpha",      label: "Alphabetical" },
            { id: "type",       label: "By type" },
          ] as const).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => { setSortOrder(id); setSortMenuOpen(false); }}
              className={`w-full text-left px-3 py-1.5 text-xs font-medium transition-colors flex items-center gap-2
                ${sortOrder === id
                  ? "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20"
                  : "text-gray-600 dark:text-[#C8D8EE] hover:bg-gray-50 dark:hover:bg-[#1E3050]"
                }`}
            >
              {sortOrder === id ? <span className="text-[9px]">✓</span> : <span className="w-[9px]" />}
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Tip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="relative group/tip">
      {children}
      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-lg bg-gray-800 dark:bg-[#C8D8EE] text-white dark:text-[#0B1426] text-[10px] font-medium whitespace-nowrap opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150 delay-0 group-hover/tip:delay-500 z-[300]">
        {label}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-[3px] border-transparent border-t-gray-800 dark:border-t-[#C8D8EE]" />
      </div>
    </div>
  );
}
