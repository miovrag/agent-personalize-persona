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
        <span className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF]">
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
                  ? "bg-[#FAFAFA] dark:bg-[#0B1426] text-[#D4D4D4] dark:text-[#2a4060] border-[#F5F5F5] dark:border-[#1E3050] cursor-not-allowed"
                  : "bg-white dark:bg-[#162238] text-[#525252] dark:text-[#7A9BBF] border-[#E5E5E5] dark:border-[#1E3050] hover:border-gray-900 dark:hover:border-[#C8D8EE] hover:text-gray-900 dark:hover:text-[#C8D8EE] hover:bg-[#FAFAFA] dark:hover:bg-[#1E3050]"
                }`}
            >
              {style}
            </button>
          );
        })}
      </div>

      {selected.length === 3 && (
        <p className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF]">
          Maximum 3 qualities selected. Deselect one to change.
        </p>
      )}
    </div>
  );
}
