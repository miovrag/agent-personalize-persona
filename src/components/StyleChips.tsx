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
        <label className="text-sm font-semibold text-gray-800">
          Communication qualities
        </label>
        <span className="text-xs text-gray-400">
          {selected.length}/3 selected
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
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
                  ? "bg-gray-900 text-white border-gray-900 shadow-sm"
                  : isDisabled
                  ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-900 hover:text-gray-900 hover:bg-gray-50"
                }`}
            >
              {style}
            </button>
          );
        })}
      </div>

      {selected.length === 3 && (
        <p className="text-xs text-gray-400">
          Maximum 3 qualities selected. Deselect one to change.
        </p>
      )}
    </div>
  );
}
