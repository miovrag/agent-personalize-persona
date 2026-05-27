"use client";

import { useState, useEffect } from "react";
import type { PersonaState } from "./types";
import { SYSTEM_SECTIONS, getSystemSectionContent } from "./generateInstruction";

interface Props {
  state: PersonaState;
  onChange: (patch: Partial<PersonaState>) => void;
  primaryPersonaGenerating?: boolean;
  subPersonasGenerating?: boolean;
}

const PRIMARY_STATUSES = [
  "Reading your persona settings…",
  "Analyzing tone and role…",
  "Calibrating behavior rules…",
  "Finalizing primary persona…",
];

const SUB_STATUSES = [
  "Drafting Role & Scope…",
  "Tuning communication style…",
  "Building behavior guardrails…",
  "Setting output format…",
  "Applying finishing touches…",
];

function SpinnerIcon({ size = 12, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"
      style={{ animation: "expert-spin 0.9s linear infinite", flexShrink: 0 }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  );
}


export default function ExpertModeSection({ state, onChange, primaryPersonaGenerating, subPersonasGenerating }: Props) {
  const [open, setOpen] = useState(false);
  const [warningAccepted, setWarningAccepted] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [statusIdx, setStatusIdx] = useState(0);
  const isGenerating = primaryPersonaGenerating || subPersonasGenerating;
  const statuses = primaryPersonaGenerating ? PRIMARY_STATUSES : SUB_STATUSES;

  useEffect(() => {
    if (!isGenerating) { setStatusIdx(0); return; }
    setStatusIdx(0);
    const iv = setInterval(() => setStatusIdx((i) => (i + 1) % statuses.length), 1800);
    return () => clearInterval(iv);
  }, [isGenerating, statuses.length]);

  const overrides = state.subInstructionOverrides ?? {};
  const customizedCount = Object.keys(overrides).length;

  const startEdit = (key: string) => {
    setEditDraft(overrides[key] ?? getSystemSectionContent(key, state));
    setEditingKey(key);
  };

  const saveEdit = (key: string) => {
    const system = getSystemSectionContent(key, state);
    if (editDraft.trim() === system.trim()) {
      const next = { ...overrides };
      delete next[key];
      onChange({ subInstructionOverrides: next });
    } else {
      onChange({ subInstructionOverrides: { ...overrides, [key]: editDraft } });
    }
    setEditingKey(null);
  };

  const resetSection = (key: string) => {
    const next = { ...overrides };
    delete next[key];
    onChange({ subInstructionOverrides: next });
  };

  return (
    <div className="ds-section-card" style={{ borderRadius: "var(--ds-radius-xl)" }}>

      <style>{`
        @keyframes expert-spin { to { transform: rotate(360deg); } }
        @keyframes expert-fade { 0%,100%{opacity:0;transform:translateY(3px)} 15%,85%{opacity:1;transform:translateY(0)} }
        .expert-status-text { animation: expert-fade 1.8s ease-in-out; }
      `}</style>

      {/* Accordion header */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 12, padding: "12px 16px", background: "transparent", border: "none",
          cursor: "pointer", fontFamily: "inherit",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <i className="ti ti-alert-triangle" style={{ fontSize: 16, color: "var(--ds-error)", flexShrink: 0 }} />
          <span style={{ fontSize: "var(--ds-text-sm)", fontWeight: "var(--ds-fw-semibold)", color: "var(--ds-text-h)", flexShrink: 0 }}>
            Expert Mode
          </span>
          {customizedCount > 0 ? (
            <span className="ds-badge ds-badge-customized">{customizedCount} customized</span>
          ) : (
            <span className="ds-badge ds-badge-system">
              <i className="ti ti-cpu" style={{ fontSize: 9 }} />
              System
            </span>
          )}
        </div>
        <i
          className={`ti ti-chevron-down`}
          style={{
            fontSize: 16, color: "var(--ds-text-muted)", flexShrink: 0,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 200ms cubic-bezier(.2,.7,.3,1)",
          }}
        />
      </button>

      {/* Accordion body */}
      {open && (
        <div style={{ borderTop: "1px solid var(--ds-border)" }}>

          {/* Generation status — only visible to experts who opened the accordion */}
          {isGenerating && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderBottom: "1px solid var(--ds-border)" }}>
              <SpinnerIcon size={11} color="var(--ds-text-muted)" />
              <span key={statusIdx} className="expert-status-text" style={{ fontSize: 11, color: "var(--ds-text-muted)" }}>
                {statuses[statusIdx]}
              </span>
            </div>
          )}


          {/* Danger zone warning */}
          {!warningAccepted && (
            <div style={{
              margin: 16, padding: 16, borderRadius: "var(--ds-radius-xl)",
              border: "2px solid var(--ds-error)", background: "var(--ds-error-tint)",
              display: "flex", flexDirection: "column", gap: 12,
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "var(--ds-radius-full)",
                  background: "rgba(234,84,85,.15)", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <i className="ti ti-alert-triangle" style={{ fontSize: 18, color: "var(--ds-error)" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <p style={{ fontSize: "var(--ds-text-sm)", fontWeight: "var(--ds-fw-semibold)", color: "var(--ds-error)", margin: 0 }}>
                    Danger zone
                  </p>
                  <p style={{ fontSize: 13, color: "var(--ds-error)", opacity: 0.8, margin: 0, lineHeight: "var(--ds-lh-normal)" }}>
                    These settings directly override the system-generated instruction sections.
                    Incorrect edits can break your agent's behavior. Each section can be reset to its system default at any time.
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button className="ds-btn ds-btn-ghost ds-btn-sm" onClick={() => setOpen(false)}>Cancel</button>
                <button className="ds-btn ds-btn-destructive ds-btn-sm" onClick={() => setWarningAccepted(true)}>
                  I understand, show settings
                </button>
              </div>
            </div>
          )}

          {/* Section cards */}
          {warningAccepted && (
            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
              {SYSTEM_SECTIONS.map(({ key, label, description }) => {
                const isOverridden = key in overrides;
                const systemContent = getSystemSectionContent(key, state);
                const displayContent = isOverridden ? overrides[key]! : systemContent;
                const isEmpty = !displayContent.trim();
                const isEditing = editingKey === key;

                return (
                  <div
                    key={key}
                    className={`ds-section-card${isOverridden ? " is-customized" : ""}`}
                    style={{ opacity: primaryPersonaGenerating ? 0.45 : 1, pointerEvents: primaryPersonaGenerating ? "none" : "auto", transition: "opacity 0.3s" }}
                  >
                    <div className="ds-section-card-header">
                      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                        <span className="ds-section-card-label">{label}</span>
                        {isOverridden && (
                          <span className="ds-badge ds-badge-customized">
                            <i className="ti ti-pencil" style={{ fontSize: 9 }} />
                            Customized
                          </span>
                        )}
                      </div>
                      {!isEditing && (
                        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                          {subPersonasGenerating ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                              <SpinnerIcon size={12} color="var(--ds-text-muted)" />
                              <span style={{ fontSize: "var(--ds-text-xs)", color: "var(--ds-text-muted)" }}>Generating</span>
                            </div>
                          ) : (
                            <>
                              {isOverridden && (
                                <button className="ds-action-link ds-action-link-muted" onClick={() => resetSection(key)}>
                                  Reset to system
                                </button>
                              )}
                              <button className="ds-action-link ds-action-link-primary" onClick={() => startEdit(key)}>
                                Edit
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="ds-section-card-edit-area">
                        <textarea
                          className="ds-section-card-textarea"
                          value={editDraft}
                          onChange={(e) => setEditDraft(e.target.value)}
                          rows={7}
                          autoFocus
                        />
                        <div className="ds-section-card-actions">
                          <button className="ds-btn ds-btn-sm ds-btn-primary" onClick={() => saveEdit(key)}>Save</button>
                          <button className="ds-btn ds-btn-sm ds-btn-ghost" onClick={() => setEditingKey(null)}>Cancel</button>
                          <span className="ds-section-card-hint">{description}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="ds-section-card-body">
                        {isEmpty
                          ? <p className="ds-section-card-empty">Not applicable with current settings</p>
                          : <p className="ds-section-card-pre">{displayContent}</p>
                        }
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
