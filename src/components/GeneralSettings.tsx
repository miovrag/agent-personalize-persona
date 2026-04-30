"use client";

import { useRef, useState, useEffect, useLayoutEffect } from "react";
import type { PersonaState } from "./types";
import { AGENT_ROLE_OPTIONS } from "./types";
import { PRESET_AVATARS, getInitials, InitialsAvatar } from "./avatarPresets";

const AGENT_ROLE_DESCRIPTIONS: Record<string, string> = {
  "Enterprise Search": "Helps employees find information across internal documents, wikis, and knowledge bases quickly.",
  "Customer Support": "Answers customer questions, resolves common issues, and escalates complex cases to human agents.",
  "Sales Assistant": "Guides prospects through your product offering, handles objections, and qualifies leads.",
  "HR Assistant": "Supports employees with HR policies, onboarding, benefits, and common people-ops questions.",
  "Knowledge Base": "Acts as a self-service hub for structured documentation, FAQs, and reference material.",
  "Product Guide": "Walks users through product features, setup steps, and best practices to drive adoption.",
  "Legal Assistant": "Surfaces relevant clauses, policies, and legal documents — always with appropriate disclaimers.",
  "IT Helpdesk": "Troubleshoots technical issues, guides users through fixes, and logs tickets when needed.",
};

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[#A3A3A3] dark:text-[#7A9BBF]">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[#A3A3A3] dark:text-[#7A9BBF]">
    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M7 6v4M7 4.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

function RadioGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
          <div
            onClick={() => onChange(opt.value)}
            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer
              ${value === opt.value
                ? "border-violet-600 bg-white dark:bg-[#111D30]"
                : "border-gray-300 dark:border-[#2A4060] bg-white dark:bg-[#111D30]"
              }`}
          >
            {value === opt.value && (
              <div className="w-2 h-2 rounded-full bg-violet-600" />
            )}
          </div>
          <span
            onClick={() => onChange(opt.value)}
            className={`text-sm transition-colors cursor-pointer
              ${value === opt.value
                ? "text-[#262626] dark:text-[#C8D8EE] font-medium"
                : "text-[#737373] dark:text-[#7A9BBF] group-hover:text-[#404040] dark:group-hover:text-[#C8D8EE]"
              }`}
          >
            {opt.label}
          </span>
        </label>
      ))}
    </div>
  );
}

// --- Color utilities ---
function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  return [parseInt(clean.slice(0, 2), 16), parseInt(clean.slice(2, 4), 16), parseInt(clean.slice(4, 6), 16)];
}
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, '0')).join('');
}
function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d) switch (max) {
    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
    case g: h = ((b - r) / d + 2) / 6; break;
    default: h = ((r - g) / d + 4) / 6;
  }
  return [h * 360, max ? d / max : 0, max];
}
function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  h = (((h % 360) + 360) % 360) / 360;
  const i = Math.floor(h * 6), f = h * 6 - i;
  const p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s);
  const c: [number, number, number][] = [[v,t,p],[q,v,p],[p,v,t],[p,q,v],[t,p,v],[v,p,q]];
  const [r, g, b] = c[i % 6];
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function ColorPickerPopover({
  initialValue,
  onChange,
  anchorRef,
}: {
  initialValue: string;
  onChange: (hex: string) => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
}) {
  const svCanvasRef = useRef<HTMLCanvasElement>(null);
  const hueCanvasRef = useRef<HTMLCanvasElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<'sv' | 'hue' | null>(null);
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  const [pos, setPos] = useState<{ top: number; left: number }>({ top: -9999, left: -9999 });
  useLayoutEffect(() => {
    if (!anchorRef.current || !popoverRef.current) return;
    const anchor = anchorRef.current.getBoundingClientRect();
    const ph = popoverRef.current.offsetHeight;
    const pw = popoverRef.current.offsetWidth;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const top = anchor.bottom + 8 + ph > vh
      ? Math.max(8, anchor.top - 8 - ph)
      : anchor.bottom + 8;
    const left = Math.min(anchor.left, vw - pw - 8);
    setPos(prev => prev.top === top && prev.left === left ? prev : { top, left });
  }, [anchorRef]);

  const initHsv = (): [number, number, number] => {
    const rgb = hexToRgb(initialValue);
    return rgb ? rgbToHsv(...rgb) : [220, 0.7, 0.8];
  };

  const [hue, setHue] = useState(() => initHsv()[0]);
  const [sat, setSat] = useState(() => initHsv()[1]);
  const [val, setVal] = useState(() => initHsv()[2]);
  const [currentHex, setCurrentHex] = useState(initialValue);
  const [hexInput, setHexInput] = useState(initialValue);

  const STORAGE_KEY = "cg-custom-color-presets";
  const [customPresets, setCustomPresets] = useState<string[]>([]);
  useEffect(() => {
    try { setCustomPresets(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")); } catch { /* ignore */ }
  }, []);
  function savePreset() {
    const next = [currentHex, ...customPresets.filter(c => c.toLowerCase() !== currentHex.toLowerCase())].slice(0, 10);
    setCustomPresets(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  }

  // Live refs for use inside stable drag-effect closure
  const hueR = useRef(hue), satR = useRef(sat), valR = useRef(val);
  hueR.current = hue; satR.current = sat; valR.current = val;

  // Draw SV gradient
  useEffect(() => {
    const cv = svCanvasRef.current; if (!cv) return;
    const ctx = cv.getContext('2d')!;
    const [r, g, b] = hsvToRgb(hue, 1, 1);
    const hg = ctx.createLinearGradient(0, 0, cv.width, 0);
    hg.addColorStop(0, '#fff'); hg.addColorStop(1, `rgb(${r},${g},${b})`);
    ctx.fillStyle = hg; ctx.fillRect(0, 0, cv.width, cv.height);
    const vg = ctx.createLinearGradient(0, 0, 0, cv.height);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = vg; ctx.fillRect(0, 0, cv.width, cv.height);
  }, [hue]);

  // Draw hue bar (once)
  useEffect(() => {
    const cv = hueCanvasRef.current; if (!cv) return;
    const ctx = cv.getContext('2d')!;
    const g = ctx.createLinearGradient(0, 0, cv.width, 0);
    for (let i = 0; i <= 6; i++) g.addColorStop(i / 6, `hsl(${i * 60},100%,50%)`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, cv.width, cv.height);
  }, []);

  // Global drag handler (stable — uses refs only)
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!dragging.current) return;
      let h = hueR.current, s = satR.current, v = valR.current;
      if (dragging.current === 'sv' && svCanvasRef.current) {
        const rect = svCanvasRef.current.getBoundingClientRect();
        s = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        v = 1 - Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      }
      if (dragging.current === 'hue' && hueCanvasRef.current) {
        const rect = hueCanvasRef.current.getBoundingClientRect();
        h = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * 360;
      }
      setHue(h); setSat(s); setVal(v);
      hueR.current = h; satR.current = s; valR.current = v;
      const [r, g, b] = hsvToRgb(h, s, v);
      const hex = rgbToHex(r, g, b);
      setCurrentHex(hex); setHexInput(hex); onChangeRef.current(hex);
    };
    const up = () => { dragging.current = null; };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
    return () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); };
  }, []);

  const onSVDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = 'sv';
    const rect = svCanvasRef.current!.getBoundingClientRect();
    const s = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const v = 1 - Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setSat(s); setVal(v);
    satR.current = s; valR.current = v;
    const [r, g, b] = hsvToRgb(hueR.current, s, v);
    const hex = rgbToHex(r, g, b);
    setCurrentHex(hex); setHexInput(hex); onChange(hex);
  };

  const onHueDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = 'hue';
    const rect = hueCanvasRef.current!.getBoundingClientRect();
    const h = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * 360;
    setHue(h); hueR.current = h;
    const [r, g, b] = hsvToRgb(h, satR.current, valR.current);
    const hex = rgbToHex(r, g, b);
    setCurrentHex(hex); setHexInput(hex); onChange(hex);
  };

  return (
    <div
      ref={popoverRef}
      className="fixed z-50 bg-white dark:bg-[#111D30] rounded-xl shadow-xl border border-[#E5E5E5] dark:border-[#1E3050] p-3 w-[220px]"
      style={{ top: pos.top, left: pos.left }}
    >
      {/* SV panel */}
      <div
        className="relative mb-3 cursor-crosshair select-none"
        style={{ height: 150 }}
        onMouseDown={onSVDown}
      >
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          <canvas ref={svCanvasRef} width={200} height={150} className="block w-full h-full" />
        </div>
        <div
          className="absolute w-4 h-4 rounded-full pointer-events-none"
          style={{
            left: `${sat * 100}%`,
            top: `${(1 - val) * 100}%`,
            transform: 'translate(-50%,-50%)',
            background: currentHex,
            boxShadow: '0 0 0 2px white, 0 0 0 3px rgba(0,0,0,0.25)',
          }}
        />
      </div>

      {/* Hue bar */}
      <div
        className="relative mb-3 cursor-pointer select-none rounded-full"
        style={{ height: 12 }}
        onMouseDown={onHueDown}
      >
        <canvas ref={hueCanvasRef} width={200} height={12} className="block w-full rounded-full" style={{ height: 12 }} />
        <div
          className="absolute top-1/2 w-4 h-4 rounded-full pointer-events-none"
          style={{
            left: `${(hue / 360) * 100}%`,
            transform: 'translate(-50%,-50%)',
            background: `hsl(${hue},100%,50%)`,
            boxShadow: '0 0 0 2px white, 0 0 0 3px rgba(0,0,0,0.25)',
          }}
        />
      </div>

      {/* Saved presets row */}
      <div className="flex items-center gap-1.5 mb-2">
        <button
          onClick={savePreset}
          title="Save current color"
          className="w-5 h-5 rounded-md border border-dashed border-[#A3A3A3] dark:border-[#4A6A8A] flex items-center justify-center text-[#A3A3A3] dark:text-[#7A9BBF] hover:border-violet-400 hover:text-violet-500 transition-colors shrink-0"
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M4 1v6M1 4h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
        {customPresets.length === 0 && (
          <span className="text-[9px] text-[#C0C0C0] dark:text-[#4A6A8A] italic">No saved colors yet</span>
        )}
        {customPresets.map((preset) => (
          <button
            key={preset}
            title={preset}
            onClick={() => {
              const rgb = hexToRgb(preset)!;
              const [nh, ns, nv] = rgbToHsv(...rgb);
              setHue(nh); setSat(ns); setVal(nv);
              hueR.current = nh; satR.current = ns; valR.current = nv;
              setCurrentHex(preset); setHexInput(preset); onChange(preset);
            }}
            className="w-5 h-5 rounded-md border-2 transition-all duration-100 hover:scale-110 shrink-0"
            style={{
              backgroundColor: preset,
              borderColor: currentHex.toLowerCase() === preset.toLowerCase() ? "white" : "transparent",
              boxShadow: currentHex.toLowerCase() === preset.toLowerCase() ? `0 0 0 2px ${preset}` : undefined,
            }}
          />
        ))}
      </div>

      {/* Default presets row */}
      <div className="flex gap-1.5 mb-3 flex-wrap">
        {["#7367F0","#2563EB","#0EA5E9","#10B981","#F59E0B","#EF4444","#EC4899","#8B5CF6","#F97316","#64748B"].map((preset) => (
          <button
            key={preset}
            title={preset}
            onClick={() => {
              const rgb = hexToRgb(preset)!;
              const [nh, ns, nv] = rgbToHsv(...rgb);
              setHue(nh); setSat(ns); setVal(nv);
              hueR.current = nh; satR.current = ns; valR.current = nv;
              setCurrentHex(preset); setHexInput(preset); onChange(preset);
            }}
            className="w-5 h-5 rounded-md border-2 transition-all duration-100 hover:scale-110"
            style={{
              backgroundColor: preset,
              borderColor: currentHex.toLowerCase() === preset.toLowerCase() ? "white" : "transparent",
              boxShadow: currentHex.toLowerCase() === preset.toLowerCase() ? `0 0 0 2px ${preset}` : undefined,
            }}
          />
        ))}
      </div>

      {/* Hex input */}
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded-md border border-[#E5E5E5] dark:border-[#1E3050] shrink-0"
          style={{ background: currentHex }}
        />
        <input
          type="text"
          value={hexInput}
          onChange={(e) => {
            setHexInput(e.target.value);
            const rgb = hexToRgb(e.target.value);
            if (rgb) {
              const [nh, ns, nv] = rgbToHsv(...rgb);
              setHue(nh); setSat(ns); setVal(nv);
              hueR.current = nh; satR.current = ns; valR.current = nv;
              const hex = e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`;
              setCurrentHex(hex); onChange(hex);
            }
          }}
          className="flex-1 px-2 py-1.5 text-xs font-mono rounded-lg border border-[#E5E5E5] dark:border-[#1E3050] bg-white dark:bg-[#162238] text-[#262626] dark:text-[#C8D8EE] outline-none focus:border-violet-400 uppercase"
          placeholder="#000000"
          maxLength={7}
        />
      </div>
    </div>
  );
}

function ColorInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const safeValue = /^#[0-9a-fA-F]{6}$/.test(value) ? value : '#7367F0';

  return (
    <div ref={containerRef} className="relative flex items-center gap-2">
      <div className="relative flex items-center flex-1 max-w-[260px] border border-[#E5E5E5] dark:border-[#1E3050] rounded-xl overflow-hidden bg-white dark:bg-[#162238]">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none text-[#262626] dark:text-[#C8D8EE] font-mono uppercase"
          placeholder="#000000"
        />
        <button
          onClick={() => setOpen((p) => !p)}
          className="flex items-center justify-center shrink-0 self-stretch px-1"
        >
          <span
            className="w-9 h-9 rounded-full block"
            style={{ backgroundColor: value }}
          />
        </button>
      </div>
      <button
        onClick={() => setOpen((p) => !p)}
        className="p-2 rounded-lg hover:bg-[#F5F5F5] dark:hover:bg-[#1E3050] transition-colors text-[#A3A3A3] dark:text-[#7A9BBF]"
        aria-label="Pick color"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <ColorPickerPopover
          initialValue={safeValue}
          onChange={onChange}
          anchorRef={containerRef}
        />
      )}
    </div>
  );
}

const BG_PRESETS: { id: string; label: string; css: string }[] = [
  { id: "chalk",   label: "Chalk",   css: "linear-gradient(160deg,#f9fafb 0%,#f3f4f6 100%)" },
  { id: "mist",    label: "Mist",    css: "linear-gradient(160deg,#ede9fe 0%,#e0f2fe 100%)" },
  { id: "blush",   label: "Blush",   css: "linear-gradient(160deg,#fce7f3 0%,#ede9fe 100%)" },
  { id: "rose",    label: "Rose",    css: "linear-gradient(160deg,#fff1f2 0%,#fce7f3 100%)" },
  { id: "ocean",   label: "Ocean",   css: "linear-gradient(160deg,#0ea5e9 0%,#6366f1 100%)" },
  { id: "aurora",  label: "Aurora",  css: "linear-gradient(160deg,#7c3aed 0%,#db2777 50%,#f59e0b 100%)" },
  { id: "dusk",    label: "Dusk",    css: "linear-gradient(160deg,#1e1b4b 0%,#4c1d95 100%)" },
  { id: "carbon",  label: "Carbon",  css: "linear-gradient(160deg,#111827 0%,#1f2937 100%)" },
  { id: "forest",  label: "Forest",  css: "linear-gradient(160deg,#064e3b 0%,#065f46 100%)" },
  { id: "golden",  label: "Golden",  css: "linear-gradient(160deg,#92400e 0%,#d97706 100%)" },
  { id: "slate",   label: "Slate",   css: "linear-gradient(160deg,#0f172a 0%,#334155 100%)" },
  { id: "mesh",    label: "Mesh",    css: "radial-gradient(ellipse at 20% 20%,#a78bfa 0%,transparent 50%),radial-gradient(ellipse at 80% 80%,#38bdf8 0%,transparent 50%),#1e1b4b" },
];


