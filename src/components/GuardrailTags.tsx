"use client";

import { useState } from "react";
import { GUARDRAIL_PRESETS } from "./types";

interface GuardrailTagsProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function GuardrailTags({ selected, onChange }: GuardrailTagsProps) {
  const [customInput, setCustomInput] = useState("");
  const [showInput, setShowInput] = useState(false);

  const toggle = (guardrail: string) => {
    if (selected.includes(guardrail)) {
      onChange(selected.filter((g) => g !== guardrail));
    } else {
      onChange([...selected, guardrail]);
    }
  };

  const addCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed && !selected.includes(trimmed)) {
      onChange([...selected, trimmed]);
    }
    setCustomInput("");
    setShowInput(false);
  };

  const isCustom = (g: string) => !GUARDRAIL_PRESETS.includes(g);
  const customGuardrails = selected.filter(isCustom);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label id="guardrails-label" className="text-sm font-semibold text-[#2F3D39] dark:text-[#C8D8EE]">
          What should it never do?
        </label>
        {selected.length > 0 && (
          <span className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF]">{selected.length} rule{selected.length !== 1 ? "s" : ""}</span>
        )}
      </div>

      {/* Preset chips */}
      <div className="flex flex-wrap gap-2">
        {GUARDRAIL_PRESETS.map((g) => {
          const isOn = selected.includes(g);
          return (
            <button
              key={g}
              onClick={() => toggle(g)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                ${isOn
                  ? "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
                  : "bg-white dark:bg-[#162238] text-[#737373] dark:text-[#7A9BBF] border-[#E5E5E5] dark:border-[#1E3050] hover:border-red-200 dark:hover:border-red-800 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                }`}
            >
              {isOn ? "✓ " : ""}{g}
            </button>
          );
        })}
      </div>

      {/* Custom guardrails */}
      {customGuardrails.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {customGuardrails.map((g) => (
            <span
              key={g}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200"
            >
              {g}
              <button
                onClick={() => toggle(g)}
                className="text-red-400 hover:text-red-600 transition-colors ml-0.5"
                aria-label={`Remove "${g}"`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Add custom */}
      {showInput ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addCustom();
              if (e.key === "Escape") setShowInput(false);
            }}
            placeholder="e.g. Never recommend competitors"
            autoFocus
            className="flex-1 px-3 py-2 text-xs rounded-lg border border-[#E5E5E5] dark:border-[#1E3050] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 bg-white dark:bg-[#162238] text-[#262626] dark:text-[#C8D8EE] placeholder:text-[#A3A3A3] dark:placeholder:text-[#7A9BBF]"
          />
          <button
            onClick={addCustom}
            className="px-3 py-2 text-xs font-medium bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            Add
          </button>
          <button
            onClick={() => setShowInput(false)}
            className="px-3 py-2 text-xs text-[#737373] dark:text-[#7A9BBF] hover:text-[#404040] dark:hover:text-[#C8D8EE] transition-colors"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowInput(true)}
          className="text-xs text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1"
        >
          <span className="text-base leading-none">+</span> Add custom rule
        </button>
      )}
    </div>
  );
}
