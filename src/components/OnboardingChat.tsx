"use client";

import { useState, useRef, useEffect } from "react";

const QUICK_STARTS = [
  {
    label: "City / Government",
    text: "Help citizens navigate city procedures and administrative processes",
  },
  {
    label: "Customer Support",
    text: "Help customers with product questions and issue resolution",
  },
  {
    label: "HR Assistant",
    text: "Help employees with HR policies, onboarding, and internal processes",
  },
  {
    label: "Healthcare",
    text: "Guide patients through clinic services and appointment booking",
  },
];

interface Props {
  agentName: string;
  onSubmit: (answer: string) => void;
}

export default function OnboardingChat({ agentName, onSubmit }: Props) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSubmit(value.trim());
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#F5F5F5] dark:bg-[#0B1426] px-6 py-12">
      <div className="w-full max-w-[520px] space-y-7">
        {/* Header */}
        <div className="text-center space-y-2.5">
          <div className="w-10 h-10 rounded-2xl bg-violet-100 dark:bg-violet-950 flex items-center justify-center mx-auto mb-4">
            <span className="text-violet-600 dark:text-violet-400 text-lg">✦</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-[#C8D8EE]">
            What would you like to do?
          </h2>
          <p className="text-sm text-gray-500 dark:text-[#7A9BBF] leading-relaxed">
            Describe your assistant and I&apos;ll show you only the settings you need
            to set up <span className="font-medium text-gray-700 dark:text-[#C8D8EE]">{agentName}</span>.
          </p>
        </div>

        {/* Input */}
        <div className="space-y-3">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="e.g. Help citizens navigate city procedures and administrative processes..."
            rows={4}
            className="w-full px-4 py-3.5 text-sm rounded-2xl border border-gray-200 dark:border-[#1E3050] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 bg-white dark:bg-[#111D30] resize-none placeholder:text-gray-400 dark:placeholder:text-[#7A9BBF] text-gray-800 dark:text-[#C8D8EE] transition-all leading-relaxed shadow-sm"
          />

          <button
            onClick={handleSubmit}
            disabled={!value.trim()}
            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            Continue
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Quick starts */}
        <div className="space-y-2.5">
          <p className="text-xs font-semibold text-gray-400 dark:text-[#7A9BBF] uppercase tracking-wide">
            Quick starts
          </p>
          <div className="flex flex-wrap gap-2">
            {QUICK_STARTS.map((qs) => (
              <button
                key={qs.label}
                onClick={() => {
                  setValue(qs.text);
                  textareaRef.current?.focus();
                }}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-full border transition-all
                  ${value === qs.text
                    ? "bg-violet-600 text-white border-violet-600"
                    : "bg-white dark:bg-[#111D30] text-gray-600 dark:text-[#7A9BBF] border-gray-200 dark:border-[#1E3050] hover:border-violet-300 dark:hover:border-violet-700 hover:text-violet-700 dark:hover:text-violet-300"
                  }`}
              >
                {qs.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
