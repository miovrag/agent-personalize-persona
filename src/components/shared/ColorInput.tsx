"use client";
import { useState, useRef, useEffect } from "react";

export function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  return [parseInt(clean.slice(0,2),16), parseInt(clean.slice(2,4),16), parseInt(clean.slice(4,6),16)];
}
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r,g,b].map(x => Math.round(Math.max(0,Math.min(255,x))).toString(16).padStart(2,'0')).join('');
}
export function rgbToHsv(r: number, g: number, b: number): [number,number,number] {
  r/=255; g/=255; b/=255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b), d=max-min;
  let h=0;
  if(d) switch(max){
    case r: h=((g-b)/d+(g<b?6:0))/6; break;
    case g: h=((b-r)/d+2)/6; break;
    default: h=((r-g)/d+4)/6;
  }
  return [h*360, max?d/max:0, max];
}
export function hsvToRgb(h: number, s: number, v: number): [number,number,number] {
  h=(((h%360)+360)%360)/360;
  const i=Math.floor(h*6), f=h*6-i;
  const p=v*(1-s), q=v*(1-f*s), t=v*(1-(1-f)*s);
  const c: [number,number,number][] = [[v,t,p],[q,v,p],[p,v,t],[p,q,v],[t,p,v],[v,p,q]];
  const [r,g,b]=c[i%6];
  return [Math.round(r*255),Math.round(g*255),Math.round(b*255)];
}

