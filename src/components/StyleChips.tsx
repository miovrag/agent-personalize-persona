"use client";

import { STYLE_OPTIONS } from "./types";

interface StyleChipsProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function StyleChips({ selected, onChange }: StyleChipsProps) {
  const toggle = (style: string) => {
    if (selected.includes(style)) {
      onChange(selected.filter((s) => s !== style));
    } else if (selected.length < 3) {
      onChange([...selected, style]);
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label id="style-chips-label" className="text-sm font-semibold text-[#2F3D39] dark:text-[#C8D8EE]">
          Communication qualities
        </label>
        <span className="text-xs text-gray-400 dark:text-[#7A9BBF]">
          {selected.length}/3 selected
        </span>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-labelledby="style-chips-label">
        {STYLE_OPTIONS.map((style) => {
          const isSelected = selected.includes(style);
          const isDisabled = !isSelected && selected.length >= 3;

          return (
            <button
              key={style}
              onClick={() => toggle(style)}
              disabled={isDisabled}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all select-none
                ${isSelected
                  ? "bg-gray-900 dark:bg-[#C8D8EE] text-white dark:text-[#0B1426] border-gray-900 dark:border-[#C8D8EE] shadow-sm"
                  : isDisabled
                  ? "bg-gray-50 dark:bg-[#0B1426] text-gray-300 dark:text-[#2a4060] border-gray-100 dark:border-[#1E3050] cursor-not-allowed"
                  : "bg-white dark:bg-[#162238] text-gray-600 dark:text-[#7A9BBF] border-gray-200 dark:border-[#1E3050] hover:border-gray-900 dark:hover:border-[#C8D8EE] hover:text-gray-900 dark:hover:text-[#C8D8EE] hover:bg-gray-50 dark:hover:bg-[#1E3050]"
                }`}
            >
              {style}
            </button>
          );
        })}
      </div>

      {selected.length === 3 && (
        <p className="text-xs text-gray-400 dark:text-[#7A9BBF]">
          Maximum 3 qualities selected. Deselect one to change.
        </p>
      )}
    </div>
  );
}
