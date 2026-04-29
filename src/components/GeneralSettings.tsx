"use client";

import { useRef } from "react";
import type { PersonaState } from "./types";
import { AGENT_ROLE_OPTIONS } from "./types";

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-gray-400 dark:text-[#7A9BBF]">
    <path d="M8 1l1.2 2.6 2.8.4-2 2 .5 2.8L8 7.5 5.5 8.8 6 6 4 4l2.8-.4L8 1z" fill="currentColor" opacity="0.5"/>
    <path d="M8 1l1.2 2.6 2.8.4-2 2 .5 2.8L8 7.5 5.5 8.8 6 6 4 4l2.8-.4L8 1z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-gray-400 dark:text-[#7A9BBF]">
    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M7 6v4M7 4.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

function RadioGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
          <div
            onClick={() => onChange(opt.value)}
            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer
              ${value === opt.value
                ? "border-violet-600 bg-white dark:bg-[#111D30]"
                : "border-gray-300 dark:border-[#2A4060] bg-white dark:bg-[#111D30]"
              }`}
          >
            {value === opt.value && (
              <div className="w-2 h-2 rounded-full bg-violet-600" />
            )}
          </div>
          <span
            onClick={() => onChange(opt.value)}
            className={`text-sm transition-colors cursor-pointer
              ${value === opt.value
                ? "text-gray-800 dark:text-[#C8D8EE] font-medium"
                : "text-gray-500 dark:text-[#7A9BBF] group-hover:text-gray-700 dark:group-hover:text-[#C8D8EE]"
              }`}
          >
            {opt.label}
          </span>
        </label>
      ))}
    </div>
  );
}

function ColorInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center flex-1 max-w-[220px] border border-gray-200 dark:border-[#1E3050] rounded-lg overflow-hidden bg-white dark:bg-[#162238]">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 text-sm bg-transparent outline-none text-gray-800 dark:text-[#C8D8EE] font-mono"
          placeholder="#000000"
        />
        <button
          onClick={() => inputRef.current?.click()}
          className="flex items-center justify-center w-9 h-9 shrink-0"
        >
          <span
            className="w-5 h-5 rounded-full border border-gray-200 dark:border-[#1E3050]"
            style={{ backgroundColor: value }}
          />
        </button>
      </div>
      <button
        onClick={() => inputRef.current?.click()}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1E3050] transition-colors text-gray-400 dark:text-[#7A9BBF]"
        aria-label="Pick color"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
        </svg>
      </button>
      <input
        ref={inputRef}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
      />
    </div>
  );
}

function Section({
  label,
  info,
  extra,
  children,
}: {
  label: string;
  info?: boolean;
  extra?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="py-5 border-b border-gray-100 dark:border-[#1E3050] last:border-b-0">
      <div className="flex items-center gap-2 mb-3">
        <SettingsIcon />
        <span className="text-sm font-semibold text-gray-700 dark:text-[#C8D8EE]">{label}</span>
        {info && <InfoIcon />}
        {extra && <div className="ml-auto">{extra}</div>}
      </div>
      {children}
    </div>
  );
}

export default function GeneralSettings({
  state,
  onChange,
  onSave,
}: {
  state: PersonaState;
  onChange: (patch: Partial<PersonaState>) => void;
  onSave: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange({ agentAvatarUrl: url });
  };

  return (
    <div className="px-6 py-2">
      {/* Identity group — Name, Role, Avatar */}
      <div className="py-5 border-b border-gray-100 dark:border-[#1E3050]">
        <div className="bg-white dark:bg-[#111D30] rounded-2xl border border-gray-200 dark:border-[#1E3050] divide-y divide-gray-100 dark:divide-[#1E3050] overflow-hidden">

          {/* Agent Name */}
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <SettingsIcon />
              <span className="text-sm font-semibold text-gray-700 dark:text-[#C8D8EE]">Agent Name</span>
            </div>
            <input
              type="text"
              value={state.agentName}
              onChange={(e) => onChange({ agentName: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-[#1E3050] bg-white dark:bg-[#162238] text-gray-800 dark:text-[#C8D8EE] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 transition-all"
            />
          </div>

          {/* Agent Role */}
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <SettingsIcon />
              <span className="text-sm font-semibold text-gray-700 dark:text-[#C8D8EE]">Agent Role</span>
              <InfoIcon />
              <a href="#" className="ml-auto text-xs text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1">
                Learn more
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3.5 8.5l5-5M5 3.5h3.5V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            </div>
            <div className="relative">
              <select
                value={state.agentRole}
                onChange={(e) => onChange({ agentRole: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-[#1E3050] bg-white dark:bg-[#162238] text-gray-800 dark:text-[#C8D8EE] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 appearance-none transition-all cursor-pointer"
              >
                <option value="">Select a role…</option>
                {AGENT_ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#7A9BBF] pointer-events-none" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Agent Avatar */}
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <SettingsIcon />
              <span className="text-sm font-semibold text-gray-700 dark:text-[#C8D8EE]">Agent Avatar</span>
              <InfoIcon />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border-2 border-gray-200 dark:border-[#1E3050] overflow-hidden bg-gray-100 dark:bg-[#162238] shrink-0 flex items-center justify-center">
                {state.agentAvatarUrl ? (
                  <img src={state.agentAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-300 dark:text-[#2A4060]">
                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 dark:text-[#7A9BBF] mb-2">Upload square image only. Allowed are JPG, GIF or PNG image up to 800 Kb.</p>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-[#1E3050] text-gray-600 dark:text-[#C8D8EE] hover:bg-gray-50 dark:hover:bg-[#1E3050] transition-colors flex items-center gap-1.5"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v7M3 4l3-3 3 3M1 9v1.5A.5.5 0 001.5 11h9a.5.5 0 00.5-.5V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Change Avatar
                </button>
                <input ref={fileRef} type="file" accept=".jpg,.jpeg,.gif,.png" className="sr-only" onChange={handleAvatarChange} />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Agent Color Scheme */}
      <Section label="Agent Color Scheme" info>
        <RadioGroup
          options={[
            { value: "adaptive", label: "Adaptive" },
            { value: "legacy", label: "Legacy" },
          ]}
          value={state.agentColorScheme}
          onChange={(v) => onChange({ agentColorScheme: v })}
        />
      </Section>

      {/* Agent Color */}
      <Section label="Agent Color">
        <p className="text-xs text-gray-400 dark:text-[#7A9BBF] mb-2">Primary color</p>
        <ColorInput value={state.agentColor} onChange={(v) => onChange({ agentColor: v })} />
      </Section>

      {/* Agent Style */}
      <Section label="Agent Style" info>
        <RadioGroup
          options={[
            { value: "sharp", label: "Sharp" },
            { value: "soft", label: "Soft" },
            { value: "round", label: "Round" },
          ]}
          value={state.agentStyle}
          onChange={(v) => onChange({ agentStyle: v })}
        />
      </Section>

      {/* Font Family */}
      <Section label="Font Family">
        <RadioGroup
          options={[
            { value: "inter", label: "Inter" },
            { value: "public-sans", label: "Public Sans" },
          ]}
          value={state.fontFamily}
          onChange={(v) => onChange({ fontFamily: v })}
        />
      </Section>

      {/* Background */}
      <Section label="Background">
        <div className="flex items-center gap-6 mb-3">
          {(["image", "color"] as const).map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => onChange({ backgroundType: type })}
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer
                  ${state.backgroundType === type
                    ? "border-violet-600 bg-white dark:bg-[#111D30]"
                    : "border-gray-300 dark:border-[#2A4060] bg-white dark:bg-[#111D30]"
                  }`}
              >
                {state.backgroundType === type && (
                  <div className="w-2 h-2 rounded-full bg-violet-600" />
                )}
              </div>
              <span
                onClick={() => onChange({ backgroundType: type })}
                className={`text-sm cursor-pointer capitalize transition-colors
                  ${state.backgroundType === type
                    ? "text-gray-800 dark:text-[#C8D8EE] font-medium"
                    : "text-gray-500 dark:text-[#7A9BBF]"
                  }`}
              >
                Background {type === "image" ? "Image" : "Color"}
              </span>
            </label>
          ))}
        </div>
        {state.backgroundType === "color" && (
          <ColorInput value={state.backgroundColor} onChange={(v) => onChange({ backgroundColor: v })} />
        )}
      </Section>

      {/* Save */}
      <div className="pt-4 pb-8">
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
