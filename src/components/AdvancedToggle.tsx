"use client";

import { useState, useEffect } from "react";

interface AdvancedToggleProps {
  instruction: string;
  onEdit: (text: string) => void;
  hasCustomEdit: boolean;
}

export default function AdvancedToggle({ instruction, onEdit, hasCustomEdit }: AdvancedToggleProps) {
  const [open, setOpen] = useState(true);
  const [localText, setLocalText] = useState(instruction);
  const [showConflictWarning, setShowConflictWarning] = useState(false);

  useEffect(() => {
    if (!hasCustomEdit) {
      setLocalText(instruction);
    } else if (localText !== instruction) {
      setShowConflictWarning(true);
    }
  }, [instruction]);

  const handleEdit = (text: string) => {
    setLocalText(text);
    setShowConflictWarning(false);
    onEdit(text);
  };

  return (
    <div className="border border-[#E5E5E5] dark:border-[#1E3050] rounded-xl overflow-hidden bg-white dark:bg-[#111D30]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-[#525252] dark:text-[#7A9BBF] hover:text-[#262626] dark:hover:text-[#C8D8EE] hover:bg-[#FAFAFA] dark:hover:bg-[#1E3050] transition-colors"
      >
        <span className="flex items-center gap-2">
          <span className="text-[#A3A3A3] dark:text-[#7A9BBF]">⌨</span>
          Edit raw instructions
          {hasCustomEdit && (
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-normal">
              Manually edited
            </span>
          )}
        </span>
        <span className={`text-[#A3A3A3] dark:text-[#7A9BBF] text-xs transition-transform ${open ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      {open && (
        <div className="border-t border-[#F5F5F5] dark:border-[#1E3050] p-4 space-y-3">
          {showConflictWarning && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
              <span className="mt-0.5">⚠</span>
              <div>
                <p className="font-medium">Controls updated your instructions</p>
                <p className="mt-0.5 text-amber-600">
                  The structured controls above regenerated the text. Your manual edits have been replaced.
                </p>
              </div>
            </div>
          )}

          <textarea
            value={localText}
            onChange={(e) => handleEdit(e.target.value)}
            rows={12}
            className="w-full px-3 py-3 text-xs font-mono rounded-lg border border-[#E5E5E5] dark:border-[#1E3050] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 bg-[#FAFAFA] dark:bg-[#162238] resize-none leading-relaxed text-[#404040] dark:text-[#C8D8EE]"
            spellCheck={false}
          />

          <div className="flex items-center justify-between">
            <p className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF]">
              {localText.length} characters
            </p>
            <button
              onClick={() => {
                setLocalText(instruction);
                onEdit(instruction);
                setShowConflictWarning(false);
              }}
              className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF] hover:text-[#525252] dark:hover:text-[#C8D8EE] transition-colors"
            >
              Reset to generated
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
