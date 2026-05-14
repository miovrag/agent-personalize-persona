"use client";

import { useState, useRef, useEffect } from "react";
import type { PersonaState } from "./types";

const InfoIcon = ({ tooltip }: { tooltip?: string } = {}) => {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative inline-flex shrink-0"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[#A3A3A3] dark:text-[#7A9BBF] cursor-default">
        <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M7 6v4M7 4.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
      {tooltip && (
        <div className="absolute bottom-full left-1/2 mb-2 z-50 pointer-events-none" style={{ transform: "translateX(-50%)" }}>
          <div
            className="bg-[#171717] text-white text-[11px] leading-snug rounded-[6px] px-2.5 py-1.5 whitespace-nowrap shadow-lg transition-[opacity,transform] duration-[120ms]"
            style={{ opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(4px)" }}
          >
            {tooltip}
          </div>
        </div>
      )}
    </div>
  );
};

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex w-9 h-5 rounded-full transition-colors shrink-0 ${checked ? "bg-violet-600" : "bg-gray-300 dark:bg-[#2A4060]"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0"}`} />
    </button>
  );
}

// ─── Context Depth ────────────────────────────────────────────────────────────

const PLAN_ORDER = { standard: 0, premium: 1, enterprise: 2 } as const;
type PlanTier = keyof typeof PLAN_ORDER;

const contextTiers: {
  id: string; label: string; desc: string; planRequired: PlanTier; multiplier: number | null; emoji: string; recommended?: boolean;
}[] = [
  { id: "compact",  label: "Compact",  planRequired: "standard",   multiplier: 1,    emoji: "⚡", desc: "Best for high-volume, simple Q&A. Fast and efficient." },
  { id: "balanced", label: "Balanced", planRequired: "standard",   multiplier: 1,    emoji: "⚖️", desc: "Good for most business use cases. Balanced performance and cost.", recommended: true },
  { id: "extended", label: "Extended", planRequired: "premium",    multiplier: 2,    emoji: "📚", desc: "Larger knowledge retrieval and longer conversation memory." },
  { id: "rich",     label: "Rich",     planRequired: "premium",    multiplier: 3,    emoji: "🔍", desc: "Deep retrieval for complex, document-heavy agents." },
  { id: "max",      label: "Max",      planRequired: "enterprise", multiplier: 4,    emoji: "🧠", desc: "Maximum context for research, compliance, and multi-document workflows." },
  { id: "custom",   label: "Custom",   planRequired: "enterprise", multiplier: null, emoji: "⚙️", desc: "Controlled by your plan settings. Contact your account manager to adjust." },
];

type ContextUpsellTier = typeof contextTiers[0];

