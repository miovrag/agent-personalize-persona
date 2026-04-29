"use client";

import { useState } from "react";
import { OUTCOME_OPTIONS } from "./types";

interface CustomOutcome {
  id: string;
  icon: string;
  label: string;
  description: string;
}

interface OutcomeCardsProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function OutcomeCards({ selected, onChange }: OutcomeCardsProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [customOutcomes, setCustomOutcomes] = useState<CustomOutcome[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newIcon, setNewIcon] = useState("⚡");

  const ICON_OPTIONS = ["⚡", "🔔", "📤", "💬", "🔗", "🛠️", "📊", "🚀", "💡", "🎯"];

  const createCustomOutcome = () => {
    const trimmedLabel = newLabel.trim();
    if (!trimmedLabel) return;
    const id = `custom_${Date.now()}`;
    const outcome: CustomOutcome = {
      id,
      icon: newIcon,
      label: trimmedLabel,
      description: newDescription.trim(),
    };
    setCustomOutcomes((prev) => [...prev, outcome]);
    onChange([...selected, id]);
    setNewLabel("");
    setNewDescription("");
    setNewIcon("⚡");
    setShowCreateForm(false);
  };

  const deleteCustomOutcome = (id: string) => {
    setCustomOutcomes((prev) => prev.filter((o) => o.id !== id));
    onChange(selected.filter((s) => s !== id));
  };

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const allOutcomes = [...OUTCOME_OPTIONS, ...customOutcomes];

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-semibold text-[#2F3D39] dark:text-[#C8D8EE]">
            What can this agent trigger?
          </label>
          <p className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF] mt-0.5">
            Beyond answering — agents can take real actions
          </p>
        </div>
        {selected.length > 0 && (
          <span className="text-xs font-medium text-violet-600 bg-violet-50 dark:bg-violet-950 dark:text-violet-300 px-2.5 py-1 rounded-full">
            {selected.length} active
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {allOutcomes.map((outcome) => {
          const isOn = selected.includes(outcome.id);
          const isExpanded = expanded === outcome.id;
          const isCustom = customOutcomes.some((c) => c.id === outcome.id);

          return (
            <div
              key={outcome.id}
              className={`rounded-xl border transition-all overflow-hidden
                ${isOn
                  ? "border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950"
                  : "border-[#E5E5E5] dark:border-[#1E3050] bg-white dark:bg-[#111D30] hover:border-gray-300 dark:hover:border-[#1E3050]"
                }`}
            >
              <button
                onClick={() => setExpanded(isExpanded ? null : outcome.id)}
                className="w-full text-left px-3 py-2.5 flex items-start gap-2.5"
              >
                <span className="text-lg leading-none mt-0.5 select-none">{outcome.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className={`text-xs font-semibold leading-tight ${isOn ? "text-violet-800 dark:text-violet-300" : "text-[#404040] dark:text-[#C8D8EE]"}`}>
                      {outcome.label}
                    </p>
                    {isCustom && (
                      <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-[#F5F5F5] dark:bg-[#162238] text-[#A3A3A3] dark:text-[#7A9BBF]">
                        custom
                      </span>
                    )}
                  </div>
                  {isExpanded && outcome.description && (
                    <p className="text-xs text-[#737373] dark:text-[#7A9BBF] mt-1 leading-relaxed">
                      {outcome.description}
                    </p>
                  )}
                </div>
                <span className="text-[#D4D4D4] dark:text-[#2a4060] text-xs mt-0.5 shrink-0">
                  {isExpanded ? "▲" : "▼"}
                </span>
              </button>

              {isExpanded && (
                <div className="px-3 pb-2.5 pt-0 flex gap-2">
                  <button
                    onClick={() => {
                      toggle(outcome.id);
                      setExpanded(null);
                    }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors
                      ${isOn
                        ? "bg-white dark:bg-[#111D30] text-red-500 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950"
                        : "bg-violet-600 text-white hover:bg-violet-700"
                      }`}
                  >
                    {isOn ? "Remove" : "Enable this outcome"}
                  </button>
                  {isCustom && (
                    <button
                      onClick={() => {
                        deleteCustomOutcome(outcome.id);
                        setExpanded(null);
                      }}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-400 hover:text-red-600 dark:hover:text-red-300 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                      title="Delete outcome"
                    >
                      🗑
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create custom outcome */}
      {showCreateForm ? (
        <div className="border border-violet-200 dark:border-violet-800 rounded-xl p-4 space-y-3 bg-violet-50 dark:bg-violet-950">
          <p className="text-xs font-semibold text-violet-700 dark:text-violet-300">New custom outcome</p>

          {/* Icon picker */}
          <div className="space-y-1">
            <p className="text-xs text-[#737373] dark:text-[#7A9BBF]">Icon</p>
            <div className="flex gap-1.5 flex-wrap">
              {ICON_OPTIONS.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setNewIcon(icon)}
                  className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all
                    ${newIcon === icon
                      ? "bg-violet-600 ring-2 ring-violet-400"
                      : "bg-white dark:bg-[#162238] border border-[#E5E5E5] dark:border-[#1E3050] hover:border-violet-300 dark:hover:border-violet-700"
                    }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-[#737373] dark:text-[#7A9BBF]">Label <span className="text-red-400">*</span></p>
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") createCustomOutcome(); if (e.key === "Escape") setShowCreateForm(false); }}
              placeholder="e.g. Log to spreadsheet"
              autoFocus
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E5] dark:border-[#1E3050] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 bg-white dark:bg-[#162238] text-[#262626] dark:text-[#C8D8EE] placeholder:text-[#A3A3A3] dark:placeholder:text-[#7A9BBF]"
            />
          </div>

          <div className="space-y-1">
            <p className="text-xs text-[#737373] dark:text-[#7A9BBF]">Description <span className="text-[#A3A3A3]">(optional)</span></p>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="What does this outcome do?"
              className="w-full px-3 py-2 text-xs rounded-lg border border-[#E5E5E5] dark:border-[#1E3050] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 bg-white dark:bg-[#162238] text-[#262626] dark:text-[#C8D8EE] placeholder:text-[#A3A3A3] dark:placeholder:text-[#7A9BBF]"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={createCustomOutcome}
              disabled={!newLabel.trim()}
              className="flex-1 py-2 text-xs font-semibold bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Create outcome
            </button>
            <button
              onClick={() => { setShowCreateForm(false); setNewLabel(""); setNewDescription(""); setNewIcon("⚡"); }}
              className="px-4 py-2 text-xs text-[#737373] dark:text-[#7A9BBF] hover:text-[#404040] dark:hover:text-[#C8D8EE] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowCreateForm(true)}
          className="text-xs text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1"
        >
          <span className="text-base leading-none">+</span> Create custom outcome
        </button>
      )}
    </div>
  );
}