function AvatarPickerModal({
  current,
  agentName,
  onSelect,
  onClose,
}: {
  current: string;
  agentName: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const categories = ["Male", "Female", "AI"] as const;
  const initials = getInitials(agentName);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#111D30] rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-[#262626] dark:text-[#C8D8EE]">Choose Avatar</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#F5F5F5] dark:hover:bg-[#1E3050] text-[#A3A3A3] dark:text-[#7A9BBF] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="space-y-4">
          {/* Initials */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#A3A3A3] dark:text-[#7A9BBF] mb-2">Initials</p>
            <button
              onClick={() => { onSelect("initials"); onClose(); }}
              className={`relative w-16 h-16 rounded-full overflow-hidden transition-all ring-offset-2 ring-offset-white dark:ring-offset-[#111D30]
                ${current === "preset:initials" ? "ring-2 ring-violet-600" : "ring-1 ring-gray-200 dark:ring-[#1E3050] hover:ring-2 hover:ring-violet-400"}`}
            >
              <InitialsAvatar initials={initials} />
              {current === "preset:initials" && (
                <div className="absolute inset-0 bg-violet-600/10 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="9" fill="#7367F0"/>
                    <path d="M5 9l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </button>
          </div>
          {/* Preset avatars by category */}
          {categories.map((cat) => (
            <div key={cat}>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#A3A3A3] dark:text-[#7A9BBF] mb-2">{cat}</p>
              <div className="flex gap-3">
                {PRESET_AVATARS.filter((a) => a.category === cat).map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => { onSelect(avatar.id); onClose(); }}
                    className={`relative w-16 h-16 rounded-full overflow-hidden transition-all ring-offset-2 ring-offset-white dark:ring-offset-[#111D30]
                      ${current === `preset:${avatar.id}` ? "ring-2 ring-violet-600" : "ring-1 ring-gray-200 dark:ring-[#1E3050] hover:ring-2 hover:ring-violet-400"}`}
                  >
                    {avatar.svg}
                    {current === `preset:${avatar.id}` && (
                      <div className="absolute inset-0 bg-violet-600/10 flex items-center justify-center">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <circle cx="9" cy="9" r="9" fill="#7367F0"/>
                          <path d="M5 9l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Section({
  label,
  info,
  extra,
  children,
}: {
  label: string;
  info?: boolean;
  extra?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="py-5 border-b border-[#F5F5F5] dark:border-[#1E3050] last:border-b-0">
      <div className="flex items-center gap-2 mb-3">
        <SettingsIcon />
        <span className="text-sm font-semibold text-[#404040] dark:text-[#C8D8EE]">{label}</span>
        {info && <InfoIcon />}
        {extra && <div className="ml-auto">{extra}</div>}
      </div>
      {children}
    </div>
  );
}

function BgImagePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
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
      {/* Single swatch row */}
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

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div className="bg-white dark:bg-[#111D30] rounded-2xl border border-[#E5E5E5] dark:border-[#1E3050] shadow-[0_8px_32px_rgba(23,23,23,0.14)] w-80 p-5 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#262626] dark:text-[#C8D8EE]">Choose Background</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-[#A3A3A3] hover:text-[#404040] dark:hover:text-[#C8D8EE] hover:bg-[#F5F5F5] dark:hover:bg-[#1E3050] transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-3">
              {BG_PRESETS.map((preset) => {
                const active = value === `preset:${preset.id}`;
                return (
                  <button
                    key={preset.id}
                    onClick={() => { onChange(`preset:${preset.id}`); setModalOpen(false); }}
                    title={preset.label}
                    className={`relative h-12 rounded-lg overflow-hidden transition-all duration-150
                      ${active
                        ? "ring-2 ring-violet-600 ring-offset-1"
                        : "ring-1 ring-[#E5E5E5] dark:ring-[#1E3050] hover:ring-2 hover:ring-violet-400"
                      }`}
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
              {/* Upload tile */}
              <button
                onClick={() => uploadRef.current?.click()}
                title="Upload image"
                className={`relative h-12 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-0.5 transition-all duration-150
                  ${isCustom
                    ? "border-violet-400 ring-2 ring-violet-600 ring-offset-1"
                    : "border-[#E5E5E5] dark:border-[#1E3050] hover:border-violet-400"
                  }`}
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

const FONT_OPTIONS: { value: PersonaState["fontFamily"]; label: string; stack: string; cls: string }[] = [
  { value: "inter",        label: "Inter",         stack: "var(--font-inter), Inter, system-ui, sans-serif",               cls: "font-preview-inter" },
  { value: "public-sans",  label: "Public Sans",   stack: "var(--font-public-sans), 'Public Sans', system-ui, sans-serif", cls: "font-preview-public-sans" },
  { value: "nunito",       label: "Nunito",        stack: "var(--font-nunito), Nunito, system-ui, sans-serif",             cls: "font-preview-nunito" },
  { value: "merriweather", label: "Merriweather",  stack: "var(--font-merriweather), Merriweather, Georgia, serif",        cls: "font-preview-merriweather" },
  { value: "roboto",       label: "Roboto",        stack: "var(--font-roboto), Roboto, system-ui, sans-serif",             cls: "font-preview-roboto" },
];

function FontSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [dropPos, setDropPos] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const active = FONT_OPTIONS.find(f => f.value === value) ?? FONT_OPTIONS[0];

  function openDrop() {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setDropPos({ top: r.bottom + 4, left: r.left, width: r.width });
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
        dropRef.current && !dropRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={() => open ? setOpen(false) : openDrop()}
        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-[#E5E5E5] dark:border-[#1E3050] bg-white dark:bg-[#162238] hover:border-violet-400 transition-colors"
      >
        <span className={`text-sm text-[#262626] dark:text-[#C8D8EE] ${active.cls}`}>
          {active.label}
        </span>
        <svg className={`shrink-0 text-[#A3A3A3] transition-transform duration-150 ${open ? "rotate-180" : ""}`} width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div
          ref={dropRef}
          className="fixed z-50 bg-white dark:bg-[#111D30] border border-[#E5E5E5] dark:border-[#1E3050] rounded-xl shadow-lg overflow-hidden"
          style={{ top: dropPos.top, left: dropPos.left, width: dropPos.width }}
        >
          {FONT_OPTIONS.map(font => (
            <button
              key={font.value}
              onClick={() => { onChange(font.value); setOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-sm transition-colors ${font.cls}
                ${font.value === value
                  ? "bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400"
                  : "text-[#404040] dark:text-[#C8D8EE] hover:bg-[#F5F5F5] dark:hover:bg-[#1E3050]"
                }`}
            >
              {font.label}
              {font.value === value && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function GeneralSettings({
  state,
  onChange,
  onSave,
}: {
  state: PersonaState;
  onChange: (patch: Partial<PersonaState>) => void;
  onSave: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange({ agentAvatarUrl: url });
  };

  const presetId = state.agentAvatarUrl?.startsWith("preset:") ? state.agentAvatarUrl.slice(7) : null;
  const presetAvatar = presetId && presetId !== "initials" ? PRESET_AVATARS.find((a) => a.id === presetId) : null;
  const isInitialsAvatar = presetId === "initials";

  return (
    <div className="px-6 py-2">
      {/* Identity group — Name, Role, Avatar */}
      <div className="py-5 border-b border-[#F5F5F5] dark:border-[#1E3050]">
        <div className="bg-white dark:bg-[#111D30] rounded-2xl border border-[#E5E5E5] shadow-[0_4px_24px_rgba(23,23,23,0.06)] dark:border-[#1E3050] divide-y divide-[#E5E5E5] dark:divide-[#1E3050] overflow-hidden">

          {/* Agent Name */}
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <SettingsIcon />
              <span className="text-sm font-semibold text-[#404040] dark:text-[#C8D8EE]">Agent Name</span>
            </div>
            <input
              type="text"
              value={state.agentName}
              onChange={(e) => onChange({ agentName: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E5E5E5] dark:border-[#1E3050] bg-white dark:bg-[#162238] text-[#262626] dark:text-[#C8D8EE] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 transition-all"
            />
          </div>

          {/* Agent Role */}
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <SettingsIcon />
              <span className="text-sm font-semibold text-[#404040] dark:text-[#C8D8EE]">Agent Role</span>
              <InfoIcon />
              <a href="#" className="ml-auto text-xs text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1">
                Learn more
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3.5 8.5l5-5M5 3.5h3.5V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            </div>
            <div className="relative">
              <select
                value={state.agentRole}
                onChange={(e) => onChange({ agentRole: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E5E5E5] dark:border-[#1E3050] bg-white dark:bg-[#162238] text-[#262626] dark:text-[#C8D8EE] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 appearance-none transition-all cursor-pointer"
              >
                <option value="">Select a role…</option>
                {AGENT_ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3A3A3] dark:text-[#7A9BBF] pointer-events-none" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {state.agentRole && AGENT_ROLE_DESCRIPTIONS[state.agentRole] && (
              <p className="mt-2 text-xs text-[#A3A3A3] dark:text-[#7A9BBF] leading-relaxed">
                {AGENT_ROLE_DESCRIPTIONS[state.agentRole]}
              </p>
            )}
          </div>

          {/* Agent Avatar */}
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <SettingsIcon />
              <span className="text-sm font-semibold text-[#404040] dark:text-[#C8D8EE]">Agent Avatar</span>
              <InfoIcon />
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setAvatarModalOpen(true)}
                className="relative w-14 h-14 rounded-full border-2 border-[#E5E5E5] dark:border-[#1E3050] overflow-hidden bg-[#F5F5F5] dark:bg-[#162238] shrink-0 flex items-center justify-center group hover:border-violet-400 transition-colors"
              >
                {isInitialsAvatar ? (
                  <div className="w-full h-full"><InitialsAvatar initials={getInitials(state.agentName)} /></div>
                ) : presetAvatar ? (
                  <div className="w-full h-full">{presetAvatar.svg}</div>
                ) : state.agentAvatarUrl ? (
                  <img src={state.agentAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#D4D4D4] dark:text-[#2A4060]">
                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 3v10M3 8h10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
              </button>
              <div className="flex-1">
                <p className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF] mb-2">Upload square image only. Allowed are JPG, GIF or PNG image up to 800 Kb.</p>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-[#E5E5E5] dark:border-[#1E3050] text-[#525252] dark:text-[#C8D8EE] hover:bg-[#FAFAFA] dark:hover:bg-[#1E3050] transition-colors flex items-center gap-1.5"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v7M3 4l3-3 3 3M1 9v1.5A.5.5 0 001.5 11h9a.5.5 0 00.5-.5V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Change Avatar
                </button>
                <input ref={fileRef} type="file" accept=".jpg,.jpeg,.gif,.png" className="sr-only" onChange={handleAvatarChange} />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Color group — Scheme + Color */}
      <div className="py-5 border-b border-[#F5F5F5] dark:border-[#1E3050]">
        <div className="bg-white dark:bg-[#111D30] rounded-2xl border border-[#E5E5E5] shadow-[0_4px_24px_rgba(23,23,23,0.06)] dark:border-[#1E3050] divide-y divide-[#E5E5E5] dark:divide-[#1E3050] overflow-hidden">

          {/* Agent Color Scheme */}
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <SettingsIcon />
              <span className="text-sm font-semibold text-[#404040] dark:text-[#C8D8EE]">Agent Color Scheme</span>
              <InfoIcon />
            </div>
            <RadioGroup
              options={[
                { value: "adaptive", label: "Adaptive" },
                { value: "legacy", label: "Legacy" },
              ]}
              value={state.agentColorScheme}
              onChange={(v) => onChange({ agentColorScheme: v })}
            />
          </div>

          {/* Agent Color */}
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <SettingsIcon />
              <span className="text-sm font-semibold text-[#404040] dark:text-[#C8D8EE]">Agent Color</span>
            </div>
            <p className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF] mb-2">Primary color</p>
            <ColorInput value={state.agentColor} onChange={(v) => onChange({ agentColor: v })} />
          </div>

          {/* Background */}
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <SettingsIcon />
              <span className="text-sm font-semibold text-[#404040] dark:text-[#C8D8EE]">Background</span>
            </div>
            <div className="inline-flex items-center bg-[#F5F5F5] dark:bg-[#162238] rounded-lg p-0.5 mb-3">
              {(["image", "color"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => onChange({ backgroundType: type })}
                  className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all duration-150 whitespace-nowrap
                    ${state.backgroundType === type
                      ? "bg-white dark:bg-[#1E3050] text-[#262626] dark:text-[#C8D8EE] font-semibold shadow-sm"
                      : "text-[#737373] dark:text-[#7A9BBF] hover:text-[#404040] dark:hover:text-[#C8D8EE]"
                    }`}
                >
                  {type === "image" ? "Background Image" : "Background Color"}
                </button>
              ))}
            </div>
            {state.backgroundType === "color" && (
              <ColorInput value={state.backgroundColor} onChange={(v) => onChange({ backgroundColor: v })} />
            )}
            {state.backgroundType === "image" && (
              <BgImagePicker
                value={state.backgroundImageUrl}
                onChange={(v) => onChange({ backgroundImageUrl: v })}
              />
            )}
          </div>

        </div>
      </div>

      {/* Style group — Agent Style + Font Family */}
      <div className="py-5 border-b border-[#F5F5F5] dark:border-[#1E3050]">
        <div className="bg-white dark:bg-[#111D30] rounded-2xl border border-[#E5E5E5] shadow-[0_4px_24px_rgba(23,23,23,0.06)] dark:border-[#1E3050] divide-y divide-[#E5E5E5] dark:divide-[#1E3050] overflow-hidden">

          {/* Agent Style */}
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <SettingsIcon />
              <span className="text-sm font-semibold text-[#404040] dark:text-[#C8D8EE]">Agent Style</span>
              <InfoIcon />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {(["sharp", "soft", "round"] as const).map((style) => {
                const active = state.agentStyle === style;
                const label = style.charAt(0).toUpperCase() + style.slice(1);
                const btnR = style === "sharp" ? "rounded-sm" : style === "soft" ? "rounded-lg" : "rounded-full";
                const cardR = style === "sharp" ? "rounded-sm" : style === "soft" ? "rounded-xl" : "rounded-2xl";
                const bubbleR = style === "sharp" ? "rounded-sm" : style === "soft" ? "rounded-xl" : "rounded-full";
                const desc = style === "sharp" ? "Flat, geometric edges" : style === "soft" ? "Balanced, modern feel" : "Pill-shaped, friendly";
                return (
                  <button
                    key={style}
                    onClick={() => onChange({ agentStyle: style })}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all duration-150 cursor-pointer
                      ${active
                        ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30"
                        : "border-[#E5E5E5] dark:border-[#1E3050] bg-white dark:bg-[#162238] hover:border-violet-300 dark:hover:border-violet-700"
                      }`}
                  >
                    {/* Mini preview */}
                    <div className="w-full flex flex-col gap-1 px-0.5">
                      <div className={`self-end h-3 bg-violet-400/70 dark:bg-violet-500/50 ${bubbleR}`} style={{ width: "65%" }} />
                      <div className={`self-start h-3 bg-[#E5E5E5] dark:bg-[#1E3050] ${bubbleR}`} style={{ width: "50%" }} />
                      <div className={`mt-0.5 h-4 w-full bg-[#F5F5F5] dark:bg-[#111D30] border border-[#E5E5E5] dark:border-[#1E3050] flex items-center justify-end pr-0.5 ${cardR}`}>
                        <div className={`w-3 h-3 bg-violet-500/70 flex items-center justify-center shrink-0 ${btnR}`}>
                          <svg width="6" height="6" viewBox="0 0 10 10" fill="white"><path d="M1 9L9 5 1 1v3l5 1-5 1v3z"/></svg>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-0 text-center">
                      <span className={`text-[11px] font-medium transition-colors ${active ? "text-violet-600 dark:text-violet-400" : "text-[#404040] dark:text-[#C8D8EE]"}`}>
                        {label}
                      </span>
                      <span className="text-[9px] text-[#A3A3A3] dark:text-[#5A7A9A] leading-tight">{desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Font Family */}
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 mb-3">
              <SettingsIcon />
              <span className="text-sm font-semibold text-[#404040] dark:text-[#C8D8EE]">Font Family</span>
            </div>
            <FontSelect value={state.fontFamily} onChange={(v) => onChange({ fontFamily: v as PersonaState["fontFamily"] })} />
          </div>

        </div>
      </div>

      {/* Save */}
      <div className="pt-4 pb-8">
        <button
          onClick={onSave}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 transition-colors"
        >
          Save Settings
        </button>
      </div>

      {avatarModalOpen && (
        <AvatarPickerModal
          current={state.agentAvatarUrl}
          agentName={state.agentName}
          onSelect={(id) => onChange({ agentAvatarUrl: `preset:${id}` })}
          onClose={() => setAvatarModalOpen(false)}
        />
      )}
    </div>
  );
}
