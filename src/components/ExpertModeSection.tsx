"use client";

import { useState } from "react";
import type { PersonaState } from "./types";
import { SYSTEM_SECTIONS, getSystemSectionContent } from "./generateInstruction";

interface Props {
  state: PersonaState;
  onChange: (patch: Partial<PersonaState>) => void;
}

export default function ExpertModeSection({ state, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [warningAccepted, setWarningAccepted] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");

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

      {/* Accordion header */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 12, padding: "12px 16px", background: "transparent", border: "none",
          cursor: "pointer", fontFamily: "inherit",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <i className="ti ti-alert-triangle" style={{ fontSize: 16, color: "var(--ds-error)", flexShrink: 0 }} />
          <span style={{ fontSize: "var(--ds-text-sm)", fontWeight: "var(--ds-fw-semibold)", color: "var(--ds-text-h)" }}>
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
                          {isOverridden && (
                            <button className="ds-action-link ds-action-link-muted" onClick={() => resetSection(key)}>
                              Reset to system
                            </button>
                          )}
                          <button className="ds-action-link ds-action-link-primary" onClick={() => startEdit(key)}>
                            Edit
                          </button>
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
