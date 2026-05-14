"use client";

import { useState, useRef } from "react";
import type { PersonaState } from "./types";
import StarterQuestionsSection from "./StarterQuestionsSection";

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

function Section({
  label,
  info,
  tooltip,
  description,
  children,
}: {
  label: string;
  info?: boolean;
  tooltip?: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-[#111D30] rounded-2xl border border-[#E5E5E5] shadow-[0_4px_24px_rgba(23,23,23,0.06)] dark:border-[#1E3050] px-5 py-4">
      <div className="flex items-center gap-2 mb-3">
        <SettingsIcon />
        <span className="text-sm font-semibold text-[#404040] dark:text-[#C8D8EE]">{label}</span>
        {info && <InfoIcon tooltip={tooltip} />}
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

function RadioDot({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors cursor-pointer
        ${active ? "border-violet-600 bg-white dark:bg-[#111D30]" : "border-gray-300 dark:border-[#2A4060] bg-white dark:bg-[#111D30]"}`}
    >
      {active && <div className="w-2 h-2 rounded-full bg-violet-600" />}
    </div>
  );
}

export function LoadingIndicatorSection({
  state,
  onChange,
}: {
  state: PersonaState;
  onChange: (patch: Partial<PersonaState>) => void;
}) {

  return (
    <Section label="Loading Indicator" info tooltip="Animation or message shown while the agent generates a response">
      <div className="flex flex-col gap-3">

        {/* Option 1 — Typing dots */}
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => onChange({ loadingIndicator: "typing-dots" })}
        >
          <RadioDot active={state.loadingIndicator === "typing-dots"} onClick={() => onChange({ loadingIndicator: "typing-dots" })} />
          <span className={`text-sm transition-colors ${state.loadingIndicator === "typing-dots" ? "text-[#262626] dark:text-[#C8D8EE] font-medium" : "text-[#737373] dark:text-[#7A9BBF]"}`}>
            Typing dots
          </span>
          <div className="flex items-center gap-1 ml-1">
            {[0, 1, 2].map((i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-violet-500 inline-block" style={{ animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
            ))}
          </div>
        </div>

        {/* Option 2 — Background activity */}
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() => onChange({ loadingIndicator: "background-activity" })}
        >
          <RadioDot active={state.loadingIndicator === "background-activity"} onClick={() => onChange({ loadingIndicator: "background-activity" })} />
          <span className={`text-sm transition-colors ${state.loadingIndicator === "background-activity" ? "text-[#262626] dark:text-[#C8D8EE] font-medium" : "text-[#737373] dark:text-[#7A9BBF]"}`}>
            Background activity
          </span>
          <span className="text-[10px] text-[#A3A3A3] dark:text-[#7A9BBF] ml-1">edit in preview</span>
        </div>

        {/* Option 3 — Custom message */}
        <div className="flex items-center gap-2.5">
          <RadioDot active={state.loadingIndicator === "custom-message"} onClick={() => onChange({ loadingIndicator: "custom-message" })} />
          <span
            onClick={() => onChange({ loadingIndicator: "custom-message" })}
            className={`text-sm cursor-pointer transition-colors shrink-0 ${state.loadingIndicator === "custom-message" ? "text-[#262626] dark:text-[#C8D8EE] font-medium" : "text-[#737373] dark:text-[#7A9BBF]"}`}
          >
            Custom message
          </span>
          <input
            type="text"
            value={state.loadingCustomMessage}
            onChange={(e) => onChange({ loadingCustomMessage: e.target.value })}
            disabled={state.loadingIndicator !== "custom-message"}
            placeholder="e.g. Looking it up…"
            className="flex-1 ml-1 px-3 py-1.5 text-sm rounded-lg border border-[#E5E5E5] dark:border-[#1E3050] bg-white dark:bg-[#162238] text-[#262626] dark:text-[#C8D8EE] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 placeholder:text-[#A3A3A3] dark:placeholder:text-[#7A9BBF] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          />
        </div>

      </div>
    </Section>
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
  const step = 100 / (contextTiers.length - 1); // 20

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

      <Section label="Context Depth" info tooltip="Adjusts knowledge retrieval depth and conversation memory">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-[#737373] dark:text-[#7A9BBF]">Enable context depth control</span>
          <Toggle checked={state.contextDepthEnabled} onChange={(v) => onChange({ contextDepthEnabled: v })} />
        </div>

        {state.contextDepthEnabled && (
          <div className="flex flex-col gap-3">
            {/* Label + active pill */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#404040] dark:text-[#C8D8EE]">How deep should it search?</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F5F5F5] dark:bg-[#162238] text-violet-600">
                {activeTier.label}{activeTier.multiplier && activeTier.multiplier > 1 ? ` · ${activeTier.multiplier}×` : ""}
              </span>
            </div>

            {/* Slider track */}
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
              {/* Tick marks */}
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

            {/* Active tier preview pill */}
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

            {/* Lock hint */}
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
      </Section>
    </>
  );
}

// ─── Starter Questions preview illustration ──────────────────────────────────

function PlaceholderPreview() {
  return (
    <svg
      width="120" height="48"
      viewBox="0 0 120 48"
      fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, display: "block" }}
    >
      {/* Card border */}
      <rect x="0.5" y="0.5" width="119" height="47" rx="7.5" stroke="#D4D4D4" strokeWidth="1"/>

      {/* Chat bubbles (received) */}
      <rect x="8" y="8" width="52" height="8" rx="4" fill="#F0EFFF" stroke="#DDD9FC" strokeWidth="0.75"/>
      <rect x="8" y="19" width="38" height="8" rx="4" fill="#F0EFFF" stroke="#DDD9FC" strokeWidth="0.75"/>

      {/* Composer bar */}
      <rect x="8" y="32" width="88" height="10" rx="5" stroke="#D4D4D4" strokeWidth="1"/>
      {/* Placeholder line inside composer */}
      <rect x="14" y="35.5" width="44" height="3" rx="1.5" fill="#E5E5E5"/>
      {/* Send button circle */}
      <circle cx="106" cy="37" r="6" fill="#7367F0" opacity="0.15"/>
      <path d="M103.5 37l3.5-2v4l-3.5-2z" fill="#7367F0" opacity="0.7"/>
    </svg>
  );
}

function StarterPreview({ mode }: { mode: "expand" | "collapse" }) {
  const rowCount = mode === "expand" ? 3 : 4;
  const label = mode === "expand" ? "Show more" : "Show less";
  // row widths for variety
  const widths = [88, 64, 76, 60];
  return (
    <svg
      width="120" height={56 + rowCount * 18}
      viewBox={`0 0 120 ${56 + rowCount * 18}`}
      fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, display: "block" }}
    >
      {/* Card border */}
      <rect x="0.5" y="0.5" width="119" height={55 + rowCount * 18} rx="7.5" stroke="#D4D4D4" strokeWidth="1"/>

      {/* Header row */}
      <circle cx="12" cy="13" r="4" stroke="#A3A3A3" strokeWidth="1.2"/>
      {/* chat bubble icon strokes */}
      <path d="M10 13h4M12 11v4" stroke="#A3A3A3" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
      <rect x="20" y="9" width="36" height="7" rx="3" fill="#E5E5E5"/>
      <rect x="90" y="9" width="22" height="7" rx="3" fill="#F3F0FD"/>

      {/* Divider */}
      <line x1="8" y1="24" x2="112" y2="24" stroke="#E5E5E5" strokeWidth="1"/>

      {/* Question rows */}
      {Array.from({ length: rowCount }).map((_, i) => (
        <g key={i}>
          <rect x="8" y={30 + i * 18} width="104" height="12" rx="4" fill="#F5F5F5" stroke="#E5E5E5" strokeWidth="0.75"/>
          <rect x="14" y={34 + i * 18} width={widths[i]} height="4" rx="2" fill="#D4D4D4"/>
        </g>
      ))}

      {/* Footer label */}
      <rect
        x={60 - 22} y={36 + rowCount * 18}
        width="44" height="6" rx="3"
        fill="#EDE8FD"
      />
      <text
        x="60" y={43 + rowCount * 18}
        textAnchor="middle"
        fontSize="5" fontFamily="Inter,system-ui,sans-serif"
        fontWeight="500" fill="#7367F0"
      >
        {label}
      </text>
    </svg>
  );
}

type StarterTier = "free" | "premium" | "enterprise";
const STARTER_TIERS: { value: StarterTier; label: string }[] = [
  { value: "free",       label: "Standard" },
  { value: "premium",    label: "Premium" },
  { value: "enterprise", label: "Enterprise" },
];

export default function ConversationSettings({
  state,
  onChange,
  onSave,
}: {
  state: PersonaState;
  onChange: (patch: Partial<PersonaState>) => void;
  onSave: () => void;
}) {
  const [starterTier, setStarterTier] = useState<StarterTier>("enterprise");

  return (
    <div className="px-6 py-6 flex flex-col gap-6">

      {/* ── Language ─────────────────────────────────── */}
      <GroupLabel>Language</GroupLabel>

      <Section label="Agent Language" info tooltip="The language your agent responds in regardless of user language">
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

      {/* Tier switcher */}
      <div
        className="flex items-center w-fit"
        style={{
          padding: "3px 4px",
          borderRadius: 100,
          border: "1px solid #7367F0",
          background: "#7367F0",
          boxShadow: "0 2px 4px 0 rgba(165,163,174,0.30)",
          gap: 2,
        }}
      >
        {STARTER_TIERS.map((t) => (
          <button
            key={t.value}
            onClick={() => setStarterTier(t.value)}
            style={{
              height: 24,
              padding: "0 12px",
              borderRadius: 100,
              border: "none",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              transition: "background 120ms, color 120ms",
              background: starterTier === t.value ? "#fff" : "transparent",
              color: starterTier === t.value ? "#7367F0" : "rgba(255,255,255,0.85)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-[#111D30] rounded-2xl border border-[#E5E5E5] shadow-[0_4px_24px_rgba(23,23,23,0.06)] dark:border-[#1E3050] px-5 py-5">
        <StarterQuestionsSection
          key={starterTier}
          questions={state.starterQuestions}
          onChange={(questions) => onChange({ starterQuestions: questions })}
          tier={starterTier}
        />
      </div>

      {/* Header / labels */}
      <div className="bg-white dark:bg-[#111D30] rounded-2xl border border-[#E5E5E5] shadow-[0_4px_24px_rgba(23,23,23,0.06)] dark:border-[#1E3050] divide-y divide-[#E5E5E5] dark:divide-[#1E3050]">
        <div className="px-5 py-4">
          <p className="text-sm font-semibold text-[#404040] dark:text-[#C8D8EE] mb-3">Header</p>
          <TextInput value={state.starterQuestionsHeader} onChange={(v) => onChange({ starterQuestionsHeader: v })} placeholder="e.g. How can I help you?" />
        </div>
        <div className="px-5 py-4 flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#404040] dark:text-[#C8D8EE] mb-3">Expand label</p>
            <TextInput value={state.starterQuestionsExpand} onChange={(v) => onChange({ starterQuestionsExpand: v })} placeholder="e.g. See more" />
          </div>
          <StarterPreview mode="expand" />
        </div>
        <div className="px-5 py-4 flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#404040] dark:text-[#C8D8EE] mb-3">Collapse label</p>
            <TextInput value={state.starterQuestionsCollapse} onChange={(v) => onChange({ starterQuestionsCollapse: v })} placeholder="e.g. See less" />
          </div>
          <StarterPreview mode="collapse" />
        </div>
      </div>

      {/* ── Chat Interface ────────────────────────────── */}
      <GroupLabel>Chat Interface</GroupLabel>

      <div className="bg-white dark:bg-[#111D30] rounded-2xl border border-[#E5E5E5] shadow-[0_4px_24px_rgba(23,23,23,0.06)] dark:border-[#1E3050] px-5 py-4">
        <div className="flex items-center gap-2 mb-3">
          <SettingsIcon />
          <span className="text-sm font-semibold text-[#404040] dark:text-[#C8D8EE]">Placeholder Prompt</span>
          <InfoIcon tooltip="Hint text shown inside the chat input before the user types" />
        </div>
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <TextInput value={state.placeholderPrompt} onChange={(v) => onChange({ placeholderPrompt: v })} placeholder="e.g. Ask me anything…" />
          </div>
          <PlaceholderPreview />
        </div>
      </div>

      <LoadingIndicatorSection state={state} onChange={onChange} />

      <Section label="Custom Message Ending" info tooltip="Text appended after the loading message, e.g. 'please wait...'" description="Text appended to the end of every agent response, e.g. &quot;Please wait…&quot; or a disclaimer.">
        <TextInput value={state.customMessageEnding} onChange={(v) => onChange({ customMessageEnding: v })} placeholder="" />
      </Section>

      <Section label="Markdown in Responses" info tooltip="Renders bold, lists, headings, and links in agent responses">
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

      <Section label="Error Message" info tooltip="Shown when the agent fails to generate a response">
        <TextInput value={state.errorMessage} onChange={(v) => onChange({ errorMessage: v })} placeholder="e.g. Something went wrong. Please try again." />
      </Section>

      <Section label="Failed moderation message" info tooltip="Shown when a message is flagged by content moderation">
        <TextInput value={state.failedModerationMessage} onChange={(v) => onChange({ failedModerationMessage: v })} placeholder="e.g. I can't respond to that query." />
      </Section>

      {/* ── Memory ───────────────────────────────────── */}
      <GroupLabel>Memory</GroupLabel>

      <Section label="Conversation Duration" info tooltip="How long the agent retains context from previous messages">
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

      {/* ── Context Depth ─────────────────────────────── */}
      <GroupLabel>Context Depth</GroupLabel>

      <ContextDepthSection state={state} onChange={onChange} />

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
