"use client";

import { useState } from "react";

const SUGGESTIONS = [
  "Help citizens find information in city records",
  "Support customers with product questions and troubleshooting",
  "Assist employees with HR policies and internal processes",
  "Guide patients through clinic services and appointment booking",
  "Help students navigate course materials and academic resources",
  "Assist clients with legal documentation and case status",
];

interface RoleFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RoleField({ value, onChange }: RoleFieldProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label htmlFor="agent-role" className="text-sm font-semibold text-[#2F3D39]">
          What does this agent do?
        </label>
        {value.trim().length > 0 && (
          <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
            Defined
          </span>
        )}
      </div>

      <div className="relative">
        <textarea
          id="agent-role"
          name="agent-role"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            setFocused(true);
            if (!value.trim()) setShowSuggestions(true);
          }}
          onBlur={() => {
            setFocused(false);
            setTimeout(() => setShowSuggestions(false), 150);
          }}
          placeholder="e.g. Helps citizens find information in city records and official documents"
          rows={3}
          className={`w-full px-3.5 py-3 text-sm rounded-xl border transition-all resize-none outline-none
            ${focused
              ? "border-violet-400 ring-2 ring-violet-100 bg-white"
              : "border-gray-200 bg-white hover:border-gray-300"
            }
            placeholder:text-gray-400 text-gray-800 leading-relaxed`}
        />

        {!value.trim() && !focused && (
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="absolute right-2.5 bottom-2.5 text-xs text-violet-600 hover:text-violet-700 font-medium bg-violet-50 hover:bg-violet-100 px-2 py-1 rounded-lg transition-colors"
          >
            See examples
          </button>
        )}
      </div>

      {showSuggestions && (
        <div className="border border-gray-100 rounded-xl bg-white shadow-md overflow-hidden">
          <p className="text-xs text-gray-500 px-3 pt-2.5 pb-1.5 font-medium border-b border-gray-50">
            Common use cases
          </p>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onMouseDown={() => {
                onChange(s);
                setShowSuggestions(false);
              }}
              className="w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-800 transition-colors border-b border-gray-50 last:border-0"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {value.trim().length > 0 && value.trim().length < 15 && (
        <p className="text-xs text-amber-600 flex items-center gap-1.5">
          <span>⚠</span>
          A more detailed description helps the agent behave more accurately
        </p>
      )}
    </div>
  );
}
