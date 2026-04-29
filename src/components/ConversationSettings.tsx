"use client";

import { useState } from "react";
import type { PersonaState } from "./types";

const LANGUAGES = [
  { label: "🇺🇸 English", value: "English" },
  { label: "🇿🇦 Afrikaans", value: "Afrikaans" },
  { label: "🇦🇱 Shqip", value: "Albanian" },
  { label: "🇪🇹 አማርኛ", value: "Amharic" },
  { label: "🇸🇦 العربية", value: "Arabic" },
  { label: "🇦🇲 Հայերեն", value: "Armenian" },
  { label: "🇦🇿 Azərbaycan", value: "Azerbaijani" },
  { label: "🇪🇸 Euskara", value: "Basque" },
  { label: "🇧🇾 Беларуская", value: "Belarusian" },
  { label: "🇧🇩 বাংলা", value: "Bengali" },
  { label: "🇧🇦 Bosanski", value: "Bosnian" },
  { label: "🇧🇬 Български", value: "Bulgarian" },
  { label: "🇲🇲 မြန်မာဘာသာ", value: "Burmese" },
  { label: "🇪🇸 Català", value: "Catalan" },
  { label: "🇵🇭 Cebuano", value: "Cebuano" },
  { label: "🇨🇳 中文（简体）", value: "Chinese (Simplified)" },
  { label: "🇹🇼 中文（繁體）", value: "Chinese (Traditional)" },
  { label: "🇭🇷 Hrvatski", value: "Croatian" },
  { label: "🇨🇿 Čeština", value: "Czech" },
  { label: "🇩🇰 Dansk", value: "Danish" },
  { label: "🇳🇱 Nederlands", value: "Dutch" },
  { label: "🇪🇪 Eesti", value: "Estonian" },
  { label: "🇵🇭 Filipino", value: "Filipino" },
  { label: "🇫🇮 Suomi", value: "Finnish" },
  { label: "🇫🇷 Français", value: "French" },
  { label: "🇪🇸 Galego", value: "Galician" },
  { label: "🇬🇪 ქართული", value: "Georgian" },
  { label: "🇩🇪 Deutsch", value: "German" },
  { label: "🇬🇷 Ελληνικά", value: "Greek" },
  { label: "🇮🇳 ગુજરાતી", value: "Gujarati" },
  { label: "🇭🇹 Kreyòl ayisyen", value: "Haitian Creole" },
  { label: "🇳🇬 Hausa", value: "Hausa" },
  { label: "🇮🇱 עברית", value: "Hebrew" },
  { label: "🇮🇳 हिन्दी", value: "Hindi" },
  { label: "🇭🇺 Magyar", value: "Hungarian" },
  { label: "🇮🇸 Íslenska", value: "Icelandic" },
  { label: "🇳🇬 Igbo", value: "Igbo" },
  { label: "🇮🇩 Bahasa Indonesia", value: "Indonesian" },
  { label: "🇮🇪 Gaeilge", value: "Irish" },
  { label: "🇮🇹 Italiano", value: "Italian" },
  { label: "🇯🇵 日本語", value: "Japanese" },
  { label: "🇮🇩 Basa Jawa", value: "Javanese" },
  { label: "🇮🇳 ಕನ್ನಡ", value: "Kannada" },
  { label: "🇰🇿 Қазақша", value: "Kazakh" },
  { label: "🇰🇭 ភាសាខ្មែរ", value: "Khmer" },
  { label: "🇰🇷 한국어", value: "Korean" },
  { label: "🇹🇷 Kurdî", value: "Kurdish" },
  { label: "🇰🇬 Кыргызча", value: "Kyrgyz" },
  { label: "🇱🇦 ລາວ", value: "Lao" },
  { label: "🇱🇻 Latviešu", value: "Latvian" },
  { label: "🇱🇹 Lietuvių", value: "Lithuanian" },
  { label: "🇱🇺 Lëtzebuergesch", value: "Luxembourgish" },
  { label: "🇲🇰 Македонски", value: "Macedonian" },
  { label: "🇲🇬 Malagasy", value: "Malagasy" },
  { label: "🇲🇾 Bahasa Melayu", value: "Malay" },
  { label: "🇮🇳 മലയാളം", value: "Malayalam" },
  { label: "🇲🇹 Malti", value: "Maltese" },
  { label: "🇮🇳 मराठी", value: "Marathi" },
  { label: "🇲🇳 Монгол", value: "Mongolian" },
  { label: "🇳🇵 नेपाली", value: "Nepali" },
  { label: "🇳🇴 Norsk", value: "Norwegian" },
  { label: "🇮🇳 ଓଡ଼ିଆ", value: "Odia" },
  { label: "🇦🇫 پښتو", value: "Pashto" },
  { label: "🇮🇷 فارسی", value: "Persian (Farsi)" },
  { label: "🇵🇱 Polski", value: "Polish" },
  { label: "🇧🇷 Português", value: "Portuguese" },
  { label: "🇮🇳 ਪੰਜਾਬੀ", value: "Punjabi" },
  { label: "🇷🇴 Română", value: "Romanian" },
  { label: "🇷🇺 Русский", value: "Russian" },
  { label: "🇷🇸 Српски", value: "Serbian" },
  { label: "🇵🇰 سنڌي", value: "Sindhi" },
  { label: "🇱🇰 සිංහල", value: "Sinhala" },
  { label: "🇸🇰 Slovenčina", value: "Slovak" },
  { label: "🇸🇮 Slovenščina", value: "Slovenian" },
  { label: "🇸🇴 Soomaali", value: "Somali" },
  { label: "🇪🇸 Español", value: "Spanish" },
  { label: "🇰🇪 Kiswahili", value: "Swahili" },
  { label: "🇸🇪 Svenska", value: "Swedish" },
  { label: "🇹🇯 Тоҷикӣ", value: "Tajik" },
  { label: "🇮🇳 தமிழ்", value: "Tamil" },
  { label: "🇮🇳 తెలుగు", value: "Telugu" },
  { label: "🇹🇭 ภาษาไทย", value: "Thai" },
  { label: "🇨🇳 བོད་སྐད་", value: "Tibetan" },
  { label: "🇹🇷 Türkçe", value: "Turkish" },
  { label: "🇹🇲 Türkmen", value: "Turkmen" },
  { label: "🇺🇦 Українська", value: "Ukrainian" },
  { label: "🇵🇰 اردو", value: "Urdu" },
  { label: "🇨🇳 ئۇيغۇرچە", value: "Uyghur" },
  { label: "🇺🇿 Oʻzbekcha", value: "Uzbek" },
  { label: "🇻🇳 Tiếng Việt", value: "Vietnamese" },
  { label: "🏴󠁧󠁢󠁷󠁬󠁳󠁿 Cymraeg", value: "Welsh" },
  { label: "🇳🇬 Yorùbá", value: "Yoruba" },
  { label: "🇿🇦 isiZulu", value: "Zulu" },
];

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
    <div className="bg-white dark:bg-[#111D30] rounded-2xl border border-[#E5E5E5] shadow-[0_4px_24px_rgba(23,23,23,0.06)] dark:border-[#1E3050] overflow-hidden px-5 py-4">
      <div className="flex items-center gap-2 mb-3">
        <SettingsIcon />
        <span className="text-sm font-semibold text-[#404040] dark:text-[#C8D8EE]">{label}</span>
        {info && <InfoIcon />}
      </div>
      {description && (
        <p className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF] mb-3">{description}</p>
      )}
      {children}
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
      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E5E5E5] dark:border-[#1E3050] bg-white dark:bg-[#162238] text-[#262626] dark:text-[#C8D8EE] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 placeholder:text-[#A3A3A3] dark:placeholder:text-[#7A9BBF] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                ? "text-[#262626] dark:text-[#C8D8EE] font-medium"
                : "text-[#737373] dark:text-[#7A9BBF] group-hover:text-[#404040] dark:group-hover:text-[#C8D8EE]"
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

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wider text-[#A3A3A3] dark:text-[#7A9BBF] px-1 -mb-3">
      {children}
    </p>
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
    <div className="px-6 py-6 flex flex-col gap-6">

      {/* ── Language ─────────────────────────────────── */}
      <GroupLabel>Language</GroupLabel>

      <Section label="Agent Language" info>
        <div className="relative">
          <select
            value={state.agentLanguage}
            onChange={(e) => onChange({ agentLanguage: e.target.value })}
            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E5E5E5] dark:border-[#1E3050] bg-white dark:bg-[#162238] text-[#262626] dark:text-[#C8D8EE] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 appearance-none cursor-pointer transition-all"
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3A3A3] dark:text-[#7A9BBF] pointer-events-none" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </Section>

      {/* ── Starter Questions ─────────────────────────── */}
      <GroupLabel>Starter Questions</GroupLabel>

      <div className="bg-white dark:bg-[#111D30] rounded-2xl border border-[#E5E5E5] shadow-[0_4px_24px_rgba(23,23,23,0.06)] dark:border-[#1E3050] divide-y divide-[#E5E5E5] dark:divide-[#1E3050] overflow-hidden">

          {/* Starter Questions list */}
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <SettingsIcon />
              <span className="text-sm font-semibold text-[#404040] dark:text-[#C8D8EE]">Starter Questions</span>
              <InfoIcon />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-[#737373] dark:text-[#7A9BBF]">Use context-rich Starter Questions</span>
              <InfoIcon />
              <Toggle checked={state.useContextRichStarters} onChange={(v) => onChange({ useContextRichStarters: v })} />
              <span className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF] ml-1">{state.useContextRichStarters ? "ON" : "OFF"}</span>
            </div>
            <a href="#" className="text-xs text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1 mb-3">
              Learn more
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M3.5 8.5l5-5M5 3.5h3.5V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
            <button
              disabled={!state.useContextRichStarters}
              className="px-3 py-1.5 mb-4 text-xs font-medium rounded-lg border border-[#E5E5E5] dark:border-[#1E3050] text-[#A3A3A3] dark:text-[#7A9BBF] disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:bg-[#FAFAFA] dark:hover:enabled:bg-[#1E3050] transition-colors"
            >
              Manage context-rich Starter Questions…
            </button>
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
                      className="flex-1 px-3 py-2 text-sm rounded-lg border border-violet-400 bg-white dark:bg-[#162238] text-[#262626] dark:text-[#C8D8EE] outline-none focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900"
                    />
                  ) : (
                    <span className="flex-1 px-3 py-2 text-sm text-[#404040] dark:text-[#C8D8EE] rounded-lg border border-[#F5F5F5] dark:border-[#1E3050] bg-white dark:bg-[#162238]">
                      {q}
                    </span>
                  )}
                  <button onClick={() => startEdit(i)} className="p-1.5 rounded hover:bg-[#F5F5F5] dark:hover:bg-[#1E3050] text-[#A3A3A3] dark:text-[#7A9BBF] transition-colors">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                  </button>
                  <button onClick={() => removeQuestion(i)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-[#A3A3A3] dark:text-[#7A9BBF] hover:text-red-500 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3.5h10M5.5 3.5V2.5h3V3.5M5 5.5v5M9 5.5v5M3.5 3.5l.5 8h6l.5-8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addQuestion()}
                placeholder="Enter a sample question here"
                className="flex-1 px-3.5 py-2.5 text-sm rounded-lg border border-[#E5E5E5] dark:border-[#1E3050] bg-white dark:bg-[#162238] text-[#262626] dark:text-[#C8D8EE] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 placeholder:text-[#A3A3A3] dark:placeholder:text-[#7A9BBF] transition-all"
              />
              <button
                onClick={addQuestion}
                className="w-9 h-9 rounded-lg border border-[#E5E5E5] dark:border-[#1E3050] flex items-center justify-center text-[#A3A3A3] dark:text-[#7A9BBF] hover:bg-[#FAFAFA] dark:hover:bg-[#1E3050] hover:text-[#525252] dark:hover:text-[#C8D8EE] transition-colors shrink-0"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </div>
          </div>

          {/* Header */}
          <div className="px-5 py-4">
            <p className="text-sm font-semibold text-[#404040] dark:text-[#C8D8EE] mb-3">Header</p>
            <TextInput value={state.starterQuestionsHeader} onChange={(v) => onChange({ starterQuestionsHeader: v })} placeholder="e.g. How can I help you?" />
          </div>

          {/* Expand label */}
          <div className="px-5 py-4">
            <p className="text-sm font-semibold text-[#404040] dark:text-[#C8D8EE] mb-3">Expand label</p>
            <TextInput value={state.starterQuestionsExpand} onChange={(v) => onChange({ starterQuestionsExpand: v })} placeholder="e.g. See more" />
          </div>

          {/* Collapse label */}
          <div className="px-5 py-4">
            <p className="text-sm font-semibold text-[#404040] dark:text-[#C8D8EE] mb-3">Collapse label</p>
            <TextInput value={state.starterQuestionsCollapse} onChange={(v) => onChange({ starterQuestionsCollapse: v })} placeholder="e.g. See less" />
          </div>

      </div>

      {/* ── Chat Interface ────────────────────────────── */}
      <GroupLabel>Chat Interface</GroupLabel>

      <Section label="Placeholder Prompt" info>
        <TextInput value={state.placeholderPrompt} onChange={(v) => onChange({ placeholderPrompt: v })} placeholder="e.g. Ask me anything…" />
      </Section>

      <Section label="Loading Indicator" info>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <div
              onClick={() => onChange({ loadingIndicator: "typing-dots" })}
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors cursor-pointer
                ${state.loadingIndicator === "typing-dots" ? "border-violet-600 bg-white dark:bg-[#111D30]" : "border-gray-300 dark:border-[#2A4060] bg-white dark:bg-[#111D30]"}`}
            >
              {state.loadingIndicator === "typing-dots" && <div className="w-2 h-2 rounded-full bg-violet-600" />}
            </div>
            <span onClick={() => onChange({ loadingIndicator: "typing-dots" })} className={`text-sm cursor-pointer transition-colors ${state.loadingIndicator === "typing-dots" ? "text-[#262626] dark:text-[#C8D8EE] font-medium" : "text-[#737373] dark:text-[#7A9BBF]"}`}>Typing dots</span>
            <div className="flex items-center gap-1 ml-2">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-violet-500 inline-block" style={{ animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <div
              onClick={() => onChange({ loadingIndicator: "custom-message" })}
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors cursor-pointer
                ${state.loadingIndicator === "custom-message" ? "border-violet-600 bg-white dark:bg-[#111D30]" : "border-gray-300 dark:border-[#2A4060] bg-white dark:bg-[#111D30]"}`}
            >
              {state.loadingIndicator === "custom-message" && <div className="w-2 h-2 rounded-full bg-violet-600" />}
            </div>
            <span onClick={() => onChange({ loadingIndicator: "custom-message" })} className={`text-sm cursor-pointer transition-colors shrink-0 ${state.loadingIndicator === "custom-message" ? "text-[#262626] dark:text-[#C8D8EE] font-medium" : "text-[#737373] dark:text-[#7A9BBF]"}`}>Custom message</span>
            <input
              type="text"
              value={state.loadingCustomMessage}
              onChange={(e) => onChange({ loadingCustomMessage: e.target.value })}
              disabled={state.loadingIndicator !== "custom-message"}
              placeholder="e.g. Looking it up…"
              className="flex-1 ml-1 px-3 py-1.5 text-sm rounded-lg border border-[#E5E5E5] dark:border-[#1E3050] bg-white dark:bg-[#162238] text-[#262626] dark:text-[#C8D8EE] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 placeholder:text-[#A3A3A3] dark:placeholder:text-[#7A9BBF] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            />
          </label>
        </div>
      </Section>

      <Section label="Custom Message Ending" info>
        <TextInput value={state.customMessageEnding} onChange={(v) => onChange({ customMessageEnding: v })} placeholder="" />
      </Section>

      <Section label="Markdown in Responses" info>
        <RadioGroup
          options={[{ value: "enabled", label: "Enabled" }, { value: "disabled", label: "Disabled" }]}
          value={state.markdownInResponses}
          onChange={(v) => onChange({ markdownInResponses: v })}
        />
      </Section>

      {/* ── System Messages ───────────────────────────── */}
      <GroupLabel>System Messages</GroupLabel>

      <Section label="I don't know message" info description="How should your agent respond if it's not able to answer a user's query?">
        <TextInput value={state.iDontKnowMessage} onChange={(v) => onChange({ iDontKnowMessage: v })} placeholder="e.g. I don't have information on that topic." />
      </Section>

      <Section label="Error Message" info>
        <TextInput value={state.errorMessage} onChange={(v) => onChange({ errorMessage: v })} placeholder="e.g. Something went wrong. Please try again." />
      </Section>

      <Section label="Failed moderation message" info>
        <TextInput value={state.failedModerationMessage} onChange={(v) => onChange({ failedModerationMessage: v })} placeholder="e.g. I can't respond to that query." />
      </Section>

      {/* ── Memory ───────────────────────────────────── */}
      <GroupLabel>Memory</GroupLabel>

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

      {/* Save */}
      <div className="pb-2">
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
