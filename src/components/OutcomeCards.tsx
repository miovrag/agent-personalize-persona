"use client";

import { useState } from "react";
import { OUTCOME_OPTIONS } from "./types";

interface OutcomeCardsProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function OutcomeCards({ selected, onChange }: OutcomeCardsProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-semibold text-[#2F3D39] dark:text-[#C8D8EE]">
            What can this agent trigger?
          </label>
          <p className="text-xs text-gray-400 dark:text-[#7A9BBF] mt-0.5">
            Beyond answering — agents can take real actions
          </p>
        </div>
        {selected.length > 0 && (
          <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full">
            {selected.length} active
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {OUTCOME_OPTIONS.map((outcome) => {
          const isOn = selected.includes(outcome.id);
          const isExpanded = expanded === outcome.id;

          return (
            <div
              key={outcome.id}
              className={`rounded-xl border transition-all overflow-hidden
                ${isOn
                  ? "border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950"
                  : "border-gray-200 dark:border-[#1E3050] bg-white dark:bg-[#111D30] hover:border-gray-300 dark:hover:border-[#1E3050]"
                }`}
            >
              <button
                onClick={() => setExpanded(isExpanded ? null : outcome.id)}
                className="w-full text-left px-3 py-2.5 flex items-start gap-2.5"
              >
                <span className="text-lg leading-none mt-0.5 select-none">{outcome.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold leading-tight ${isOn ? "text-violet-800 dark:text-violet-300" : "text-gray-700 dark:text-[#C8D8EE]"}`}>
                    {outcome.label}
                  </p>
                  {isExpanded && (
                    <p className="text-xs text-gray-500 dark:text-[#7A9BBF] mt-1 leading-relaxed">
                      {outcome.description}
                    </p>
                  )}
                </div>
                <span className="text-gray-300 dark:text-[#2a4060] text-xs mt-0.5 shrink-0">
                  {isExpanded ? "▲" : "▼"}
                </span>
              </button>

              {isExpanded && (
                <div className="px-3 pb-2.5 pt-0">
                  <button
                    onClick={() => {
                      toggle(outcome.id);
                      setExpanded(null);
                    }}
                    className={`w-full py-1.5 rounded-lg text-xs font-semibold transition-colors
                      ${isOn
                        ? "bg-white dark:bg-[#111D30] text-red-500 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950"
                        : "bg-violet-600 text-white hover:bg-violet-700"
                      }`}
                  >
                    {isOn ? "Remove" : "Enable this outcome"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