function ContextDepthSection({
  state,
  onChange,
}: {
  state: PersonaState;
  onChange: (patch: Partial<PersonaState>) => void;
}) {
  const currentPlan: PlanTier = "premium";
  const step = 100 / (contextTiers.length - 1);

  const tierIndex = Math.max(0, contextTiers.findIndex((t) => t.id === state.contextDepth));
  const [sliderVal, setSliderVal] = useState(tierIndex >= 0 ? tierIndex * step : step);
  const [upsellTier, setUpsellTier] = useState<ContextUpsellTier | null>(null);
  const [upsellClosing, setUpsellClosing] = useState(false);
  const upsellShownRef = useRef(false);

  const maxUnlockedIndex = contextTiers.reduce(
    (max, tier, i) => (PLAN_ORDER[tier.planRequired] <= PLAN_ORDER[currentPlan] ? i : max),
    0
  );
  const maxAllowedVal = maxUnlockedIndex * step;
  const firstLockedTier = contextTiers[maxUnlockedIndex + 1] ?? null;
  const safeIndex = Math.min(Math.round(sliderVal / step), contextTiers.length - 1);
  const activeTier = contextTiers[safeIndex];

  const closeUpsell = () => {
    setUpsellClosing(true);
    setTimeout(() => { setUpsellTier(null); setUpsellClosing(false); }, 260);
  };

  const handleChange = (raw: number) => {
    if (raw > maxAllowedVal && firstLockedTier && !upsellShownRef.current) {
      upsellShownRef.current = true;
      setUpsellTier(firstLockedTier);
    }
    const v = Math.min(raw, maxAllowedVal);
    setSliderVal(v);
    const idx = Math.min(Math.round(v / step), maxUnlockedIndex);
    onChange({ contextDepth: contextTiers[idx].id });
  };

  return (
    <>
      {/* Upsell modal */}
      {upsellTier && (
        <div
          className={`ds-modal-overlay ${upsellClosing ? "is-closing" : "is-open"}`}
          onClick={closeUpsell}
        >
          <div className="ds-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="ds-modal-media">
              <svg className="ds-modal-media-icon" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 12 12 17 22 12" />
                <polyline points="2 17 12 22 22 17" />
              </svg>
              <button className="ds-modal-close" onClick={closeUpsell} aria-label="Close">
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="ds-modal-body">
              <span className="ds-badge-plan">
                <i className="ti ti-lock-open" style={{ fontSize: 13 }} />
                {upsellTier.planRequired === "premium" ? "Premium" : "Enterprise"}
              </span>
              <h2 className="ds-modal-heading">Go deeper with context</h2>
              <p className="ds-modal-desc">
                Retrieve more knowledge, remember longer conversations, and handle complex multi-document workflows — available on{" "}
                {upsellTier.planRequired === "premium" ? "Premium" : "Enterprise"}.
              </p>
              <ul className="ds-modal-features">
                {upsellTier.planRequired === "premium" ? (
                  <>
                    <li><i className="ti ti-circle-check" /> Extended knowledge retrieval window</li>
                    <li><i className="ti ti-circle-check" /> Longer conversation memory</li>
                    <li><i className="ti ti-circle-check" /> Better handling of complex documents</li>
                  </>
                ) : (
                  <>
                    <li><i className="ti ti-circle-check" /> Maximum context for compliance workflows</li>
                    <li><i className="ti ti-circle-check" /> Multi-document reasoning at scale</li>
                    <li><i className="ti ti-circle-check" /> Custom depth controlled by your account</li>
                  </>
                )}
              </ul>
              <div className="ds-modal-actions">
                <button className="ds-btn-upgrade">
                  <i className="ti ti-sparkles" />
                  Upgrade to {upsellTier.planRequired === "premium" ? "Premium" : "Enterprise"}
                </button>
                <button className="ds-btn-notnow" onClick={closeUpsell}>Not now</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-[#111D30] rounded-2xl border border-[#E5E5E5] shadow-[0_4px_24px_rgba(23,23,23,0.06)] dark:border-[#1E3050] p-5">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-sm font-semibold text-[#262626] dark:text-[#C8D8EE]">Context Depth</h3>
          <InfoIcon tooltip="Adjusts knowledge retrieval depth and conversation memory" />
        </div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-[#737373] dark:text-[#7A9BBF]">Enable context depth control</span>
          <Toggle checked={state.contextDepthEnabled} onChange={(v) => onChange({ contextDepthEnabled: v })} />
        </div>

        {state.contextDepthEnabled && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#404040] dark:text-[#C8D8EE]">How deep should it search?</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F5F5F5] dark:bg-[#162238] text-violet-600">
                {activeTier.label}{activeTier.multiplier && activeTier.multiplier > 1 ? ` · ${activeTier.multiplier}×` : ""}
              </span>
            </div>

            <div>
              <div className="relative h-5 flex items-center">
                <div
                  className="absolute inset-x-[10px] h-[6px] rounded-full overflow-hidden pointer-events-none"
                  style={{ top: "50%", transform: "translateY(-50%)" }}
                >
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #a5b4fc, #7367f0, #6840c6)" }} />
                  <div
                    className="absolute top-0 h-full bg-gray-200 dark:bg-[#2A4060]"
                    style={{ left: `${sliderVal}%`, width: `${Math.max(0, maxAllowedVal - sliderVal)}%` }}
                  />
                  {maxAllowedVal < 100 && (
                    <div
                      className="absolute top-0 h-full"
                      style={{
                        left: `${maxAllowedVal}%`,
                        right: 0,
                        background: "repeating-linear-gradient(90deg,#e2e8f0 0px,#e2e8f0 4px,#f1f5f9 4px,#f1f5f9 8px)",
                      }}
                    />
                  )}
                </div>
                <input
                  type="range" min={0} max={100} step={1} value={sliderVal}
                  onMouseDown={() => { upsellShownRef.current = false; }}
                  onTouchStart={() => { upsellShownRef.current = false; }}
                  onChange={(e) => handleChange(Number(e.target.value))}
                  className="context-depth-slider"
                  aria-label="Context depth"
                />
              </div>
              <div className="flex justify-between px-[9px] mt-1">
                {contextTiers.map((tier, i) => {
                  const locked = PLAN_ORDER[tier.planRequired] > PLAN_ORDER[currentPlan];
                  const active = sliderVal >= i * step - 1;
                  return (
                    <div
                      key={tier.id}
                      className={`rounded-full w-[2px] h-[6px] transition-colors ${
                        active && !locked ? "bg-violet-500" : "bg-gray-300 dark:bg-[#2A4060]"
                      }`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-[#A3A3A3] dark:text-[#7A9BBF] font-medium px-0.5 mt-1">
                <span>Compact & fast</span>
                <span>Max depth</span>
              </div>
            </div>

            <div className="bg-[#FAFAFA] dark:bg-[#162238] rounded-xl px-3.5 py-2.5 flex items-start gap-2.5">
              <span className="text-base mt-0.5 select-none">{activeTier.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                  <p className="text-xs font-medium text-[#525252] dark:text-[#C8D8EE] m-0">
                    {activeTier.label} context depth
                    {activeTier.multiplier && activeTier.multiplier > 1 ? ` · ${activeTier.multiplier}× credits` : ""}
                  </p>
                  {activeTier.recommended && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#737373] dark:text-[#7A9BBF] leading-relaxed m-0">{activeTier.desc}</p>
              </div>
            </div>

            {maxAllowedVal < 100 && (
              <button
                onClick={() => { if (firstLockedTier) setUpsellTier(firstLockedTier); }}
                className="flex items-center gap-2 px-1 text-left group"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-[#A3A3A3] shrink-0 group-hover:text-violet-500 transition-colors">
                  <rect x="1.5" y="5" width="9" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M4 5V3.5a2 2 0 0 1 4 0V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                <span className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF] group-hover:text-violet-600 transition-colors">
                  Max & Custom tiers require an <span className="text-violet-600 font-medium">Enterprise</span> plan
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const AI_MODELS = [
  {
    id: "claude-haiku-4-5",
    name: "Claude 4.5 Haiku",
    badge: null,
    bestFor: "Fast, lightweight responses",
    latency: "low",
    queryCost: null,
  },
  {
    id: "claude-sonnet-4-6",
    name: "Claude 4.6 Sonnet",
    badge: null,
    bestFor: "Balanced performance for most tasks",
    latency: "medium",
    queryCost: null,
  },
  {
    id: "claude-sonnet-4-6-reasoning",
    name: "Claude 4.6 Sonnet Reasoning",
    badge: "Consumes 2 queries per message",
    bestFor: "When multi-step thinking is required",
    latency: "high",
    queryCost: true,
  },
  {
    id: "claude-opus-4-7",
    name: "Claude 4.7 Opus",
    badge: "Consumes 3 queries per message",
    bestFor: "Most capable model for complex tasks",
    latency: "high",
    queryCost: true,
  },
];

const PRIMARY_GOALS = [
  {
    id: "speed" as const,
    label: "Speed",
    description: "Lightning-fast, sub-second responses",
    tags: [{ label: "↑ Speed", up: true }, { label: "↓ Accuracy", up: false }],
    recommended: false,
  },
  {
    id: "optimal" as const,
    label: "Optimal",
    description: "Best for most business use cases",
    tags: [{ label: "Balanced speed and accuracy", up: null }],
    recommended: true,
  },
  {
    id: "accuracy" as const,
    label: "Accuracy",
    description: "Most relevant responses, recommended for large agents",
    tags: [{ label: "↑ Accuracy", up: true }, { label: "↓ Speed", up: false }],
    recommended: false,
  },
  {
    id: "understanding" as const,
    label: "Understanding",
    description: "Break down user queries for deeper understanding",
    tags: [{ label: "↑ Accuracy", up: true }, { label: "↓ Speed", up: false }],
    recommended: false,
  },
];

function configSummary(state: PersonaState): string[] {
  const lines: string[] = [];
  const goalLabels: Record<string, string> = {
    speed: "Fastest possible responses",
    optimal: "Balanced speed and accuracy",
    accuracy: "Highest relevance responses",
    understanding: "Deepest query understanding",
  };
  lines.push(goalLabels[state.primaryGoal] ?? "Optimized responses");
  const model = AI_MODELS.find((m) => m.id === state.aiModel);
  if (model) lines.push(`${model.name}`);
  if (state.dataSource === "my-data") lines.push("Controlled hallucination risk");
  if (state.primaryGoal === "accuracy" || state.primaryGoal === "understanding") lines.push("Highest intelligence");
  if (state.dataSource === "my-data") lines.push("Enterprise-ready deployment");
  return lines;
}

function LatencyBadge({ latency }: { latency: string }) {
  const color = latency === "low" ? "text-emerald-500" : latency === "medium" ? "text-amber-500" : "text-red-400";
  const dot = latency === "low" ? "bg-emerald-500" : latency === "medium" ? "bg-amber-500" : "bg-red-400";
  const label = latency === "low" ? "Low latency" : latency === "medium" ? "Medium latency" : "High latency";
  return (
    <span className={`flex items-center gap-1 text-xs font-medium shrink-0 ${color}`}>
      <span className={`w-1.5 h-1.5 rounded-full inline-block ${dot}`} />
      {label}
    </span>
  );
}

function ModelRow({ model, selected }: { model: typeof AI_MODELS[0]; selected: boolean }) {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 text-violet-500">
          <path d="M7 1L8.5 5H13L9.5 7.5L11 12L7 9.5L3 12L4.5 7.5L1 5H5.5L7 1Z" fill="currentColor" opacity="0.8"/>
        </svg>
        <span className={`text-sm font-semibold ${selected ? "text-violet-700 dark:text-violet-300" : "text-[#404040] dark:text-[#C8D8EE]"}`}>
          {model.name}
        </span>
        {model.badge && (
          <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium">
            ◇ {model.badge}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3 mt-0.5 pl-5">
        <span className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF]">Best for: {model.bestFor}</span>
        <LatencyBadge latency={model.latency} />
      </div>
    </div>
  );
}

function AIModelDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = AI_MODELS.find((m) => m.id === value) ?? AI_MODELS[2];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="bg-white dark:bg-[#111D30] rounded-2xl border border-[#E5E5E5] shadow-[0_4px_24px_rgba(23,23,23,0.06)] dark:border-[#1E3050] overflow-hidden p-5">
      <h3 className="text-sm font-semibold text-[#262626] dark:text-[#C8D8EE] mb-0.5">AI Model</h3>
      <p className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF] mb-3">Choose model that works best for your agent</p>

      <div ref={ref} className="relative mb-3">
        {/* Trigger — shows selected model */}
        <button
          onClick={() => setOpen((o) => !o)}
          className={`w-full text-left flex items-center gap-2 px-4 py-3 rounded-xl border transition-all
            ${open
              ? "border-violet-400 ring-2 ring-violet-100 dark:ring-violet-900 rounded-b-none"
              : "border-[#E5E5E5] dark:border-[#1E3050] hover:border-violet-300 dark:hover:border-violet-700"
            } bg-white dark:bg-[#162238]`}
        >
          <ModelRow model={selected} selected={false} />
          <svg
            width="16" height="16" viewBox="0 0 16 16" fill="none"
            className={`shrink-0 text-[#A3A3A3] dark:text-[#7A9BBF] transition-transform ${open ? "rotate-180" : ""}`}
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Options list */}
        {open && (
          <div className="absolute left-0 right-0 top-full z-20 border border-t-0 border-violet-400 rounded-b-xl overflow-hidden shadow-lg bg-white dark:bg-[#162238] divide-y divide-[#E5E5E5] dark:divide-[#1E3050]">
            {AI_MODELS.map((model) => {
              const isSelected = model.id === value;
              return (
                <button
                  key={model.id}
                  onClick={() => { onChange(model.id); setOpen(false); }}
                  className={`w-full text-left flex items-center gap-2 px-4 py-3 transition-colors
                    ${isSelected
                      ? "bg-violet-50 dark:bg-violet-900/20"
                      : "hover:bg-[#FAFAFA] dark:hover:bg-[#1E3050]"
                    }`}
                >
                  <ModelRow model={model} selected={isSelected} />
                  {isSelected && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                      <circle cx="8" cy="8" r="7" fill="#7367F0" opacity="0.15"/>
                      <path d="M5 8l2.5 2.5L11 5" stroke="#7367F0" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selected.queryCost && (
        <div className="flex items-start gap-2 p-3 bg-violet-50 dark:bg-violet-900/20 rounded-xl border border-violet-100 dark:border-violet-900/40">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-0.5 text-violet-500">
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M7 6v4M7 4.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <p className="text-xs text-violet-700 dark:text-violet-300">
            This model increases query consumption.{" "}
            <a href="#" className="underline hover:no-underline">You can monitor usage here.</a>
          </p>
        </div>
      )}
    </div>
  );
}

export default function IntelligenceSettings({
  state,
  onChange,
  onSave,
}: {
  state: PersonaState;
  onChange: (patch: Partial<PersonaState>) => void;
  onSave: () => void;
}) {
  const selectedModel = AI_MODELS.find((m) => m.id === state.aiModel) ?? AI_MODELS[2];
  const summary = configSummary(state);

  return (
    <div className="px-6 py-6 flex flex-col gap-6">

      {/* NextGen BETA */}
      <div className="bg-white dark:bg-[#111D30] rounded-2xl border border-[#E5E5E5] shadow-[0_4px_24px_rgba(23,23,23,0.06)] dark:border-[#1E3050] overflow-hidden p-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L11 7H16L12 10.5L13.5 16L9 13L4.5 16L6 10.5L2 7H7L9 2Z" fill="#f59e0b" stroke="#d97706" strokeWidth="0.8" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-sm font-semibold text-[#262626] dark:text-[#C8D8EE]">NextGen (BETA)</span>
              <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium">BETA</span>
            </div>
            <p className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF]">Agentic orchestration with multi-step planning</p>
          </div>
          <Toggle checked={state.nextGenEnabled} onChange={(v) => onChange({ nextGenEnabled: v })} />
        </div>

        {state.nextGenEnabled && (
          <div className="mt-4 space-y-3">
            <p className="text-xs text-[#737373] dark:text-[#7A9BBF] leading-relaxed">
              Enable multi-step agentic reasoning. All Actions and MCPs work together under a single planner to complete complex tasks. Disabling NextGen returns the agent to simple query-response mode.
            </p>
            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/40">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 mt-0.5 text-blue-500">
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M7 6v4M7 4.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                Enabling NextGen unlocks advanced operations like creating files or writing code to interact with the outside world. This is a top-level setting and affects all deployments of this agent.
              </p>
            </div>
          </div>
        )}

        {!state.nextGenEnabled && (
          <p className="mt-3 text-xs text-[#A3A3A3] dark:text-[#7A9BBF] leading-relaxed">
            Enable multi-step agentic reasoning. All Actions and MCPs work together under a single planner to complete complex tasks. Disabling NextGen returns the agent to simple query-response mode.
          </p>
        )}
      </div>

      {/* Primary Goal */}
      <div className="bg-white dark:bg-[#111D30] rounded-2xl border border-[#E5E5E5] shadow-[0_4px_24px_rgba(23,23,23,0.06)] dark:border-[#1E3050] overflow-hidden p-5">
        <h3 className="text-sm font-semibold text-[#262626] dark:text-[#C8D8EE] mb-0.5">What is your primary goal?</h3>
        <p className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF] mb-4">Choose the outcome you want to optimize for</p>
        <div className="grid grid-cols-2 gap-3">
          {PRIMARY_GOALS.map((goal) => {
            const selected = state.primaryGoal === goal.id;
            return (
              <button
                key={goal.id}
                onClick={() => onChange({ primaryGoal: goal.id })}
                className={`relative text-left p-4 rounded-xl border-2 transition-all
                  ${selected
                    ? "border-violet-600 bg-violet-50 dark:bg-violet-900/20"
                    : "border-[#E5E5E5] dark:border-[#1E3050] hover:border-violet-300 dark:hover:border-violet-700 bg-white dark:bg-[#162238]"
                  }`}
              >
                {selected && (
                  <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-violet-600 flex items-center justify-center">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4l2 2 3-3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-semibold ${selected ? "text-violet-700 dark:text-violet-300" : "text-[#404040] dark:text-[#C8D8EE]"}`}>
                    {goal.label}
                  </span>
                  {goal.recommended && (
                    <span className="text-xs bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300 px-1.5 py-0.5 rounded-full font-medium">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF] mb-2 leading-relaxed">{goal.description}</p>
                <div className="flex flex-wrap gap-1">
                  {goal.tags.map((tag) => (
                    <span
                      key={tag.label}
                      className={`text-xs px-2 py-0.5 rounded-full font-medium
                        ${tag.up === true ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" :
                          tag.up === false ? "bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400" :
                          "bg-[#F5F5F5] dark:bg-[#1E3050] text-[#737373] dark:text-[#7A9BBF]"}`}
                    >
                      {tag.label}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Model */}
      <AIModelDropdown
        value={state.aiModel}
        onChange={(v) => onChange({ aiModel: v })}
      />

      {/* Context Depth */}
      <ContextDepthSection state={state} onChange={onChange} />

      {/* Data Source Control */}
      <div className="bg-white dark:bg-[#111D30] rounded-2xl border border-[#E5E5E5] shadow-[0_4px_24px_rgba(23,23,23,0.06)] dark:border-[#1E3050] overflow-hidden p-5">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="text-sm font-semibold text-[#262626] dark:text-[#C8D8EE]">Data Source Control</h3>
          <InfoIcon tooltip="Restrict answers to your documents or allow broader LLM knowledge" />
        </div>
        <p className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF] mb-4">Choose which sources your agent can use to build responses</p>
        <div className="space-y-3 mb-4">
          {(["my-data", "my-data-plus-llm"] as const).map((opt) => {
            const selected = state.dataSource === opt;
            return (
              <label key={opt} className="flex items-start gap-3 cursor-pointer group">
                <div
                  onClick={() => onChange({ dataSource: opt })}
                  className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 cursor-pointer transition-colors
                    ${selected ? "border-violet-600 bg-white dark:bg-[#111D30]" : "border-gray-300 dark:border-[#2A4060] bg-white dark:bg-[#111D30]"}`}
                >
                  {selected && <div className="w-2 h-2 rounded-full bg-violet-600" />}
                </div>
                <div onClick={() => onChange({ dataSource: opt })} className="cursor-pointer">
                  <p className={`text-sm font-medium ${selected ? "text-[#262626] dark:text-[#C8D8EE]" : "text-[#525252] dark:text-[#7A9BBF]"}`}>
                    {opt === "my-data" ? "My Data Only" : "My Data + General LLM Knowledge"}
                  </p>
                  <p className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF] mt-0.5">
                    {opt === "my-data"
                      ? "Answers are strictly grounded in your uploaded documents"
                      : "Allows broader context but may reduce strict grounding"}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
        {state.dataSource === "my-data" && (
          <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-100 dark:border-teal-900/40 space-y-1.5">
            <p className="text-xs text-teal-700 dark:text-teal-300 flex items-center gap-1.5">
              <span>↓</span> Controlled hallucination risk
            </p>
            <p className="text-xs text-teal-700 dark:text-teal-300 flex items-center gap-1.5">
              <span>○</span> Enterprise-safe configuration
            </p>
            <p className="text-xs text-teal-700 dark:text-teal-300 flex items-center gap-1.5">
              <span>✓</span> Recommended for compliance-heavy environments
            </p>
          </div>
        )}
      </div>

      {/* User Awareness */}
      <div className="bg-white dark:bg-[#111D30] rounded-2xl border border-[#E5E5E5] shadow-[0_4px_24px_rgba(23,23,23,0.06)] dark:border-[#1E3050] overflow-hidden p-5">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="text-sm font-semibold text-[#262626] dark:text-[#C8D8EE]">User Awareness</h3>
          <InfoIcon tooltip="Agent personalizes responses based on the logged-in user's identity" />
        </div>
        <p className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF] mb-4">If enabled, the agent will be aware of the logged-in user&apos;s identity</p>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-[#404040] dark:text-[#C8D8EE]">Personalize responses based on logged-in user identity</span>
          <Toggle checked={state.userAwareness} onChange={(v) => onChange({ userAwareness: v })} />
        </div>
      </div>

      {/* Configuration Summary */}
      <div className="bg-teal-50 dark:bg-teal-900/20 rounded-2xl border border-teal-200 dark:border-teal-800/40 p-5">
        <h3 className="text-sm font-semibold text-teal-800 dark:text-teal-300 mb-1">Configuration Summary</h3>
        <p className="text-xs text-teal-600 dark:text-teal-400 mb-3">Your agent is optimized for:</p>
        <div className="space-y-1.5">
          {summary.map((line) => (
            <p key={line} className="text-xs text-teal-700 dark:text-teal-300 flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                <circle cx="7" cy="7" r="6" fill="#0d9488" opacity="0.2"/>
                <path d="M4 7l2 2 4-4" stroke="#0d9488" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="pb-2">
        <button
          onClick={onSave}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 transition-colors"
        >
          Save Settings
        </button>
      </div>

    </div>
  );
}
