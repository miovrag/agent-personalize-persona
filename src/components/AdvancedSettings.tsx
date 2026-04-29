"use client";

import { useRef, useCallback } from "react";
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

export default function AdvancedSettings({
  state,
  onChange,
  onSave,
}: {
  state: PersonaState;
  onChange: (patch: Partial<PersonaState>) => void;
  onSave: () => void;
}) {
  const colorRef = useRef<HTMLInputElement>(null);
  const userAvatarRef = useRef<HTMLInputElement>(null);

  const handleUserAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange({ userAvatarUploadUrl: URL.createObjectURL(file) });
  }, [onChange]);

  return (
    <div className="px-6 py-6 flex flex-col gap-6">

      {/* End-user conversation history */}
      <SectionCard>
        <SectionHeader label="End-user conversation history" info />
        <p className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF] leading-relaxed mb-4">
          When enabled, users will see a history panel with their past conversations and can resume any of them. Works across Share Link, Embed, Live Chat, and Website Copilot deployments.
        </p>
        <RadioGroup
          options={[
            { value: "everyone", label: "Everyone" },
            { value: "team-members", label: "Team members only" },
            { value: "hidden", label: "Hidden" },
          ]}
          value={state.conversationHistory}
          onChange={(v) => onChange({ conversationHistory: v })}
        />

        {state.conversationHistory !== "hidden" && (
          <div className="mt-5">
            <p className="text-xs font-semibold text-[#737373] dark:text-[#7A9BBF] mb-3">How we store history</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-[#F5F5F5] dark:border-[#1E3050] bg-[#FAFAFA] dark:bg-[#162238]">
                <div className="flex items-center gap-1.5 mb-2">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[#A3A3A3] dark:text-[#7A9BBF]">
                    <rect x="2" y="3" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M5 3V2M9 3V2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  <span className="text-xs font-semibold text-[#525252] dark:text-[#C8D8EE]">Team members</span>
                </div>
                <p className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF] leading-relaxed">
                  Conversations are synced across all devices and browsers. History persists indefinitely unless the user deletes it.
                </p>
              </div>
              <div className="p-3 rounded-xl border border-[#F5F5F5] dark:border-[#1E3050] bg-[#FAFAFA] dark:bg-[#162238]">
                <div className="flex items-center gap-1.5 mb-2">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[#A3A3A3] dark:text-[#7A9BBF]">
                    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M7 4v3l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-xs font-semibold text-[#525252] dark:text-[#C8D8EE]">Guest users</span>
                </div>
                <p className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF] leading-relaxed">
                  Conversations are saved in browser storage. History is available in the current browser and is lost if the user clears their cache or switches devices.
                </p>
              </div>
            </div>
          </div>
        )}
      </SectionCard>

      {/* User Feedback */}
      <SectionCard>
        <SectionHeader label="User Feedback" info />
        <RadioGroup
          options={[{ value: "enabled", label: "Enabled" }, { value: "disabled", label: "Disabled" }]}
          value={state.userFeedback}
          onChange={(v) => onChange({ userFeedback: v })}
        />
      </SectionCard>

      {/* Show Copy Button */}
      <SectionCard>
        <SectionHeader label="Show Copy Button" info />
        <RadioGroup
          options={[{ value: "enabled", label: "Enabled" }, { value: "disabled", label: "Disabled" }]}
          value={state.showCopyButton}
          onChange={(v) => onChange({ showCopyButton: v })}
        />
      </SectionCard>

      {/* Conversation Sharing */}
      <SectionCard>
        <SectionHeader label="Conversation Sharing" info />
        <RadioGroup
          options={[{ value: "enabled", label: "Enabled" }, { value: "disabled", label: "Disabled" }]}
          value={state.conversationSharing}
          onChange={(v) => onChange({ conversationSharing: v })}
        />
      </SectionCard>

      {/* Conversation Exporting */}
      <SectionCard>
        <SectionHeader label="Conversation Exporting" info />
        <RadioGroup
          options={[{ value: "enabled", label: "Enabled" }, { value: "disabled", label: "Disabled" }]}
          value={state.conversationExporting}
          onChange={(v) => onChange({ conversationExporting: v })}
        />
      </SectionCard>

      {/* Branding */}
      <SectionCard>
        <SectionHeader label="Branding" />
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-sm text-[#404040] dark:text-[#C8D8EE]">Remove Branding</span>
              <InfoIcon />
            </div>
            <p className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF]">Powered by CustomGPT.ai</p>
          </div>
          <div className="flex items-center gap-2">
            <Toggle checked={state.removeBranding} onChange={(v) => onChange({ removeBranding: v })} />
            <span className="text-xs text-[#737373] dark:text-[#7A9BBF]">Remove</span>
          </div>
        </div>
      </SectionCard>

      {/* Agent Title */}
      <SectionCard>
        <SectionHeader label="Agent Title" info />
        <input
          type="text"
          value={state.agentTitle}
          onChange={(e) => onChange({ agentTitle: e.target.value })}
          placeholder={state.agentName}
          className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E5E5E5] dark:border-[#1E3050] bg-white dark:bg-[#162238] text-[#262626] dark:text-[#C8D8EE] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 placeholder:text-[#A3A3A3] dark:placeholder:text-[#7A9BBF] transition-all"
        />
      </SectionCard>

      {/* Title Color */}
      <SectionCard>
        <SectionHeader label="Title Color" info />
        <div className="flex items-center gap-2">
          <div className="relative flex items-center flex-1 max-w-[220px] border border-[#E5E5E5] dark:border-[#1E3050] rounded-lg overflow-hidden bg-white dark:bg-[#162238]">
            <input
              type="text"
              value={state.titleColor}
              onChange={(e) => onChange({ titleColor: e.target.value })}
              placeholder="#000000"
              className="flex-1 px-3 py-2 text-sm bg-transparent outline-none text-[#262626] dark:text-[#C8D8EE] font-mono"
            />
            <button onClick={() => colorRef.current?.click()} className="flex items-center justify-center w-9 h-9 shrink-0">
              <span className="w-5 h-5 rounded-full border border-[#E5E5E5] dark:border-[#1E3050]" style={{ backgroundColor: state.titleColor }} />
            </button>
          </div>
          <button
            onClick={() => colorRef.current?.click()}
            className="p-2 rounded-lg hover:bg-[#F5F5F5] dark:hover:bg-[#1E3050] transition-colors text-[#A3A3A3] dark:text-[#7A9BBF]"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
          </button>
          <input ref={colorRef} type="color" value={state.titleColor} onChange={(e) => onChange({ titleColor: e.target.value })} className="sr-only" />
        </div>
      </SectionCard>

      {/* Title Avatar */}
      <SectionCard>
        <SectionHeader label="Title Avatar" />
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-[#404040] dark:text-[#C8D8EE]">Enabled</span>
          <div className="flex items-center gap-2">
            <Toggle checked={state.titleAvatarEnabled} onChange={(v) => onChange({ titleAvatarEnabled: v })} />
            <span className="text-xs text-[#737373] dark:text-[#7A9BBF]">{state.titleAvatarEnabled ? "ON" : "OFF"}</span>
          </div>
        </div>
      </SectionCard>

      {/* Spotlight Avatar */}
      <SectionCard>
        <SectionHeader label="Spotlight Avatar" info />
        <div className="flex items-center justify-between gap-3 mb-4">
          <span className="text-sm text-[#404040] dark:text-[#C8D8EE]">Enabled</span>
          <div className="flex items-center gap-2">
            <Toggle checked={state.spotlightAvatarEnabled} onChange={(v) => onChange({ spotlightAvatarEnabled: v })} />
            <span className="text-xs text-[#737373] dark:text-[#7A9BBF]">{state.spotlightAvatarEnabled ? "ON" : "OFF"}</span>
          </div>
        </div>
        {state.spotlightAvatarEnabled && (
          <div className="space-y-3">
            <RadioGroup
              options={[
                { value: "special", label: "Use special avatar" },
                { value: "main", label: "Use main agent avatar" },
              ]}
              value={state.spotlightAvatarType}
              onChange={(v) => onChange({ spotlightAvatarType: v })}
            />
            <RadioGroup
              options={[
                { value: "rectangular", label: "Rectangular spotlight avatar" },
                { value: "round", label: "Round spotlight avatar" },
              ]}
              value={state.spotlightAvatarShape}
              onChange={(v) => onChange({ spotlightAvatarShape: v })}
            />
          </div>
        )}
      </SectionCard>

      {/* User Avatar */}
      <SectionCard>
        <SectionHeader label="User Avatar" info />
        <div className="flex items-center justify-between gap-3 mb-4">
          <span className="text-sm text-[#404040] dark:text-[#C8D8EE]">Enabled</span>
          <div className="flex items-center gap-2">
            <Toggle checked={state.userAvatarEnabled} onChange={(v) => onChange({ userAvatarEnabled: v })} />
            <span className="text-xs text-[#737373] dark:text-[#7A9BBF]">{state.userAvatarEnabled ? "ON" : "OFF"}</span>
          </div>
        </div>
        {state.userAvatarEnabled && (
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg border border-[#E5E5E5] dark:border-[#1E3050] bg-[#FAFAFA] dark:bg-[#162238] shrink-0 overflow-hidden flex items-center justify-center">
              {state.userAvatarUploadUrl ? (
                <img src={state.userAvatarUploadUrl} alt="User avatar" className="w-full h-full object-cover" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#D4D4D4] dark:text-[#2A4060]">
                  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF] mb-2">Upload square image only. Allowed are JPG, GIF or PNG image up to 800 Kb.</p>
              <button
                onClick={() => userAvatarRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#E5E5E5] dark:border-[#1E3050] text-[#525252] dark:text-[#C8D8EE] hover:bg-[#FAFAFA] dark:hover:bg-[#1E3050] transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v7M3 4l3-3 3 3M1 9v1.5A.5.5 0 001.5 11h9a.5.5 0 00.5-.5V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Change Avatar
              </button>
              <input ref={userAvatarRef} type="file" accept=".jpg,.jpeg,.gif,.png" className="sr-only" onChange={handleUserAvatarChange} />
            </div>
          </div>
        )}
      </SectionCard>

      {/* Avatar Orientations */}
      <SectionCard>
        <SectionHeader label="Avatar Orientations" info />
        <div className="relative">
          <select
            value={state.avatarOrientation}
            onChange={(e) => onChange({ avatarOrientation: e.target.value as PersonaState["avatarOrientation"] })}
            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E5E5E5] dark:border-[#1E3050] bg-white dark:bg-[#162238] text-[#262626] dark:text-[#C8D8EE] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 appearance-none cursor-pointer transition-all"
          >
            <option value="agent-left-user-right">Agent left, User right</option>
            <option value="agent-right-user-left">Agent right, User left</option>
            <option value="both-left">Both left</option>
            <option value="both-right">Both right</option>
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3A3A3] dark:text-[#7A9BBF] pointer-events-none" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </SectionCard>

      {/* Agent Title & Avatar Alignment */}
      <SectionCard>
        <SectionHeader label="Agent Title & Avatar Alignment" info />
        <div className="relative">
          <select
            value={state.titleAvatarAlignment}
            onChange={(e) => onChange({ titleAvatarAlignment: e.target.value as PersonaState["titleAvatarAlignment"] })}
            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E5E5E5] dark:border-[#1E3050] bg-white dark:bg-[#162238] text-[#262626] dark:text-[#C8D8EE] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 appearance-none cursor-pointer transition-all"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3A3A3] dark:text-[#7A9BBF] pointer-events-none" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </SectionCard>

      {/* In-Chat Avatars */}
      <SectionCard>
        <SectionHeader label="In-Chat Avatars" info />
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-[#404040] dark:text-[#C8D8EE]">Agent Avatar</span>
            <div className="flex items-center gap-2">
              <Toggle checked={state.inChatAgentAvatar} onChange={(v) => onChange({ inChatAgentAvatar: v })} />
              <span className="text-xs text-[#737373] dark:text-[#7A9BBF]">{state.inChatAgentAvatar ? "ON" : "OFF"}</span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-[#404040] dark:text-[#C8D8EE]">User Avatar</span>
            <div className="flex items-center gap-2">
              <Toggle checked={state.inChatUserAvatar} onChange={(v) => onChange({ inChatUserAvatar: v })} />
              <span className="text-xs text-[#737373] dark:text-[#7A9BBF]">{state.inChatUserAvatar ? "ON" : "OFF"}</span>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Affiliate ID */}
      <SectionCard>
        <SectionHeader label="Affiliate ID" info />
        <input
          type="text"
          value={state.affiliateId}
          onChange={(e) => onChange({ affiliateId: e.target.value })}
          placeholder="Enter your Affiliate ID here"
          className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E5E5E5] dark:border-[#1E3050] bg-white dark:bg-[#162238] text-[#262626] dark:text-[#C8D8EE] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 placeholder:text-[#A3A3A3] dark:placeholder:text-[#7A9BBF] transition-all mb-2"
        />
        <p className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF]">
          Don&apos;t have Affiliate ID?{" "}
          <a href="#" className="text-violet-600 dark:text-violet-400 hover:underline font-medium">Become A Partner</a>
        </p>
      </SectionCard>

      {/* Terms of Service */}
      <SectionCard>
        <SectionHeader label="Terms of Service" info />
        <textarea
          value={state.termsOfService}
          onChange={(e) => onChange({ termsOfService: e.target.value })}
          placeholder="Enter your text here"
          rows={4}
          className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E5E5E5] dark:border-[#1E3050] bg-white dark:bg-[#162238] text-[#262626] dark:text-[#C8D8EE] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 placeholder:text-[#A3A3A3] dark:placeholder:text-[#7A9BBF] resize-none transition-all"
          spellCheck={false}
        />
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
