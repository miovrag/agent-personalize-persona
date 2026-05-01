"use client";
import { useState, useRef } from "react";

export const BG_PRESETS: { id: string; label: string; css: string }[] = [
  { id: "chalk",  label: "Chalk",  css: "linear-gradient(160deg,#f9fafb 0%,#f3f4f6 100%)" },
  { id: "mist",   label: "Mist",   css: "linear-gradient(160deg,#ede9fe 0%,#e0f2fe 100%)" },
  { id: "blush",  label: "Blush",  css: "linear-gradient(160deg,#fce7f3 0%,#ede9fe 100%)" },
  { id: "rose",   label: "Rose",   css: "linear-gradient(160deg,#fff1f2 0%,#fce7f3 100%)" },
  { id: "ocean",  label: "Ocean",  css: "linear-gradient(160deg,#0ea5e9 0%,#6366f1 100%)" },
  { id: "aurora", label: "Aurora", css: "linear-gradient(160deg,#7c3aed 0%,#db2777 50%,#f59e0b 100%)" },
  { id: "dusk",   label: "Dusk",   css: "linear-gradient(160deg,#1e1b4b 0%,#4c1d95 100%)" },
  { id: "carbon", label: "Carbon", css: "linear-gradient(160deg,#111827 0%,#1f2937 100%)" },
  { id: "forest", label: "Forest", css: "linear-gradient(160deg,#064e3b 0%,#065f46 100%)" },
  { id: "golden", label: "Golden", css: "linear-gradient(160deg,#92400e 0%,#d97706 100%)" },
  { id: "slate",  label: "Slate",  css: "linear-gradient(160deg,#0f172a 0%,#334155 100%)" },
  { id: "mesh",   label: "Mesh",   css: "radial-gradient(ellipse at 20% 20%,#a78bfa 0%,transparent 50%),radial-gradient(ellipse at 80% 80%,#38bdf8 0%,transparent 50%),#1e1b4b" },
];

export function BgImagePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [modalOpen, setModalOpen] = useState(false);
  const uploadRef = useRef<HTMLInputElement>(null);

  const activePreset = value.startsWith("preset:") ? BG_PRESETS.find(p => `preset:${p.id}` === value) : null;
  const isCustom = value && !value.startsWith("preset:");

  const previewStyle: React.CSSProperties = activePreset
    ? { background: activePreset.css }
    : isCustom
      ? { backgroundImage: `url(${value})`, backgroundSize: "cover", backgroundPosition: "center" }
      : { background: "#F5F5F5" };

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange(URL.createObjectURL(file));
    e.target.value = "";
    setModalOpen(false);
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setModalOpen(true)}
          className="w-14 h-9 rounded-lg border border-[#E5E5E5] dark:border-[#1E3050] shrink-0 hover:ring-2 hover:ring-violet-400 transition-all duration-150 overflow-hidden"
          style={previewStyle}
        />
        <button
          onClick={() => setModalOpen(true)}
          className="flex-1 text-left text-sm text-[#404040] dark:text-[#C8D8EE] truncate hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
        >
          {activePreset ? activePreset.label : isCustom ? "Custom image" : "None"}
        </button>
        <button
          onClick={() => setModalOpen(true)}
          className="shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#E5E5E5] dark:border-[#1E3050] bg-white dark:bg-[#162238] text-[#404040] dark:text-[#C8D8EE] hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
        >
          Change
        </button>
        {value && (
          <button
            onClick={() => onChange("")}
            className="shrink-0 p-1.5 rounded-lg text-[#A3A3A3] hover:text-[#737373] dark:text-[#7A9BBF] dark:hover:text-[#C8D8EE] transition-colors"
            title="Clear"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        )}
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div className="bg-white dark:bg-[#111D30] rounded-2xl border border-[#E5E5E5] dark:border-[#1E3050] shadow-[0_8px_32px_rgba(23,23,23,0.14)] w-80 p-5 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#262626] dark:text-[#C8D8EE]">Choose Background</h3>
              <button onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-[#A3A3A3] hover:text-[#404040] dark:hover:text-[#C8D8EE] hover:bg-[#F5F5F5] dark:hover:bg-[#1E3050] transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {BG_PRESETS.map((preset) => {
                const active = value === `preset:${preset.id}`;
                return (
                  <button key={preset.id} onClick={() => { onChange(`preset:${preset.id}`); setModalOpen(false); }}
                    title={preset.label}
                    className={`relative h-12 rounded-lg overflow-hidden transition-all duration-150 ${active ? "ring-2 ring-violet-600 ring-offset-1" : "ring-1 ring-[#E5E5E5] dark:ring-[#1E3050] hover:ring-2 hover:ring-violet-400"}`}
                    style={{ background: preset.css }}
                  >
                    {active && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
              <button onClick={() => uploadRef.current?.click()} title="Upload image"
                className={`relative h-12 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-0.5 transition-all duration-150 ${isCustom ? "border-violet-400 ring-2 ring-violet-600 ring-offset-1" : "border-[#E5E5E5] dark:border-[#1E3050] hover:border-violet-400"}`}
                style={isCustom ? { backgroundImage: `url(${value})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
              >
                {!isCustom && (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#A3A3A3]">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <span className="text-[9px] font-medium text-[#A3A3A3]">Upload</span>
                  </>
                )}
                {isCustom && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </span>
                )}
              </button>
            </div>
            <p className="text-[10px] text-[#A3A3A3] dark:text-[#7A9BBF]">Click a preset or upload your own image</p>
          </div>
        </div>
      )}
      <input ref={uploadRef} type="file" accept="image/*" className="sr-only" onChange={handleUpload} />
    </>
  );
}
