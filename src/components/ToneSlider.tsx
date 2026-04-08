"use client";

interface ToneSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const TONE_LABELS = [
  { min: 0, max: 20, label: "Very formal", color: "text-blue-600" },
  { min: 20, max: 40, label: "Professional", color: "text-blue-500" },
  { min: 40, max: 60, label: "Balanced", color: "text-violet-600" },
  { min: 60, max: 80, label: "Friendly", color: "text-orange-500" },
  { min: 80, max: 101, label: "Casual", color: "text-orange-600" },
];

function getToneLabel(value: number) {
  return TONE_LABELS.find((t) => value >= t.min && value < t.max) ?? TONE_LABELS[2];
}

export default function ToneSlider({ value, onChange }: ToneSliderProps) {
  const current = getToneLabel(value);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-[#2F3D39]">
          How should it sound?
        </label>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 ${current.color}`}>
          {current.label}
        </span>
      </div>

      <div className="space-y-1">
        <div className="relative">
          {/* Fixed full-width gradient track */}
          <div className="absolute inset-x-[9px] top-[8px] h-[6px] rounded-full overflow-hidden pointer-events-none">
            <div className="absolute inset-0 rounded-full" style={{ background: 'linear-gradient(to right, #3b82f6, #a855f7, #f97316)' }} />
            {/* Gray mask slides from right to reveal gradient */}
            <div
              className="absolute top-0 right-0 h-full bg-gray-200 transition-none rounded-r-full"
              style={{ width: `${100 - value}%` }}
            />
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            style={{ background: 'transparent' }}
            className="w-full relative"
            aria-label="Tone slider: Formal to Conversational"
          />
          {/* Tick marks */}
          <div className="flex justify-between px-[9px] mt-1">
            {Array.from({ length: 11 }).map((_, i) => {
              const tickVal = i * 10;
              const isActive = tickVal <= value;
              const isMajor = i % 2 === 0;
              return (
                <div
                  key={i}
                  className={`rounded-full transition-colors ${isMajor ? "w-[2px] h-[6px]" : "w-[1.5px] h-[4px]"} ${isActive ? "bg-[#1E9553]" : "bg-gray-300"}`}
                />
              );
            })}
          </div>
        </div>

        <div className="flex justify-between text-xs text-gray-400 font-medium px-0.5 mt-1">
          <span>Formal & precise</span>
          <span>Warm & conversational</span>
        </div>
      </div>

      {/* Tone preview pill */}
      <div className="bg-gray-50 rounded-xl px-3.5 py-2.5 flex items-start gap-2.5">
        <span className="text-base mt-0.5 select-none">
          {value < 30 ? "🎩" : value < 60 ? "💼" : value < 80 ? "😊" : "👋"}
        </span>
        <div>
          <p className="text-xs font-medium text-gray-600 mb-0.5">{current.label} tone</p>
          <p className="text-xs text-gray-500 leading-relaxed">
            {value < 30
              ? "Precise, structured sentences. Formal vocabulary. No contractions."
              : value < 60
              ? "Clear and professional language. Approachable but not casual."
              : value < 80
              ? "Friendly and direct. Uses everyday language and contractions."
              : "Warm, casual, and personable. Conversational and encouraging."}
          </p>
        </div>
      </div>
    </div>
  );
}
