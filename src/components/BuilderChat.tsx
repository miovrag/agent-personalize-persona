"use client";

import { useState, useRef, useEffect } from "react";
import type { PersonaState } from "./types";
import { STYLE_OPTIONS, GUARDRAIL_PRESETS, BEHAVIOR_TOGGLE_OPTIONS, OUTPUT_STYLE_OPTIONS } from "./types";

interface Message {
  id: string;
  role: "builder" | "system";
  text: string;
}

interface ApplyResult {
  patch: Partial<PersonaState>;
  description: string;
}

function parseInstruction(text: string, state: PersonaState): ApplyResult | null {
  const t = text.toLowerCase().trim();

  // --- Tone ---
  if (/more formal|less casual|be formal|sound formal|strictly formal/.test(t)) {
    const tone = Math.max(0, state.tone - 35);
    return { patch: { tone }, description: `Set tone to ${tone < 20 ? "Formal" : "Professional"} (${tone}).` };
  }
  if (/more casual|conversational|friendly tone|less formal|warmer/.test(t)) {
    const tone = Math.min(100, state.tone + 35);
    return { patch: { tone }, description: `Set tone to ${tone > 75 ? "Casual" : "Friendly"} (${tone}).` };
  }

  // --- Output style ---
  if (/bullet|bullets/.test(t)) return { patch: { outputStyle: "bullets" }, description: "Output style → Bullet points." };
  if (/short.*step|step.*short/.test(t)) return { patch: { outputStyle: "short-steps" }, description: "Output style → Short + Steps." };
  if (/detailed|full explanation/.test(t)) return { patch: { outputStyle: "detailed" }, description: "Output style → Detailed explanation." };
  if (/step.*guide|step.?by.?step/.test(t)) return { patch: { outputStyle: "step-guide" }, description: "Output style → Step-by-step guide." };
  if (/summary/.test(t)) return { patch: { outputStyle: "summary" }, description: "Output style → Summary + details." };

  // --- Behavior toggles ---
  for (const opt of BEHAVIOR_TOGGLE_OPTIONS) {
    const keywords: Record<string, RegExp> = {
      steps: /always.*step|provide step|break.*down/,
      institution: /mention.*institution|responsible.*institution/,
      clarify: /ask.*clarif|clarif.*question/,
      cite: /cite source|always cite/,
    };
    if (keywords[opt.id]?.test(t)) {
      const already = state.behaviorToggles.includes(opt.id);
      const behaviorToggles = already
        ? state.behaviorToggles.filter((s) => s !== opt.id)
        : [...state.behaviorToggles, opt.id];
      return {
        patch: { behaviorToggles },
        description: `${already ? "Disabled" : "Enabled"}: ${opt.label}.`,
      };
    }
  }

  // --- Guardrails ---
  for (const g of GUARDRAIL_PRESETS) {
    if (t.includes(g.toLowerCase())) {
      const already = state.guardrails.includes(g);
      const guardrails = already
        ? state.guardrails.filter((r) => r !== g)
        : [...state.guardrails, g];
      return {
        patch: { guardrails },
        description: `${already ? "Removed" : "Added"} rule: "${g}".`,
      };
    }
  }
  if (/never share|no personal data/.test(t)) {
    const g = "Never share personal data";
    const guardrails = state.guardrails.includes(g) ? state.guardrails : [...state.guardrails, g];
    return { patch: { guardrails }, description: `Added rule: "${g}".` };
  }
  if (/escalate|unsure|human/.test(t)) {
    const g = "Escalate to human if unsure";
    const guardrails = state.guardrails.includes(g) ? state.guardrails : [...state.guardrails, g];
    return { patch: { guardrails }, description: `Added rule: "${g}".` };
  }
  if (/off.?topic|refuse.*off/.test(t)) {
    const g = "Refuse off-topic questions";
    const guardrails = state.guardrails.includes(g) ? state.guardrails : [...state.guardrails, g];
    return { patch: { guardrails }, description: `Added rule: "${g}".` };
  }

  // --- Style chips ---
  for (const style of STYLE_OPTIONS) {
    if (t.includes(style.toLowerCase())) {
      const already = state.styles.includes(style);
      const styles = already
        ? state.styles.filter((s) => s !== style)
        : [...state.styles, style];
      return {
        patch: { styles },
        description: `${already ? "Removed" : "Added"} style: ${style}.`,
      };
    }
  }

  // --- Identity fields (regex extraction) ---
  const roleMatch = t.match(/(?:set|change|make|update).*?role.*?(?:to|as|:)\s*(.+)/);
  if (roleMatch) {
    const role = roleMatch[1].trim().slice(0, 80);
    return { patch: { role }, description: `Updated Role → "${role}".` };
  }

  const missionMatch = t.match(/(?:set|change|update|make).*?mission.*?(?:to|is|:)\s*(.+)/);
  if (missionMatch) {
    const mission = missionMatch[1].trim().slice(0, 150);
    return { patch: { mission }, description: `Updated Mission → "${mission}".` };
  }

  const audienceMatch = t.match(/(?:audience|users?|people).*?(?:is|are|should be|:)\s*(.+)/);
  if (audienceMatch) {
    const audience = audienceMatch[1].trim().slice(0, 120);
    return { patch: { audience }, description: `Updated Audience → "${audience}".` };
  }

  const boundaryMatch = t.match(/(?:never|don.?t|should not|boundary|boundaries).*?[:]\s*(.+)/);
  if (boundaryMatch) {
    const boundaries = boundaryMatch[1].trim();
    return { patch: { boundaries }, description: `Updated Boundaries.` };
  }

  return null;
}

interface Props {
  state: PersonaState;
  onApply: (patch: Partial<PersonaState>) => void;
}

export default function BuilderChat({ state, onApply }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "system",
      text: 'Builder mode active. Type instructions to update settings — e.g. "make the tone more formal", "always provide steps", "set output style to bullets".',
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const builderMsg: Message = { id: Date.now() + "-b", role: "builder", text };
    const result = parseInstruction(text, state);

    let systemText: string;
    if (result) {
      onApply(result.patch);
      systemText = `Done — ${result.description}`;
    } else {
      systemText = 'I didn\'t understand that instruction. Try something like: "make the tone more formal", "always cite sources", or "set output style to bullet points".';
    }

    const systemMsg: Message = { id: Date.now() + "-s", role: "system", text: systemText };
    setMessages((prev) => [...prev, builderMsg, systemMsg]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "builder" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed
                ${msg.role === "builder"
                  ? "bg-violet-600 text-white rounded-br-sm"
                  : "bg-white dark:bg-[#111D30] text-gray-700 dark:text-[#C8D8EE] border border-gray-100 dark:border-[#1E3050] rounded-bl-sm"
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 px-4 py-3 border-t border-gray-200 dark:border-[#1E3050] flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
          placeholder="e.g. make the tone more formal..."
          className="flex-1 px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-[#1E3050] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 bg-white dark:bg-[#162238] text-gray-800 dark:text-[#C8D8EE] placeholder:text-gray-400 dark:placeholder:text-[#7A9BBF] transition-all"
          autoFocus
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors shrink-0"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