function ColorPickerPopover({
  initialValue, onChange, anchorRef,
}: {
  initialValue: string;
  onChange: (hex: string) => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
}) {
  const svCanvasRef = useRef<HTMLCanvasElement>(null);
  const hueCanvasRef = useRef<HTMLCanvasElement>(null);
  const dragging = useRef<'sv'|'hue'|null>(null);
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  const [pos, setPos] = useState({ top: 0, left: 0 });
  useEffect(() => {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 8, left: rect.left });
  }, [anchorRef]);

  const initHsv = (): [number,number,number] => {
    const rgb = hexToRgb(initialValue);
    return rgb ? rgbToHsv(...rgb) : [220, 0.7, 0.8];
  };
  const [hue, setHue] = useState(() => initHsv()[0]);
  const [sat, setSat] = useState(() => initHsv()[1]);
  const [val, setVal] = useState(() => initHsv()[2]);
  const [currentHex, setCurrentHex] = useState(initialValue);
  const [hexInput, setHexInput] = useState(initialValue);

  const hueR = useRef(hue), satR = useRef(sat), valR = useRef(val);
  hueR.current = hue; satR.current = sat; valR.current = val;

  useEffect(() => {
    const cv = svCanvasRef.current; if (!cv) return;
    const ctx = cv.getContext('2d')!;
    const [r,g,b] = hsvToRgb(hue,1,1);
    const hg = ctx.createLinearGradient(0,0,cv.width,0);
    hg.addColorStop(0,'#fff'); hg.addColorStop(1,`rgb(${r},${g},${b})`);
    ctx.fillStyle = hg; ctx.fillRect(0,0,cv.width,cv.height);
    const vg = ctx.createLinearGradient(0,0,0,cv.height);
    vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,0,1)');
    ctx.fillStyle = vg; ctx.fillRect(0,0,cv.width,cv.height);
  }, [hue]);

  useEffect(() => {
    const cv = hueCanvasRef.current; if (!cv) return;
    const ctx = cv.getContext('2d')!;
    const g = ctx.createLinearGradient(0,0,cv.width,0);
    for (let i=0;i<=6;i++) g.addColorStop(i/6,`hsl(${i*60},100%,50%)`);
    ctx.fillStyle = g; ctx.fillRect(0,0,cv.width,cv.height);
  }, []);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!dragging.current) return;
      let h=hueR.current, s=satR.current, v=valR.current;
      if (dragging.current==='sv' && svCanvasRef.current) {
        const rect = svCanvasRef.current.getBoundingClientRect();
        s = Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width));
        v = 1-Math.max(0,Math.min(1,(e.clientY-rect.top)/rect.height));
      }
      if (dragging.current==='hue' && hueCanvasRef.current) {
        const rect = hueCanvasRef.current.getBoundingClientRect();
        h = Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width))*360;
      }
      setHue(h); setSat(s); setVal(v);
      hueR.current=h; satR.current=s; valR.current=v;
      const [r,g,b] = hsvToRgb(h,s,v);
      const hex = rgbToHex(r,g,b);
      setCurrentHex(hex); setHexInput(hex); onChangeRef.current(hex);
    };
    const up = () => { dragging.current = null; };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
    return () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); };
  }, []);

  const onSVDown = (e: React.MouseEvent) => {
    e.preventDefault(); dragging.current = 'sv';
    const rect = svCanvasRef.current!.getBoundingClientRect();
    const s = Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width));
    const v = 1-Math.max(0,Math.min(1,(e.clientY-rect.top)/rect.height));
    setSat(s); setVal(v); satR.current=s; valR.current=v;
    const [r,g,b] = hsvToRgb(hueR.current,s,v);
    const hex = rgbToHex(r,g,b);
    setCurrentHex(hex); setHexInput(hex); onChange(hex);
  };

  const onHueDown = (e: React.MouseEvent) => {
    e.preventDefault(); dragging.current = 'hue';
    const rect = hueCanvasRef.current!.getBoundingClientRect();
    const h = Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width))*360;
    setHue(h); hueR.current=h;
    const [r,g,b] = hsvToRgb(h,satR.current,valR.current);
    const hex = rgbToHex(r,g,b);
    setCurrentHex(hex); setHexInput(hex); onChange(hex);
  };

  return (
    <div
      className="fixed z-50 bg-white dark:bg-[#111D30] rounded-xl shadow-xl border border-[#E5E5E5] dark:border-[#1E3050] p-3 w-[220px]"
      style={{ top: pos.top, left: pos.left }}
    >
      <div className="relative mb-3 cursor-crosshair select-none" style={{ height: 150 }} onMouseDown={onSVDown}>
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          <canvas ref={svCanvasRef} width={200} height={150} className="block w-full h-full" />
        </div>
        <div className="absolute w-4 h-4 rounded-full pointer-events-none"
          style={{ left:`${sat*100}%`, top:`${(1-val)*100}%`, transform:'translate(-50%,-50%)', background:currentHex, boxShadow:'0 0 0 2px white,0 0 0 3px rgba(0,0,0,0.25)' }} />
      </div>
      <div className="relative mb-3 cursor-pointer select-none rounded-full" style={{ height: 12 }} onMouseDown={onHueDown}>
        <canvas ref={hueCanvasRef} width={200} height={12} className="block w-full rounded-full" style={{ height: 12 }} />
        <div className="absolute top-1/2 w-4 h-4 rounded-full pointer-events-none"
          style={{ left:`${(hue/360)*100}%`, transform:'translate(-50%,-50%)', background:`hsl(${hue},100%,50%)`, boxShadow:'0 0 0 2px white,0 0 0 3px rgba(0,0,0,0.25)' }} />
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md border border-[#E5E5E5] dark:border-[#1E3050] shrink-0" style={{ background: currentHex }} />
        <input type="text" value={hexInput}
          onChange={(e) => {
            setHexInput(e.target.value);
            const rgb = hexToRgb(e.target.value);
            if (rgb) {
              const [nh,ns,nv] = rgbToHsv(...rgb);
              setHue(nh); setSat(ns); setVal(nv);
              hueR.current=nh; satR.current=ns; valR.current=nv;
              const hex = e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`;
              setCurrentHex(hex); onChange(hex);
            }
          }}
          className="flex-1 px-2 py-1.5 text-xs font-mono rounded-lg border border-[#E5E5E5] dark:border-[#1E3050] bg-white dark:bg-[#162238] text-[#262626] dark:text-[#C8D8EE] outline-none focus:border-violet-400 uppercase"
          placeholder="#000000" maxLength={7}
        />
      </div>
    </div>
  );
}

export function ColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const safeValue = /^#[0-9a-fA-F]{6}$/.test(value) ? value : '#7367F0';

  return (
    <div ref={containerRef} className="relative flex items-center gap-2">
      <div className="relative flex items-center flex-1 max-w-[260px] border border-[#E5E5E5] dark:border-[#1E3050] rounded-xl overflow-hidden bg-white dark:bg-[#162238]">
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none text-[#262626] dark:text-[#C8D8EE] font-mono uppercase"
          placeholder="#000000"
        />
        <button onClick={() => setOpen(p => !p)} className="flex items-center justify-center shrink-0 self-stretch px-1">
          <span className="w-9 h-9 rounded-full block" style={{ backgroundColor: value }} />
        </button>
      </div>
      <button onClick={() => setOpen(p => !p)}
        className="p-2 rounded-lg hover:bg-[#F5F5F5] dark:hover:bg-[#1E3050] transition-colors text-[#A3A3A3] dark:text-[#7A9BBF]"
        aria-label="Pick color">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && <ColorPickerPopover initialValue={safeValue} onChange={onChange} anchorRef={containerRef} />}
    </div>
  );
}
