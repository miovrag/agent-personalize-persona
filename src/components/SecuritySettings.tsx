"use client";

import type { PersonaState } from "./types";

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[#A3A3A3] dark:text-[#7A9BBF]">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[#A3A3A3] dark:text-[#7A9BBF] shrink-0">
    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M7 6v4M7 4.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

function RadioGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; sub?: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-start gap-2.5 cursor-pointer group">
          <div
            onClick={() => onChange(opt.value)}
            className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors cursor-pointer
              ${value === opt.value
                ? "border-violet-600 bg-white dark:bg-[#111D30]"
                : "border-gray-300 dark:border-[#2A4060] bg-white dark:bg-[#111D30]"
              }`}
          >
            {value === opt.value && <div className="w-2 h-2 rounded-full bg-violet-600" />}
          </div>
          <div onClick={() => onChange(opt.value)} className="cursor-pointer">
            <span className={`text-sm transition-colors
              ${value === opt.value
                ? "text-[#262626] dark:text-[#C8D8EE] font-medium"
                : "text-[#737373] dark:text-[#7A9BBF] group-hover:text-[#404040] dark:group-hover:text-[#C8D8EE]"
              }`}
            >
              {opt.label}
            </span>
            {opt.sub && (
              <p className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF] mt-0.5">{opt.sub}</p>
            )}
          </div>
        </label>
      ))}
    </div>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-[#111D30] rounded-2xl border border-[#E5E5E5] shadow-[0_4px_24px_rgba(23,23,23,0.06)] dark:border-[#1E3050] overflow-hidden px-5 py-5">
      {children}
    </div>
  );
}

function SectionHeader({ label, info }: { label: string; info?: boolean }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <SettingsIcon />
      <span className="text-sm font-semibold text-[#404040] dark:text-[#C8D8EE]">{label}</span>
      {info && <InfoIcon />}
    </div>
  );
}

export default function SecuritySettings({
  state,
  onChange,
  onSave,
}: {
  state: PersonaState;
  onChange: (patch: Partial<PersonaState>) => void;
  onSave: () => void;
}) {
  return (
    <div className="px-6 py-6 flex flex-col gap-6">

      {/* Anti-Hallucination */}
      <SectionCard>
        <SectionHeader label="Anti-Hallucination" />
        <RadioGroup
          options={[
            { value: "enabled", label: "Enabled" },
            { value: "disabled", label: "Disabled (not recommended)" },
          ]}
          value={state.antiHallucination}
          onChange={(v) => onChange({ antiHallucination: v })}
        />
      </SectionCard>

      {/* Agent Visibility */}
      <SectionCard>
        <SectionHeader label="Agent Visibility" info />
        <RadioGroup
          options={[
            { value: "private", label: "Private" },
            { value: "public", label: "Public" },
          ]}
          value={state.agentVisibility}
          onChange={(v) => onChange({ agentVisibility: v })}
        />
      </SectionCard>

      {/* Data Protection */}
      <SectionCard>
        <SectionHeader label="Data Protection" />
        <p className="text-sm text-[#737373] dark:text-[#7A9BBF] leading-relaxed mb-3">
          CustomGPT.ai is SOC 2 Type II certified and fully GDPR compliant.<br />
          Your data and your users&apos; data are safe with us.
        </p>
        <p className="text-sm text-[#737373] dark:text-[#7A9BBF]">
          More details available at our{" "}
          <a href="#" className="text-violet-600 dark:text-violet-400 hover:underline font-medium">Trust Center.</a>
        </p>
      </SectionCard>

      {/* Recaptcha */}
      <SectionCard>
        <SectionHeader label="Recaptcha" info />
        <RadioGroup
          options={[
            { value: "enabled", label: "Enabled" },
            { value: "disabled", label: "Disabled" },
          ]}
          value={state.recaptcha}
          onChange={(v) => onChange({ recaptcha: v })}
        />
      </SectionCard>

      {/* Whitelisted Domains */}
      <SectionCard>
        <SectionHeader label="Whitelisted Domains" info />
        <textarea
          value={state.whitelistedDomains}
          onChange={(e) => onChange({ whitelistedDomains: e.target.value })}
          rows={5}
          placeholder="e.g. example.com&#10;app.example.com"
          className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E5E5E5] dark:border-[#1E3050] bg-white dark:bg-[#162238] text-[#262626] dark:text-[#C8D8EE] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 placeholder:text-[#A3A3A3] dark:placeholder:text-[#7A9BBF] resize-none transition-all font-mono"
          spellCheck={false}
        />
      </SectionCard>

      {/* Conversation Retention Period */}
      <SectionCard>
        <SectionHeader label="Conversation Retention Period" info />
        <div className="flex flex-col gap-2.5">
          {/* Custom */}
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <div
              onClick={() => onChange({ retentionPeriod: "custom" })}
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors cursor-pointer
                ${state.retentionPeriod === "custom"
                  ? "border-violet-600 bg-white dark:bg-[#111D30]"
                  : "border-gray-300 dark:border-[#2A4060] bg-white dark:bg-[#111D30]"
                }`}
            >
              {state.retentionPeriod === "custom" && <div className="w-2 h-2 rounded-full bg-violet-600" />}
            </div>
            <div className="flex items-center gap-2 flex-wrap" onClick={() => onChange({ retentionPeriod: "custom" })}>
              <span className={`text-sm cursor-pointer transition-colors
                ${state.retentionPeriod === "custom" ? "text-[#262626] dark:text-[#C8D8EE] font-medium" : "text-[#737373] dark:text-[#7A9BBF]"}`}>
                Custom (in days)
              </span>
              {state.retentionPeriod === "custom" && (
                <input
                  type="number"
                  min={1}
                  value={state.retentionDays}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => onChange({ retentionDays: Math.max(1, Number(e.target.value)) })}
                  className="w-20 px-2 py-1 text-sm rounded-lg border border-[#E5E5E5] dark:border-[#1E3050] bg-white dark:bg-[#162238] text-[#262626] dark:text-[#C8D8EE] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 transition-all"
                />
              )}
            </div>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer group">
            <div
              onClick={() => onChange({ retentionPeriod: "12-months" })}
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors cursor-pointer
                ${state.retentionPeriod === "12-months"
                  ? "border-violet-600 bg-white dark:bg-[#111D30]"
                  : "border-gray-300 dark:border-[#2A4060] bg-white dark:bg-[#111D30]"
                }`}
            >
              {state.retentionPeriod === "12-months" && <div className="w-2 h-2 rounded-full bg-violet-600" />}
            </div>
            <span
              onClick={() => onChange({ retentionPeriod: "12-months" })}
              className={`text-sm cursor-pointer transition-colors
                ${state.retentionPeriod === "12-months" ? "text-[#262626] dark:text-[#C8D8EE] font-medium" : "text-[#737373] dark:text-[#7A9BBF] group-hover:text-[#404040] dark:group-hover:text-[#C8D8EE]"}`}
            >
              12 months
            </span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer group">
            <div
              onClick={() => onChange({ retentionPeriod: "never" })}
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors cursor-pointer
                ${state.retentionPeriod === "never"
                  ? "border-violet-600 bg-white dark:bg-[#111D30]"
                  : "border-gray-300 dark:border-[#2A4060] bg-white dark:bg-[#111D30]"
                }`}
            >
              {state.retentionPeriod === "never" && <div className="w-2 h-2 rounded-full bg-violet-600" />}
            </div>
            <span
              onClick={() => onChange({ retentionPeriod: "never" })}
              className={`text-sm cursor-pointer transition-colors
                ${state.retentionPeriod === "never" ? "text-[#262626] dark:text-[#C8D8EE] font-medium" : "text-[#737373] dark:text-[#7A9BBF] group-hover:text-[#404040] dark:group-hover:text-[#C8D8EE]"}`}
            >
              Never
            </span>
          </label>
        </div>
      </SectionCard>

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
