"use client";

import { useState, useEffect, useRef } from "react";
import type { PersonaState } from "./types";

interface Preset {
  id: string;
  name: string;
  createdAt: number;
  state: PersonaState;
}

const STORAGE_KEY = "persona-presets";

function loadPresets(): Preset[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function savePresets(presets: Preset[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
}

interface PresetManagerProps {
  currentState: PersonaState;
  onLoad: (state: PersonaState) => void;
}

export default function PresetManager({ currentState, onLoad }: PresetManagerProps) {
  const [open, setOpen] = useState(false);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [presetName, setPresetName] = useState("");
  const [savedFlash, setSavedFlash] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPresets(loadPresets());
  }, [open]);

  // Pre-fill name from agent name
  useEffect(() => {
    setPresetName(currentState.agentName || "My Preset");
  }, [currentState.agentName, open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setDeleteConfirm(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSave = () => {
    const name = presetName.trim() || "Untitled Preset";
    const preset: Preset = {
      id: Date.now().toString(),
      name,
      createdAt: Date.now(),
      state: currentState,
    };
    const updated = [preset, ...presets];
    savePresets(updated);
    setPresets(updated);
    setSavedFlash(preset.id);
    setTimeout(() => setSavedFlash(null), 2000);
    setPresetName("");
  };

  const handleLoad = (preset: Preset) => {
    onLoad(preset.state);
    setOpen(false);
  };

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      const updated = presets.filter((p) => p.id !== id);
      savePresets(updated);
      setPresets(updated);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
    }
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium border transition-colors
          ${open
            ? "border-violet-300 text-violet-700 bg-violet-50 dark:bg-violet-950 dark:border-violet-700 dark:text-violet-300"
            : "border-gray-200 dark:border-[#1E3050] text-gray-600 dark:text-[#7A9BBF] bg-white dark:bg-[#111D30] hover:border-gray-300 dark:hover:border-[#1E3050] hover:text-gray-800 dark:hover:text-[#C8D8EE]"
          }`}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 2h10v10.5L7 10l-5 2.5V2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
        Presets
        {presets.length > 0 && (
          <span className="text-[11px] font-bold bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-full leading-none">
            {presets.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[320px] bg-white dark:bg-[#111D30] rounded-2xl border border-gray-200 dark:border-[#1E3050] shadow-xl z-50 overflow-hidden">

          {/* Save new preset */}
          <div className="p-4 border-b border-gray-100 dark:border-[#1E3050]">
            <p className="text-xs font-semibold text-gray-500 dark:text-[#7A9BBF] mb-3">Save current as preset</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                placeholder="Preset name..."
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-[#1E3050] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 bg-white dark:bg-[#162238] text-gray-800 dark:text-[#C8D8EE] placeholder:text-gray-400 dark:placeholder:text-[#7A9BBF]"
              />
              <button
                onClick={handleSave}
                className="px-3.5 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
              >
                Save
              </button>
            </div>
          </div>

          {/* Saved presets list */}
          <div className="max-h-[280px] overflow-y-auto">
            {presets.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-gray-400 dark:text-[#7A9BBF] font-medium">No presets saved yet</p>
                <p className="text-xs text-gray-300 dark:text-[#2a4060] mt-1">Save your current configuration above</p>
              </div>
            ) : (
              <>
                <p className="text-xs font-semibold text-gray-400 dark:text-[#7A9BBF] px-4 pt-3 pb-2">
                  Saved presets
                </p>
                {presets.map((preset) => (
                  <div
                    key={preset.id}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#1E3050] transition-colors border-b border-gray-50 dark:border-[#1E3050] last:border-0
                      ${savedFlash === preset.id ? "bg-emerald-50 dark:bg-emerald-950" : ""}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-[#C8D8EE] truncate">
                        {savedFlash === preset.id ? "✓ " : ""}{preset.name}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-[#7A9BBF] mt-0.5">{formatDate(preset.createdAt)}</p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleLoad(preset)}
                        className="px-2.5 py-1.5 text-xs font-semibold text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-lg transition-colors"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => handleDelete(preset.id)}
                        className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors
                          ${deleteConfirm === preset.id
                            ? "text-white bg-red-500 hover:bg-red-600"
                            : "text-gray-400 dark:text-[#7A9BBF] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                          }`}
                      >
                        {deleteConfirm === preset.id ? "Confirm" : "×"}
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
