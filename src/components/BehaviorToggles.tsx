"use client";

import { BEHAVIOR_TOGGLE_OPTIONS } from "./types";

interface Props {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function BehaviorToggles({ selected, onChange }: Props) {
  const toggle = (id: string) => {
    onChange(
      selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]
    );
  };

  return (
    <div className="space-y-2.5">
      <label className="text-sm font-semibold text-[#2F3D39] dark:text-[#C8D8EE]">
        Behavior toggles
      </label>
      <div className="space-y-2">
        {BEHAVIOR_TOGGLE_OPTIONS.map((opt) => {
          const isOn = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              onClick={() => toggle(opt.id)}
              className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border text-sm transition-all text-left
                ${
                  isOn
                    ? "bg-violet-50 dark:bg-violet-950 border-violet-300 dark:border-violet-700 text-violet-800 dark:text-violet-300"
                    : "bg-white dark:bg-[#162238] border-[#E5E5E5] dark:border-[#1E3050] text-[#525252] dark:text-[#7A9BBF] hover:border-violet-200 dark:hover:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-950"
                }`}
            >
              <span>{opt.label}</span>
              {/* Toggle pill */}
              <span className="relative shrink-0" style={{ width: 32, height: 18 }}>
                <span
                  className={`absolute inset-0 rounded-full transition-colors ${
                    isOn ? "bg-violet-600" : "bg-gray-200 dark:bg-[#1E3050]"
                  }`}
                />
                <span
                  className="absolute top-0.5 rounded-full bg-white shadow transition-all"
                  style={{ width: 14, height: 14, left: isOn ? 16 : 2 }}
                />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
