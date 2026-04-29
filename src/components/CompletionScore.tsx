"use client";

interface CompletionScoreProps {
  score: number; // 0–5
}

const STEPS = ["Role", "Mission", "Audience", "Personality", "Rules"];

export default function CompletionScore({ score }: CompletionScoreProps) {
  const percent = (score / 5) * 100;

  const color =
    score === 0
      ? "bg-gray-300"
      : score <= 2
      ? "bg-amber-400"
      : score <= 4
      ? "bg-violet-500"
      : "bg-emerald-500";

  const label =
    score === 0
      ? "Not configured"
      : score <= 2
      ? "Getting started"
      : score <= 4
      ? "Almost there"
      : "Fully configured";

  return (
    <div className="p-3 bg-white dark:bg-[#111D30] rounded-xl border border-[#F5F5F5] dark:border-[#1E3050] space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-[#404040] dark:text-[#C8D8EE]">Persona completeness</span>
        <span className={`font-semibold ${score === 5 ? "text-emerald-600" : score >= 3 ? "text-violet-600" : "text-amber-600"}`}>
          {score}/5 — {label}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-[#F5F5F5] dark:bg-[#162238] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Step dots */}
      <div className="flex gap-1.5">
        {STEPS.map((step, i) => (
          <div key={step} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i < score ? color : "bg-gray-200 dark:bg-[#162238]"
              }`}
            />
            <span className={`text-[9px] font-medium leading-none ${i < score ? "text-[#525252] dark:text-[#7A9BBF]" : "text-[#D4D4D4] dark:text-[#2a4060]"}`}>
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
