"use client";

import { useState } from "react";
import type { PersonaState } from "./types";

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[#A3A3A3] dark:text-[#7A9BBF]">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const InfoIcon = ({ tooltip }: { tooltip?: string }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-flex shrink-0" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
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

function Section({ label, info, tooltip, description, children }: {
  label: string; info?: boolean; tooltip?: string; description?: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-[#111D30] rounded-2xl border border-[#E5E5E5] shadow-[0_4px_24px_rgba(23,23,23,0.06)] dark:border-[#1E3050] px-5 py-4">
      <div className="flex items-center gap-2 mb-3">
        <SettingsIcon />
        <span className="text-sm font-semibold text-[#404040] dark:text-[#C8D8EE]">{label}</span>
        {info && <InfoIcon tooltip={tooltip} />}
      </div>
      {description && <p className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF] mb-3">{description}</p>}
      {children}
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

function TextInput({ value, onChange, placeholder, disabled }: {
  value: string; onChange: (v: string) => void; placeholder?: string; disabled?: boolean;
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
  options, value, onChange,
}: {
  options: { value: T; label: string; description?: string }[];
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
              ${value === opt.value ? "border-violet-600 bg-white dark:bg-[#111D30]" : "border-gray-300 dark:border-[#2A4060] bg-white dark:bg-[#111D30]"}`}
          >
            {value === opt.value && <div className="w-2 h-2 rounded-full bg-violet-600" />}
          </div>
          <div onClick={() => onChange(opt.value)} className="cursor-pointer">
            <span className={`text-sm block transition-colors
              ${value === opt.value ? "text-[#262626] dark:text-[#C8D8EE] font-medium" : "text-[#737373] dark:text-[#7A9BBF] group-hover:text-[#404040] dark:group-hover:text-[#C8D8EE]"}`}>
              {opt.label}
            </span>
            {opt.description && (
              <span className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF] mt-0.5 block">{opt.description}</span>
            )}
          </div>
        </label>
      ))}
    </div>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wider text-[#A3A3A3] dark:text-[#7A9BBF] px-1 -mb-3">
      {children}
    </p>
  );
}

function ToggleRow({ label, description, checked, onChange, last }: {
  label: string; description?: string; checked: boolean; onChange: (v: boolean) => void; last?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between gap-4 py-3.5 ${last ? "" : "border-b border-[#F5F5F5] dark:border-[#1E3050]"}`}>
      <div className="min-w-0">
        <p className="text-sm font-medium text-[#262626] dark:text-[#C8D8EE]">{label}</p>
        {description && <p className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF] mt-0.5">{description}</p>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function PositionPicker({ value, onChange }: {
  value: "bottom-right" | "bottom-left";
  onChange: (v: "bottom-right" | "bottom-left") => void;
}) {
  const options: { value: "bottom-right" | "bottom-left"; label: string }[] = [
    { value: "bottom-right", label: "Bottom right" },
    { value: "bottom-left", label: "Bottom left" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((opt) => {
        const active = value === opt.value;
        const isRight = opt.value === "bottom-right";
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-150
              ${active
                ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30"
                : "border-[#E5E5E5] dark:border-[#1E3050] bg-white dark:bg-[#162238] hover:border-violet-300 dark:hover:border-violet-700"}`}
          >
            {/* Mini browser mockup */}
            <div className="w-full rounded-lg bg-[#F5F5F5] dark:bg-[#0D1A2D] border border-[#E5E5E5] dark:border-[#1E3050] overflow-hidden" style={{ aspectRatio: "3/2" }}>
              {/* Browser chrome */}
              <div className="flex items-center gap-0.5 px-1.5 pt-1 pb-0.5 border-b border-[#E5E5E5] dark:border-[#1E3050] bg-white dark:bg-[#0B1426]">
                {[0,1,2].map(i => <div key={i} className="w-1 h-1 rounded-full bg-[#E5E5E5] dark:bg-[#1E3050]" />)}
              </div>
              {/* Page area */}
              <div className="relative w-full" style={{ height: "calc(100% - 18px)" }}>
                {/* Page content lines */}
                <div className="absolute top-2 left-2 space-y-1">
                  <div className="h-1.5 w-12 rounded bg-[#E5E5E5] dark:bg-[#1E3050]" />
                  <div className="h-1 w-8 rounded bg-[#E5E5E5] dark:bg-[#1E3050] opacity-60" />
                </div>
                {/* Launcher button */}
                <div
                  className="absolute bottom-1.5 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center shadow"
                  style={isRight ? { right: 6 } : { left: 6 }}
                >
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                    <path d="M11 6c0 2.76-2.24 5-5 5a5.1 5.1 0 01-1.95-.38L1 12l.77-2.22A4.78 4.78 0 011 7c0-2.76 2.24-5 5-5s5 2.24 5 4z" stroke="white" strokeWidth="1" strokeLinejoin="round" fill="rgba(255,255,255,0.25)"/>
                  </svg>
                </div>
              </div>
            </div>
            <span className={`text-[11px] font-medium transition-colors ${active ? "text-violet-600 dark:text-violet-400" : "text-[#404040] dark:text-[#C8D8EE]"}`}>
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function LauncherStylePicker({ value, onChange }: {
  value: "bubble" | "bar" | "text";
  onChange: (v: "bubble" | "bar" | "text") => void;
}) {
  const options: { value: "bubble" | "bar" | "text"; label: string; desc: string }[] = [
    { value: "bubble", label: "Bubble", desc: "Round icon button" },
    { value: "bar", label: "Bar", desc: "Wide chat strip" },
    { value: "text", label: "Text", desc: "Minimal text link" },
  ];
  return (
    <div className="grid grid-cols-3 gap-3">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 transition-all duration-150
              ${active
                ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30"
                : "border-[#E5E5E5] dark:border-[#1E3050] bg-white dark:bg-[#162238] hover:border-violet-300 dark:hover:border-violet-700"}`}
          >
            {/* Style preview */}
            <div className="h-10 w-full flex items-end justify-center pb-0.5">
              {opt.value === "bubble" && (
                <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center shadow-sm">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M13 7c0 3-2.69 5.5-6 5.5a6.8 6.8 0 01-2.7-.55L1 13l1.08-3.1A5.3 5.3 0 011 7C1 4 3.69 1.5 7 1.5S13 4 13 7z" stroke="white" strokeWidth="1.2" strokeLinejoin="round" fill="rgba(255,255,255,0.2)"/>
                  </svg>
                </div>
              )}
              {opt.value === "bar" && (
                <div className="w-full h-7 rounded-lg bg-violet-500 flex items-center px-2 gap-1.5 shadow-sm">
                  <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                    <path d="M13 7c0 3-2.69 5.5-6 5.5a6.8 6.8 0 01-2.7-.55L1 13l1.08-3.1A5.3 5.3 0 011 7C1 4 3.69 1.5 7 1.5S13 4 13 7z" stroke="white" strokeWidth="1.2" strokeLinejoin="round" fill="rgba(255,255,255,0.2)"/>
                  </svg>
                  <span className="text-white text-[8px] font-semibold">Chat</span>
                </div>
              )}
              {opt.value === "text" && (
                <span className="text-violet-600 dark:text-violet-400 text-[10px] font-semibold underline underline-offset-2">
                  Chat with us ›
                </span>
              )}
            </div>
            <div className="text-center">
              <p className={`text-[11px] font-medium ${active ? "text-violet-600 dark:text-violet-400" : "text-[#404040] dark:text-[#C8D8EE]"}`}>
                {opt.label}
              </p>
              <p className="text-[9px] text-[#A3A3A3] dark:text-[#5A7A9A] leading-tight">{opt.desc}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function LeadFieldsSelector({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const fields = [
    { id: "name", label: "Name" },
    { id: "email", label: "Email" },
    { id: "phone", label: "Phone" },
  ];
  function toggle(id: string) {
    onChange(value.includes(id) ? value.filter(f => f !== id) : [...value, id]);
  }
  return (
    <div className="flex gap-2 flex-wrap">
      {fields.map(f => {
        const active = value.includes(f.id);
        return (
          <button
            key={f.id}
            onClick={() => toggle(f.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all
              ${active
                ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300"
                : "border-[#E5E5E5] dark:border-[#1E3050] bg-white dark:bg-[#162238] text-[#737373] dark:text-[#7A9BBF] hover:border-violet-300 dark:hover:border-violet-700"}`}
          >
            {active && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5l2.5 2.5L8 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {f.label}
          </button>
        );
      })}
    </div>
  );
}

export default function LiveChatSettings({
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

      {/* ── Master Enable ─────────────────────────── */}
      <div className="bg-white dark:bg-[#111D30] rounded-2xl border border-[#E5E5E5] shadow-[0_4px_24px_rgba(23,23,23,0.06)] dark:border-[#1E3050] px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M18 10c0 4.42-3.58 8-8 8a8.37 8.37 0 01-3.33-.68L2 19l1.33-3.82A7.67 7.67 0 012 10C2 5.58 5.58 2 10 2s8 3.58 8 8z" stroke="#10B981" strokeWidth="1.5" strokeLinejoin="round" fill="rgba(16,185,129,0.08)"/>
                <circle cx="16.5" cy="4" r="2.5" fill="#10B981"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#262626] dark:text-[#C8D8EE]">Live Chat Widget</p>
              <p className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF] mt-0.5">Show the chat launcher on embedded pages</p>
            </div>
          </div>
          <Toggle checked={state.liveChatEnabled} onChange={(v) => onChange({ liveChatEnabled: v })} />
        </div>
      </div>

      {/* ── Widget ─────────────────────────────────── */}
      <GroupLabel>Widget</GroupLabel>

      <Section label="Launcher Position" info tooltip="Where the chat button appears on the page">
        <PositionPicker
          value={state.liveChatPosition}
          onChange={(v) => onChange({ liveChatPosition: v })}
        />
      </Section>

      <Section label="Launcher Style" info tooltip="Visual appearance of the chat launcher">
        <LauncherStylePicker
          value={state.liveChatLauncherStyle}
          onChange={(v) => onChange({ liveChatLauncherStyle: v })}
        />
      </Section>

      <Section label="Greeting Bubble" info tooltip="Message shown above the launcher to invite visitors to chat">
        <TextInput
          value={state.liveChatGreeting}
          onChange={(v) => onChange({ liveChatGreeting: v })}
          placeholder="e.g. Hi 👋 Chat with us!"
        />
      </Section>

      <div className="bg-white dark:bg-[#111D30] rounded-2xl border border-[#E5E5E5] shadow-[0_4px_24px_rgba(23,23,23,0.06)] dark:border-[#1E3050] px-5">
        <ToggleRow
          label="Notification badge"
          description="Show an unread count badge on the launcher"
          checked={state.liveChatNotificationBadge}
          onChange={(v) => onChange({ liveChatNotificationBadge: v })}
          last
        />
      </div>

      {/* ── Availability ─────────────────────────── */}
      <GroupLabel>Availability</GroupLabel>

      <Section label="Chat Availability" info tooltip="Control when visitors can start a chat">
        <RadioGroup
          options={[
            { value: "always",   label: "Always on",         description: "Chat is available 24/7" },
            { value: "schedule", label: "Business hours",    description: "Set a schedule for when chat is live" },
            { value: "manual",   label: "Manually managed",  description: "Toggle availability from your dashboard" },
          ]}
          value={state.liveChatAvailability}
          onChange={(v) => onChange({ liveChatAvailability: v })}
        />
      </Section>

      <Section label="Offline Message" info tooltip="Shown to visitors when chat is unavailable">
        <TextInput
          value={state.liveChatOfflineMessage}
          onChange={(v) => onChange({ liveChatOfflineMessage: v })}
          placeholder="e.g. We're offline right now. Leave a message!"
        />
      </Section>

      {/* ── Notifications ─────────────────────────── */}
      <GroupLabel>Notifications</GroupLabel>

      <div className="bg-white dark:bg-[#111D30] rounded-2xl border border-[#E5E5E5] shadow-[0_4px_24px_rgba(23,23,23,0.06)] dark:border-[#1E3050] px-5">
        <ToggleRow
          label="Message sound"
          description="Play a sound when a new message arrives"
          checked={state.liveChatSound}
          onChange={(v) => onChange({ liveChatSound: v })}
          last
        />
      </div>

      {/* ── Lead Capture ──────────────────────────── */}
      <GroupLabel>Lead Capture</GroupLabel>

      <div className="bg-white dark:bg-[#111D30] rounded-2xl border border-[#E5E5E5] shadow-[0_4px_24px_rgba(23,23,23,0.06)] dark:border-[#1E3050] px-5 py-4">
        <div className="flex items-start justify-between gap-4 mb-0">
          <div>
            <div className="flex items-center gap-2">
              <SettingsIcon />
              <span className="text-sm font-semibold text-[#404040] dark:text-[#C8D8EE]">Pre-chat Form</span>
              <InfoIcon tooltip="Collect visitor info before they start chatting" />
            </div>
            <p className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF] mt-1.5 ml-6">
              Ask for contact details before the first message
            </p>
          </div>
          <Toggle checked={state.liveChatLeadCapture} onChange={(v) => onChange({ liveChatLeadCapture: v })} />
        </div>
        {state.liveChatLeadCapture && (
          <div className="border-t border-[#F5F5F5] dark:border-[#1E3050] mt-4 pt-4">
            <p className="text-xs font-medium text-[#737373] dark:text-[#7A9BBF] mb-2.5">Fields to collect</p>
            <LeadFieldsSelector
              value={state.liveChatLeadFields}
              onChange={(v) => onChange({ liveChatLeadFields: v })}
            />
          </div>
        )}
      </div>

      {/* ── Privacy & Compliance ──────────────────── */}
      <GroupLabel>Privacy & Compliance</GroupLabel>

      <div className="bg-white dark:bg-[#111D30] rounded-2xl border border-[#E5E5E5] shadow-[0_4px_24px_rgba(23,23,23,0.06)] dark:border-[#1E3050] px-5">
        <ToggleRow
          label="Privacy consent notice"
          description="Show a GDPR-style consent prompt before chatting"
          checked={state.liveChatPrivacyNotice}
          onChange={(v) => onChange({ liveChatPrivacyNotice: v })}
        />
        {state.liveChatPrivacyNotice && (
          <div className="pb-4">
            <p className="text-xs font-medium text-[#737373] dark:text-[#7A9BBF] mb-2">Privacy policy URL</p>
            <TextInput
              value={state.liveChatPrivacyUrl}
              onChange={(v) => onChange({ liveChatPrivacyUrl: v })}
              placeholder="https://example.com/privacy"
            />
          </div>
        )}
        <ToggleRow
          label="Email transcript"
          description="Offer to send a chat transcript to the visitor"
          checked={state.liveChatEmailTranscript}
          onChange={(v) => onChange({ liveChatEmailTranscript: v })}
          last
        />
      </div>

      {/* ── Human Handoff ─────────────────────────── */}
      <GroupLabel>Human Handoff</GroupLabel>

      <div className="bg-white dark:bg-[#111D30] rounded-2xl border border-[#E5E5E5] shadow-[0_4px_24px_rgba(23,23,23,0.06)] dark:border-[#1E3050] px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <SettingsIcon />
              <span className="text-sm font-semibold text-[#404040] dark:text-[#C8D8EE]">Escalate to Human</span>
              <InfoIcon tooltip="Route unresolved conversations to a live agent" />
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold leading-none bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                Enterprise
              </span>
            </div>
            <p className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF] mt-1.5 ml-6">
              Transfer the chat to a human agent when the AI can&apos;t help
            </p>
          </div>
          <Toggle checked={state.liveChatHumanHandoff} onChange={(v) => onChange({ liveChatHumanHandoff: v })} />
        </div>
        {state.liveChatHumanHandoff && (
          <div className="border-t border-[#F5F5F5] dark:border-[#1E3050] mt-4 pt-4 space-y-3">
            <div>
              <p className="text-xs font-medium text-[#737373] dark:text-[#7A9BBF] mb-1.5">Trigger phrase</p>
              <TextInput
                value={state.liveChatHandoffTrigger}
                onChange={(v) => onChange({ liveChatHandoffTrigger: v })}
                placeholder='e.g. "talk to a person"'
              />
            </div>
            <div>
              <p className="text-xs font-medium text-[#737373] dark:text-[#7A9BBF] mb-1.5">Notification email</p>
              <TextInput
                value={state.liveChatHandoffEmail}
                onChange={(v) => onChange({ liveChatHandoffEmail: v })}
                placeholder="e.g. support@example.com"
              />
            </div>
          </div>
        )}
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
