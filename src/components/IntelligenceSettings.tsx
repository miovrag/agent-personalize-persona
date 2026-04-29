"use client";

import { useState, useRef, useEffect } from "react";
import type { PersonaState } from "./types";

const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[#A3A3A3] dark:text-[#7A9BBF] shrink-0">
    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M7 6v4M7 4.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

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

      {/* Data Source Control */}
      <div className="bg-white dark:bg-[#111D30] rounded-2xl border border-[#E5E5E5] shadow-[0_4px_24px_rgba(23,23,23,0.06)] dark:border-[#1E3050] overflow-hidden p-5">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="text-sm font-semibold text-[#262626] dark:text-[#C8D8EE]">Data Source Control</h3>
          <InfoIcon />
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
          <InfoIcon />
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
