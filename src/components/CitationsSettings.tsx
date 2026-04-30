"use client";

import { useState } from "react";
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

function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex w-9 h-5 rounded-full transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed
        ${checked ? "bg-violet-600" : "bg-gray-300 dark:bg-[#2A4060]"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4" : "translate-x-0"}`} />
    </button>
  );
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E5E5E5] dark:border-[#1E3050] bg-white dark:bg-[#162238] text-[#262626] dark:text-[#C8D8EE] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 placeholder:text-[#A3A3A3] dark:placeholder:text-[#7A9BBF] transition-all"
    />
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-[#111D30] rounded-2xl border border-[#E5E5E5] shadow-[0_4px_24px_rgba(23,23,23,0.06)] dark:border-[#1E3050] overflow-hidden px-5 py-5">
      {children}
    </div>
  );
}

function SectionTitle({ children, info, tooltip }: { children: React.ReactNode; info?: boolean; tooltip?: string }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <span className="text-sm font-semibold text-[#262626] dark:text-[#C8D8EE]">{children}</span>
      {info && <InfoIcon tooltip={tooltip} />}
    </div>
  );
}

function SectionDesc({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF] mb-4">{children}</p>;
}

function ToggleRow({
  label,
  checked,
  onChange,
  disabled,
  info,
  tooltip,
  indent,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  info?: boolean;
  tooltip?: string;
  indent?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between gap-3 ${indent ? "pl-6" : ""}`}>
      <div className="flex items-center gap-1.5 min-w-0">
        <span className={`text-sm ${disabled ? "text-[#A3A3A3] dark:text-[#7A9BBF]" : "text-[#404040] dark:text-[#C8D8EE]"}`}>{label}</span>
        {info && <InfoIcon tooltip={tooltip} />}
      </div>
      <Toggle checked={checked} onChange={onChange} disabled={disabled} />
    </div>
  );
}

function SubDesc({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF] mt-1 pl-6">{children}</p>;
}

function Divider() {
  return <div className="border-t border-[#F5F5F5] dark:border-[#1E3050] my-4" />;
}

export default function CitationsSettings({
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

      {/* Citation Settings */}
      <SectionCard>
        <SectionTitle info tooltip="Configure how your agent references and displays source information">Citation Settings</SectionTitle>
        <SectionDesc>Control how your agent references and displays source information in its responses.</SectionDesc>
        <ToggleRow
          label="Enable Citations"
          checked={state.enableCitations}
          onChange={(v) => onChange({ enableCitations: v })}
        />
        <div className="mt-2 pl-6 space-y-1">
          <p className="text-xs text-[#737373] dark:text-[#7A9BBF]">When enabled, the agent can access and reference source titles and URLs.</p>
          <p className="text-xs text-[#737373] dark:text-[#7A9BBF]">When disabled, the agent only sees content without source metadata.</p>
        </div>
      </SectionCard>

      {/* Citation Types */}
      <SectionCard>
        <SectionTitle info tooltip="Choose between numbered inline or classic footnote-style citations">Citation Types</SectionTitle>
        <SectionDesc>Select which citation formats to use.</SectionDesc>

        {/* Numbered references */}
        <ToggleRow
          label="Numbered references (inline citations)"
          checked={state.numberedCitations}
          onChange={(v) => onChange({ numberedCitations: v })}
          disabled={!state.enableCitations}
        />

        {state.numberedCitations && state.enableCitations && (
          <div className="mt-3 pl-6 space-y-3">
            {/* Render image citations inline */}
            <ToggleRow
              label="Render image citations inline"
              checked={state.renderImageCitationsInline}
              onChange={(v) => onChange({ renderImageCitationsInline: v })}
            />
            <SubDesc>Display images directly in the chat where the citation appears</SubDesc>

            {/* Limit height */}
            <label className="flex items-center gap-2 cursor-pointer pl-0">
              <div
                onClick={() => onChange({ limitImageCitationHeight: !state.limitImageCitationHeight })}
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 cursor-pointer transition-colors
                  ${state.limitImageCitationHeight ? "border-violet-600 bg-white dark:bg-[#111D30]" : "border-gray-300 dark:border-[#2A4060] bg-white dark:bg-[#111D30]"}`}
              >
                {state.limitImageCitationHeight && <div className="w-2 h-2 rounded-full bg-violet-600" />}
              </div>
              <span className="text-sm text-[#525252] dark:text-[#C8D8EE]">Limit the height of image citation</span>
            </label>

            <Divider />

            {/* OpenGraph */}
            <ToggleRow
              label="Use OpenGraph images for web pages (BETA)"
              checked={state.useOpenGraphImages}
              onChange={(v) => onChange({ useOpenGraphImages: v })}
            />
            <SubDesc>Display the page&apos;s preview image instead of a text citation</SubDesc>

            <Divider />

            {/* Max images */}
            <div>
              <p className="text-sm text-[#404040] dark:text-[#C8D8EE] mb-2">Maximum images per response</p>
              <div className="flex items-center gap-4">
                {(["1", "2", "3", "unlimited"] as const).map((opt) => (
                  <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                    <div
                      onClick={() => onChange({ maxImagesPerResponse: opt })}
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 cursor-pointer transition-colors
                        ${state.maxImagesPerResponse === opt ? "border-violet-600 bg-white dark:bg-[#111D30]" : "border-gray-300 dark:border-[#2A4060] bg-white dark:bg-[#111D30]"}`}
                    >
                      {state.maxImagesPerResponse === opt && <div className="w-2 h-2 rounded-full bg-violet-600" />}
                    </div>
                    <span className="text-sm text-[#404040] dark:text-[#C8D8EE] capitalize">{opt === "unlimited" ? "Unlimited" : opt}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF] mt-2">
                Only the set number of images or OpenGraph images will be rendered. Additional images will appear as regular numbered citations.
              </p>
            </div>
          </div>
        )}

        <Divider />

        {/* Classic citations */}
        <ToggleRow
          label="After response (classic citations)"
          checked={state.classicCitations}
          onChange={(v) => onChange({ classicCitations: v })}
          disabled={!state.enableCitations}
        />

        {state.classicCitations && state.enableCitations && (
          <div className="mt-4 pl-6 space-y-4">
            <div>
              <p className="text-xs text-[#737373] dark:text-[#7A9BBF] mb-1.5">Citation header</p>
              <TextInput
                value={state.citationHeader}
                onChange={(v) => onChange({ citationHeader: v })}
                placeholder="e.g. Where does this answer come from?"
              />
            </div>
            <div>
              <p className="text-xs text-[#737373] dark:text-[#7A9BBF] mb-1.5">Citation label</p>
              <TextInput
                value={state.citationLabel}
                onChange={(v) => onChange({ citationLabel: v })}
                placeholder="e.g. Sources"
              />
            </div>
            <div>
              <p className="text-xs text-[#737373] dark:text-[#7A9BBF] mb-1.5">Initial display state</p>
              <div className="relative">
                <select
                  value={state.citationDisplayState}
                  onChange={(e) => onChange({ citationDisplayState: e.target.value as "opened" | "closed" })}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E5E5E5] dark:border-[#1E3050] bg-white dark:bg-[#162238] text-[#262626] dark:text-[#C8D8EE] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 appearance-none cursor-pointer transition-all"
                >
                  <option value="opened">Opened</option>
                  <option value="closed">Closed</option>
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3A3A3] dark:text-[#7A9BBF] pointer-events-none" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        )}
      </SectionCard>

      {/* PDF Citations */}
      <SectionCard>
        <SectionTitle info tooltip="Control how PDF source documents are previewed and accessed">PDF Citations</SectionTitle>
        <div className="space-y-4 mt-1">
          <ToggleRow
            label="Enable PDF Viewer"
            checked={state.enablePdfViewer}
            onChange={(v) => onChange({ enablePdfViewer: v })}
          />
          <ToggleRow
            label="Auto-open PDF Viewer"
            checked={state.autoOpenPdfViewer}
            onChange={(v) => onChange({ autoOpenPdfViewer: v })}
            disabled={!state.enablePdfViewer}
            info
          />
          <ToggleRow
            label="Prevent PDF Download"
            checked={state.preventPdfDownload}
            onChange={(v) => onChange({ preventPdfDownload: v })}
            disabled={!state.enablePdfViewer}
            info
          />
        </div>
      </SectionCard>

      {/* Additional Settings */}
      <SectionCard>
        <SectionTitle>Additional Settings</SectionTitle>
        <div className="space-y-5 mt-2">

          {/* Knowledge base awareness */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <p className="text-xs font-semibold text-[#737373] dark:text-[#7A9BBF] uppercase tracking-wide">Knowledge base awareness</p>
              <InfoIcon tooltip="Enables the agent to search your uploaded documents" />
            </div>
            <ToggleRow
              label="Allow knowledge base queries"
              checked={state.allowKnowledgeBaseQueries}
              onChange={(v) => onChange({ allowKnowledgeBaseQueries: v })}
            />
            <p className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF] mt-1.5 pl-0">Agent can describe what sources and files it has access to</p>
          </div>

          <Divider />

          {/* Numeric search optimization */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <p className="text-xs font-semibold text-[#737373] dark:text-[#7A9BBF] uppercase tracking-wide">Numeric search optimization</p>
              <InfoIcon tooltip="Allows finding content by document page or section number" />
            </div>
            <ToggleRow
              label="Enable numeric search"
              checked={state.enableNumericSearch}
              onChange={(v) => onChange({ enableNumericSearch: v })}
            />
            <p className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF] mt-1.5">Better results when querying for product codes, SKUs, or reference numbers</p>

            {state.enableNumericSearch && (
              <div className="mt-3 space-y-3">
                <div className="px-3 py-2 bg-violet-50 dark:bg-violet-900/20 rounded-lg text-xs text-violet-700 dark:text-violet-300">
                  Improved Numeric Search is <span className="font-semibold">enabled</span> for this agent.
                </div>
                <div className="flex items-start gap-2 p-3 bg-[#FAFAFA] dark:bg-[#162238] rounded-lg border border-[#F5F5F5] dark:border-[#1E3050]">
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-[#2A4060] mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-[#737373] dark:text-[#7A9BBF]">
                      This feature allows more accurate matching on part numbers and alphanumeric codes, and the trade-off is that data sources will take a bit longer to process on every upload and sync. You can learn more in our{" "}
                      <a href="#" className="text-violet-600 dark:text-violet-400 hover:underline">user guide</a>.
                    </p>
                  </div>
                  <span className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF] shrink-0">Enabled</span>
                </div>
              </div>
            )}
          </div>

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
