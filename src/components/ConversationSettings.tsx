"use client";

import { useState } from "react";
import type { PersonaState } from "./types";

const LANGUAGES = [
  "English",
  "Serbian - Serbia (Српски)",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Dutch",
  "Polish",
  "Russian",
  "Chinese (Simplified)",
  "Japanese",
  "Korean",
  "Arabic",
];

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-gray-400 dark:text-[#7A9BBF]">
    <path d="M8 1l1.2 2.6 2.8.4-2 2 .5 2.8L8 7.5 5.5 8.8 6 6 4 4l2.8-.4L8 1z" fill="currentColor" opacity="0.5" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-gray-400 dark:text-[#7A9BBF] shrink-0">
    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M7 6v4M7 4.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

function Section({
  label,
  info,
  description,
  children,
}: {
  label: string;
  info?: boolean;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="py-5 border-b border-gray-100 dark:border-[#1E3050] last:border-b-0">
      <div className="flex items-center gap-2 mb-1.5">
        <SettingsIcon />
        <span className="text-sm font-semibold text-gray-700 dark:text-[#C8D8EE]">{label}</span>
        {info && <InfoIcon />}
      </div>
      {description && (
        <p className="text-xs text-gray-400 dark:text-[#7A9BBF] mb-3 ml-6">{description}</p>
      )}
      <div className="ml-0">{children}</div>
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-[#1E3050] bg-white dark:bg-[#162238] text-gray-800 dark:text-[#C8D8EE] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 placeholder:text-gray-400 dark:placeholder:text-[#7A9BBF] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
    />
  );
}

function RadioGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; extra?: React.ReactNode }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
          <div
            onClick={() => onChange(opt.value)}
            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors cursor-pointer
              ${value === opt.value
                ? "border-violet-600 bg-white dark:bg-[#111D30]"
                : "border-gray-300 dark:border-[#2A4060] bg-white dark:bg-[#111D30]"
              }`}
          >
            {value === opt.value && <div className="w-2 h-2 rounded-full bg-violet-600" />}
          </div>
          <span
            onClick={() => onChange(opt.value)}
            className={`text-sm cursor-pointer transition-colors
              ${value === opt.value
                ? "text-gray-800 dark:text-[#C8D8EE] font-medium"
                : "text-gray-500 dark:text-[#7A9BBF] group-hover:text-gray-700 dark:group-hover:text-[#C8D8EE]"
              }`}
          >
            {opt.label}
          </span>
          {opt.extra}
        </label>
      ))}
    </div>
  );
}

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

export default function ConversationSettings({
  state,
  onChange,
  onSave,
}: {
  state: PersonaState;
  onChange: (patch: Partial<PersonaState>) => void;
  onSave: () => void;
}) {
  const [newQuestion, setNewQuestion] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const addQuestion = () => {
    const q = newQuestion.trim();
    if (!q) return;
    onChange({ starterQuestions: [...state.starterQuestions, q] });
    setNewQuestion("");
  };

  const removeQuestion = (i: number) => {
    onChange({ starterQuestions: state.starterQuestions.filter((_, idx) => idx !== i) });
  };

  const startEdit = (i: number) => {
    setEditingIndex(i);
    setEditingValue(state.starterQuestions[i]);
  };

  const commitEdit = () => {
    if (editingIndex === null) return;
    const updated = [...state.starterQuestions];
    updated[editingIndex] = editingValue.trim() || updated[editingIndex];
    onChange({ starterQuestions: updated });
    setEditingIndex(null);
  };

  return (
    <div className="px-6 py-2">

      {/* I don't know message */}
      <Section label="I don't know message" info description="How should your agent respond if it's not able to answer a user's query?">
        <TextInput
          value={state.iDontKnowMessage}
          onChange={(v) => onChange({ iDontKnowMessage: v })}
          placeholder="e.g. I don't have information on that topic."
        />
      </Section>

      {/* Starter Questions */}
      <Section label="Starter Questions" info>
        {/* Context-rich toggle row */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-gray-500 dark:text-[#7A9BBF]">Use context-rich Starter Questions</span>
          <InfoIcon />
          <Toggle checked={state.useContextRichStarters} onChange={(v) => onChange({ useContextRichStarters: v })} />
          <span className="text-xs text-gray-400 dark:text-[#7A9BBF] ml-1">{state.useContextRichStarters ? "ON" : "OFF"}</span>
        </div>
        <a href="#" className="text-xs text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1 mb-3">
          Learn more
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M3.5 8.5l5-5M5 3.5h3.5V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </a>
        <button
          disabled={!state.useContextRichStarters}
          className="px-3 py-1.5 mb-4 text-xs font-medium rounded-lg border border-gray-200 dark:border-[#1E3050] text-gray-400 dark:text-[#7A9BBF] disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:bg-gray-50 dark:hover:enabled:bg-[#1E3050] transition-colors"
        >
          Manage context-rich Starter Questions…
        </button>

        {/* Existing questions */}
        <div className="flex flex-col gap-1 mb-2">
          {state.starterQuestions.map((q, i) => (
            <div key={i} className="flex items-center gap-2 group">
              {editingIndex === i ? (
                <input
                  autoFocus
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onBlur={commitEdit}
                  onKeyDown={(e) => e.key === "Enter" && commitEdit()}
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-violet-400 bg-white dark:bg-[#162238] text-gray-800 dark:text-[#C8D8EE] outline-none focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900"
                />
              ) : (
                <span className="flex-1 px-3 py-2 text-sm text-gray-700 dark:text-[#C8D8EE] rounded-lg border border-gray-100 dark:border-[#1E3050] bg-white dark:bg-[#162238]">
                  {q}
                </span>
              )}
              <button onClick={() => startEdit(i)} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#1E3050] text-gray-400 dark:text-[#7A9BBF] transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
              </button>
              <button onClick={() => removeQuestion(i)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 dark:text-[#7A9BBF] hover:text-red-500 transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3.5h10M5.5 3.5V2.5h3V3.5M5 5.5v5M9 5.5v5M3.5 3.5l.5 8h6l.5-8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          ))}
        </div>

        {/* Add question */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addQuestion()}
            placeholder="Enter a sample question here"
            className="flex-1 px-3.5 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-[#1E3050] bg-white dark:bg-[#162238] text-gray-800 dark:text-[#C8D8EE] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 placeholder:text-gray-400 dark:placeholder:text-[#7A9BBF] transition-all"
          />
          <button
            onClick={addQuestion}
            className="w-9 h-9 rounded-lg border border-gray-200 dark:border-[#1E3050] flex items-center justify-center text-gray-400 dark:text-[#7A9BBF] hover:bg-gray-50 dark:hover:bg-[#1E3050] hover:text-gray-600 dark:hover:text-[#C8D8EE] transition-colors shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
      </Section>

      {/* Starter Questions Header */}
      <Section label="Starter Questions Header">
        <TextInput
          value={state.starterQuestionsHeader}
          onChange={(v) => onChange({ starterQuestionsHeader: v })}
          placeholder="e.g. How can I help you?"
        />
      </Section>

      {/* Starter Questions Expand */}
      <Section label="Starter Questions Expand">
        <TextInput
          value={state.starterQuestionsExpand}
          onChange={(v) => onChange({ starterQuestionsExpand: v })}
          placeholder="e.g. See more"
        />
      </Section>

      {/* Starter Questions Collapse */}
      <Section label="Starter Questions Collapse">
        <TextInput
          value={state.starterQuestionsCollapse}
          onChange={(v) => onChange({ starterQuestionsCollapse: v })}
          placeholder="e.g. See less"
        />
      </Section>

      {/* Agent Language */}
      <Section label="Agent Language" info>
        <div className="relative">
          <select
            value={state.agentLanguage}
            onChange={(e) => onChange({ agentLanguage: e.target.value })}
            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-[#1E3050] bg-white dark:bg-[#162238] text-gray-800 dark:text-[#C8D8EE] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 appearance-none cursor-pointer transition-all"
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#7A9BBF] pointer-events-none" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </Section>

      {/* Placeholder Prompt */}
      <Section label="Placeholder Prompt" info>
        <TextInput
          value={state.placeholderPrompt}
          onChange={(v) => onChange({ placeholderPrompt: v })}
          placeholder="e.g. Ask me anything…"
        />
      </Section>

      {/* Loading Indicator */}
      <Section label="Loading Indicator" info>
        <div className="flex flex-col gap-3">
          {/* Typing dots option */}
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <div
              onClick={() => onChange({ loadingIndicator: "typing-dots" })}
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors cursor-pointer
                ${state.loadingIndicator === "typing-dots"
                  ? "border-violet-600 bg-white dark:bg-[#111D30]"
                  : "border-gray-300 dark:border-[#2A4060] bg-white dark:bg-[#111D30]"
                }`}
            >
              {state.loadingIndicator === "typing-dots" && <div className="w-2 h-2 rounded-full bg-violet-600" />}
            </div>
            <span
              onClick={() => onChange({ loadingIndicator: "typing-dots" })}
              className={`text-sm cursor-pointer transition-colors ${state.loadingIndicator === "typing-dots" ? "text-gray-800 dark:text-[#C8D8EE] font-medium" : "text-gray-500 dark:text-[#7A9BBF]"}`}
            >
              Typing dots
            </span>
            {/* Animated dots preview */}
            <div className="flex items-center gap-1 ml-2">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-violet-500 inline-block"
                  style={{ animation: `bounce 1.2s ${i * 0.2}s infinite` }}
                />
              ))}
            </div>
          </label>

          {/* Custom message option */}
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <div
              onClick={() => onChange({ loadingIndicator: "custom-message" })}
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors cursor-pointer
                ${state.loadingIndicator === "custom-message"
                  ? "border-violet-600 bg-white dark:bg-[#111D30]"
                  : "border-gray-300 dark:border-[#2A4060] bg-white dark:bg-[#111D30]"
                }`}
            >
              {state.loadingIndicator === "custom-message" && <div className="w-2 h-2 rounded-full bg-violet-600" />}
            </div>
            <span
              onClick={() => onChange({ loadingIndicator: "custom-message" })}
              className={`text-sm cursor-pointer transition-colors shrink-0 ${state.loadingIndicator === "custom-message" ? "text-gray-800 dark:text-[#C8D8EE] font-medium" : "text-gray-500 dark:text-[#7A9BBF]"}`}
            >
              Custom message
            </span>
            <input
              type="text"
              value={state.loadingCustomMessage}
              onChange={(e) => onChange({ loadingCustomMessage: e.target.value })}
              disabled={state.loadingIndicator !== "custom-message"}
              placeholder="e.g. Looking it up…"
              className="flex-1 ml-1 px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-[#1E3050] bg-white dark:bg-[#162238] text-gray-800 dark:text-[#C8D8EE] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 placeholder:text-gray-400 dark:placeholder:text-[#7A9BBF] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            />
          </label>
        </div>
      </Section>

      {/* Custom Message Ending */}
      <Section label="Custom Message Ending" info>
        <TextInput
          value={state.customMessageEnding}
          onChange={(v) => onChange({ customMessageEnding: v })}
          placeholder=""
        />
      </Section>

      {/* Error Message */}
      <Section label="Error Message" info>
        <TextInput
          value={state.errorMessage}
          onChange={(v) => onChange({ errorMessage: v })}
          placeholder="e.g. Something went wrong. Please try again."
        />
      </Section>

      {/* Failed moderation message */}
      <Section label="Failed moderation message" info>
        <TextInput
          value={state.failedModerationMessage}
          onChange={(v) => onChange({ failedModerationMessage: v })}
          placeholder="e.g. I can't respond to that query."
        />
      </Section>

      {/* Conversation Duration */}
      <Section label="Conversation Duration" info>
        <RadioGroup
          options={[
            { value: "unlimited", label: "Unlimited" },
            { value: "24-hour-memory", label: "24-hour memory limit" },
            { value: "24-hour-close", label: "24 hours, then close" },
          ]}
          value={state.conversationDuration}
          onChange={(v) => onChange({ conversationDuration: v })}
        />
      </Section>

      {/* Markdown in Responses */}
      <Section label="Markdown in Responses" info>
        <RadioGroup
          options={[
            { value: "enabled", label: "Enabled" },
            { value: "disabled", label: "Disabled" },
          ]}
          value={state.markdownInResponses}
          onChange={(v) => onChange({ markdownInResponses: v })}
        />
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

      <style jsx>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
