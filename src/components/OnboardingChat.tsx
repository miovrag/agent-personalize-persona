"use client";

import { useState } from "react";
import type { PersonaState } from "./types";

// ─── Types ────────────────────────────────────────────────────────────────────

type SelectType = "single" | "multi";

interface Question {
  id: string;
  selectType: SelectType;
  stat?: string;
  phase?: string;
  conditional?: string;
  title: string;
  subtitle: string;
  options: string[];
  dataSignal: string;
}

// ─── Questions ────────────────────────────────────────────────────────────────

const ALL_QUESTIONS: Question[] = [
  {
    id: "q1",
    selectType: "single",
    stat: "35.6PP GAP — Q&A ROLE",
    title: "What's the main job this agent should do?",
    subtitle:
      "This determines which follow-up questions you'll see and how we optimize your agent's behavior.",
    options: [
      "Answer questions from my content",
      "Handle customer support",
      "Provide expert advice",
      "Capture & qualify leads",
      "Teach or train users",
      "Guide users through a process",
      "Be our brand's voice",
    ],
    dataSignal:
      "From 273 popular agents vs 161 new users: Q&A/knowledge base appears in 60.4% of popular agents vs 24.8% of new (+35.6pp). Customer support: 26.4% vs 7.5% (+18.9pp). Teaching roles: 64.1% vs 36.0% (+28.1pp). This single choice drives all downstream configuration.",
  },
  {
    id: "q2",
    selectType: "multi",
    stat: "CONCISE: 35.5% POP VS 16.8% NEW",
    title: "How should your agent sound?",
    subtitle: "Pick 1-3 traits that match your brand or use case.",
    options: [
      "Professional",
      "Friendly & warm",
      "Concise & direct",
      "Empathetic",
      "Conversational",
      "Formal & authoritative",
    ],
    dataSignal:
      "Professional tone: 49.1% popular vs 48.4% new — nearly equal. The gap is in specificity: concise/direct is set by 35.5% of popular agents vs 16.8% of new (18.7pp). Warning: new users over-index on 'conversational' (78.9% vs 34.4%) — often a placeholder, not a deliberate choice.",
  },
  {
    id: "q3",
    selectType: "single",
    stat: "32.9PP GAP — OUTPUT FORMAT",
    title: "How detailed should responses be?",
    subtitle: "This controls response length and format.",
    options: [
      "Short & scannable (1-2 sentences)",
      "Moderate with bullet points",
      "Detailed step-by-step explanations",
      "Adapt to the question complexity",
    ],
    dataSignal:
      "Short/concise output: 59.0% of popular agents vs 26.1% of new users (32.9pp gap). Step-by-step: 20.5% vs 12.4%. Popular agents are 2.3× more likely to set an explicit format. New users who skip this default to uncontrolled response length.",
  },
  {
    id: "q4",
    selectType: "multi",
    stat: "40.1PP GAP — #1 DIMENSION",
    phase: "PHASE 2 — BOUNDARIES & SAFETY (ALWAYS SHOWN)",
    title: "What should your agent NOT do?",
    subtitle: "Guardrails keep your agent focused and safe. Select all that apply.",
    options: [
      "Don't answer outside its knowledge",
      "Don't make up information",
      "Don't discuss competitors",
      "Don't give legal/medical/financial advice",
      "Don't share internal/sensitive info",
      "Don't engage in off-topic chat",
    ],
    dataSignal:
      "\"Don't make up information\" is the #1 gap: 47.6% of popular agents vs 7.5% of new users (40.1pp). No personal data: 20.1% vs 5.0% (15.1pp). No legal/medical advice: 19.4% vs 8.7%. These are the clearest hallmarks separating production-grade agents from default configurations.",
  },
  {
    id: "q5",
    selectType: "single",
    stat: "26.8PP GAP — FALLBACK",
    title: "What should happen when the agent doesn't know something?",
    subtitle: "Define the fallback behavior clearly.",
    options: [
      "Say \"I don't know\" honestly",
      "Suggest contacting a human",
      "Offer to search for related info",
      "Ask a clarifying question first",
    ],
    dataSignal:
      "Escalation to human: 31.1% of popular agents vs 4.3% of new (26.8pp gap). Combined with the anti-hallucination guardrail above, explicit fallback logic is the clearest behavioral differentiator between popular and new agent configurations.",
  },
  {
    id: "q6a",
    selectType: "single",
    conditional: 'Shown when: Q1 = "Handle customer support" or "Answer questions from my content"',
    title: "Should the agent cite its sources?",
    subtitle: "When answering from your content, should it show where the answer came from?",
    options: [
      "Yes, always cite the source",
      "Only when explicitly asked",
      "No, just answer naturally",
    ],
    dataSignal:
      "Source citation: 65.9% of popular agents include citation rules vs 39.8% of new users (26.1pp gap). Popular Q&A agents are 2.4× more likely to define citation behavior. Agents with explicit citation rules also show lower hallucination rates in user feedback.",
  },
  {
    id: "q6b",
    selectType: "single",
    conditional: 'Shown when: Q1 = "Handle customer support" or "Guide users through a process"',
    title: "When should the agent escalate to a human?",
    subtitle: "Define when the agent should hand off to your team.",
    options: [
      "When it can't answer after 2 attempts",
      "When the user explicitly asks",
      "When negative sentiment is detected",
      "Never — keep trying to help",
    ],
    dataSignal:
      "Escalation rules: 31.1% of popular agents vs 4.3% of new (26.8pp gap). Support agents with explicit escalation logic are the most distinct segment in the entire dataset — no other JTBD shows this level of configuration gap between popular and new users.",
  },
  {
    id: "q6c",
    selectType: "multi",
    conditional: 'Shown when: Q1 = "Capture & qualify leads"',
    title: "What info should the agent collect from visitors?",
    subtitle: "Select the fields your agent should try to gather during conversation.",
    options: [
      "Name",
      "Email",
      "Phone number",
      "Company name",
      "Budget range",
      "Use case / need",
    ],
    dataSignal:
      "22.7% of popular agents have lead capture logic vs 27.3% of new users — one area where new users keep pace. Most successful lead agents collect name + email + use case as the core trio. Adding more than 4 fields correlates with drop-off in conversation completion.",
  },
  {
    id: "q6e",
    selectType: "single",
    conditional: 'Shown when: Q1 = "Teach or train users"',
    title: "What's the expertise level of your learners?",
    subtitle: "This adapts language complexity and explanation depth.",
    options: [
      "Complete beginners",
      "Some background knowledge",
      "Technical / advanced",
      "Mixed — adapt per user",
    ],
    dataSignal:
      "Teaching/training agents appear in 64.1% of popular agents vs 36.0% of new (28.1pp gap). Popular education agents consistently pair this with an explicit tone (61%) and a defined output format (58%). Audience expertise level directly controls vocabulary and explanation depth.",
  },
  {
    id: "q7",
    selectType: "single",
    stat: "8.8% POP VS 4.3% NEW",
    title: "What language should the agent respond in?",
    subtitle: "Choose the default language behavior.",
    options: [
      "English only",
      "Match the user's language",
      "Specific language (I'll type it)",
    ],
    dataSignal:
      "Language-matching behavior: 8.8% of popular agents vs 4.3% of new. Non-English agents appear in 4.4% of popular (12 unique languages detected). Most agents don't specify — but those serving multilingual audiences see 2× higher session depth when language behavior is explicit.",
  },
  {
    id: "q8",
    selectType: "single",
    stat: "12.5% POP VS ~0% NEW",
    title: "How should the agent start conversations?",
    subtitle: "First impressions matter — choose a greeting style.",
    options: [
      "Friendly intro + ask how to help",
      "Introduce itself by name & role",
      "Jump straight to business",
      "Show menu of common topics",
    ],
    dataSignal:
      "12.5% of popular agents define an explicit greeting pattern vs near-zero for new users. Named introductions (e.g. 'I am Alex, your support assistant') appear in 34 of 273 popular agents. Agents with greeting scripts show higher first-turn engagement and lower bounce rates.",
  },
];

// ─── Conditional visibility ───────────────────────────────────────────────────

function getActiveQuestions(answers: Record<string, string[]>): Question[] {
  const q1 = answers["q1"]?.[0] ?? "";
  return ALL_QUESTIONS.filter((q) => {
    if (q.id === "q6a") {
      return q1 === "Handle customer support" || q1 === "Answer questions from my content";
    }
    if (q.id === "q6b") {
      return q1 === "Handle customer support" || q1 === "Guide users through a process";
    }
    if (q.id === "q6c") return q1 === "Capture & qualify leads";
    if (q.id === "q6e") return q1 === "Teach or train users";
    return true;
  });
}

// ─── Persona builder ──────────────────────────────────────────────────────────

export function buildPersonaState(answers: Record<string, string[]>): Partial<PersonaState> {
  const patch: Partial<PersonaState> = {};

  // Q1 → role + mission
  const q1 = answers["q1"]?.[0] ?? "";
  const roleMap: Record<string, { role: string; mission: string }> = {
    "Answer questions from my content": {
      role: "Q&A Assistant",
      mission: "Answer questions accurately from provided content",
    },
    "Handle customer support": {
      role: "Customer Support Assistant",
      mission: "Help customers resolve issues and answer product questions",
    },
    "Provide expert advice": {
      role: "Expert Advisor",
      mission: "Provide knowledgeable guidance and recommendations",
    },
    "Capture & qualify leads": {
      role: "Lead Qualification Agent",
      mission: "Engage visitors and collect lead information",
    },
    "Teach or train users": {
      role: "Training Assistant",
      mission: "Teach and guide users through learning content",
    },
    "Guide users through a process": {
      role: "Process Guide",
      mission: "Guide users step-by-step through procedures and processes",
    },
    "Be our brand's voice": {
      role: "Brand Ambassador",
      mission: "Represent the brand with consistent voice and messaging",
    },
  };
  if (q1 && roleMap[q1]) {
    patch.role = roleMap[q1].role;
    patch.mission = roleMap[q1].mission;
  }

  // Q2 → tone + styles
  const q2 = answers["q2"] ?? [];
  if (q2.length > 0) {
    const tones: number[] = [];
    const styles: string[] = [];
    for (const opt of q2) {
      if (opt === "Professional") { tones.push(30); styles.push("Direct"); }
      if (opt === "Friendly & warm") { tones.push(70); styles.push("Friendly"); styles.push("Empathetic"); }
      if (opt === "Concise & direct") { styles.push("Concise"); styles.push("Direct"); }
      if (opt === "Empathetic") { styles.push("Empathetic"); }
      if (opt === "Conversational") { tones.push(75); }
      if (opt === "Formal & authoritative") { tones.push(10); styles.push("Direct"); }
    }
    if (tones.length > 0) {
      patch.tone = Math.round(tones.reduce((a, b) => a + b, 0) / tones.length);
    }
    if (styles.length > 0) {
      patch.styles = [...new Set(styles)];
    }
  }

  // Q3 → outputStyle
  const q3 = answers["q3"]?.[0] ?? "";
  if (q3 === "Short & scannable (1-2 sentences)") patch.outputStyle = "bullets";
  else if (q3 === "Moderate with bullet points") patch.outputStyle = "bullets";
  else if (q3 === "Detailed step-by-step explanations") patch.outputStyle = "step-guide";
  // "Adapt to the question complexity" → leave unset

  // Q4 → guardrails + boundaries
  const q4 = answers["q4"] ?? [];
  const guardrails: string[] = [...(patch.guardrails ?? [])];
  let boundaries = patch.boundaries ?? "";
  for (const opt of q4) {
    if (opt === "Don't answer outside its knowledge" && !guardrails.includes("Refuse off-topic questions")) {
      guardrails.push("Refuse off-topic questions");
    }
    if (opt === "Don't make up information" && !guardrails.includes("Avoid opinions on sensitive topics")) {
      guardrails.push("Avoid opinions on sensitive topics");
    }
    if (opt === "Don't discuss competitors") {
      const note = "Never discuss competitors";
      if (!boundaries.includes(note)) {
        boundaries = boundaries ? `${boundaries}. ${note}` : note;
      }
    }
    if (opt === "Don't give legal/medical/financial advice" && !guardrails.includes("Avoid opinions on sensitive topics")) {
      guardrails.push("Avoid opinions on sensitive topics");
    }
    if (opt === "Don't share internal/sensitive info" && !guardrails.includes("Never share personal data")) {
      guardrails.push("Never share personal data");
    }
    if (opt === "Don't engage in off-topic chat" && !guardrails.includes("Refuse off-topic questions")) {
      guardrails.push("Refuse off-topic questions");
    }
  }
  if (guardrails.length > 0) patch.guardrails = guardrails;
  if (boundaries) patch.boundaries = boundaries;

  // Q5 → behaviorToggles + guardrails
  const q5 = answers["q5"]?.[0] ?? "";
  const behaviorToggles: string[] = [...(patch.behaviorToggles ?? [])];
  const guardrails2: string[] = [...(patch.guardrails ?? [])];
  if (q5 === "Suggest contacting a human") {
    if (!guardrails2.includes("Escalate to human if unsure")) guardrails2.push("Escalate to human if unsure");
    patch.guardrails = guardrails2;
  }
  if (q5 === "Ask a clarifying question first") {
    if (!behaviorToggles.includes("clarify")) behaviorToggles.push("clarify");
    patch.behaviorToggles = behaviorToggles;
  }

  // Q6A → behaviorToggles
  const q6a = answers["q6a"]?.[0] ?? "";
  if (q6a === "Yes, always cite the source") {
    const bt: string[] = [...(patch.behaviorToggles ?? [])];
    if (!bt.includes("cite")) bt.push("cite");
    patch.behaviorToggles = bt;
  }

  // Q6B → guardrails
  const q6b = answers["q6b"]?.[0] ?? "";
  if (q6b && q6b !== "Never — keep trying to help") {
    const g: string[] = [...(patch.guardrails ?? [])];
    if (!g.includes("Escalate to human if unsure")) g.push("Escalate to human if unsure");
    patch.guardrails = g;
  }

  // Q6C → audience
  const q6c = answers["q6c"] ?? [];
  if (q6c.length > 0) {
    patch.audience = `Collects: ${q6c.join(", ")}`;
  }

  // Q6E → audience
  const q6e = answers["q6e"]?.[0] ?? "";
  if (q6e) {
    patch.audience = q6e;
  }

  // Q7 → additionalInstructions
  const q7 = answers["q7"]?.[0] ?? "";
  const instructions: string[] = patch.additionalInstructions ? [patch.additionalInstructions] : [];
  if (q7 === "English only") instructions.push("Always respond in English only.");
  else if (q7 === "Match the user's language") instructions.push("Automatically match and respond in the user's language.");
  // "Specific language (I'll type it)" → nothing

  // Q8 → additionalInstructions
  const q8 = answers["q8"]?.[0] ?? "";
  if (q8 === "Friendly intro + ask how to help") instructions.push("Start every conversation with a friendly greeting and ask how you can help.");
  else if (q8 === "Introduce itself by name & role") instructions.push("Always introduce yourself by name and role at the start of a conversation.");
  else if (q8 === "Jump straight to business") instructions.push("Skip greetings and get straight to answering.");
  else if (q8 === "Show menu of common topics") instructions.push("Start conversations by showing a menu of common topics.");

  if (instructions.length > 0) patch.additionalInstructions = instructions.join(" ");

  return patch;
}

// ─── Visible modules ──────────────────────────────────────────────────────────

export function getVisibleModules(q1: string): Set<string> {
  const map: Record<string, string[]> = {
    "Answer questions from my content": ["identity", "behavior", "personality", "output"],
    "Handle customer support": ["identity", "behavior", "personality", "output", "outcomes"],
    "Provide expert advice": ["identity", "behavior", "personality"],
    "Capture & qualify leads": ["identity", "behavior", "outcomes"],
    "Teach or train users": ["identity", "behavior", "personality"],
    "Guide users through a process": ["identity", "behavior", "output"],
    "Be our brand's voice": ["identity", "behavior", "personality"],
  };
  return new Set(map[q1] ?? ["identity", "behavior"]);
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  agentName: string;
  onSubmit: (patch: Partial<PersonaState>, modules: Set<string>) => void;
  onSkip: () => void;
}

export default function OnboardingChat({ agentName, onSubmit, onSkip }: Props) {
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [cardKey, setCardKey] = useState(0);

  const activeQuestions = getActiveQuestions(answers);
  const currentQuestion = activeQuestions[stepIndex];
  const totalSteps = activeQuestions.length;

  const selectedForCurrent: string[] = answers[currentQuestion?.id] ?? [];

  function advance() {
    const nextIndex = stepIndex + 1;
    const nextActiveQuestions = getActiveQuestions(answers);
    if (nextIndex >= nextActiveQuestions.length) {
      // Done
      const q1 = answers["q1"]?.[0] ?? "";
      const patch = buildPersonaState(answers);
      const modules = getVisibleModules(q1);
      onSubmit(patch, modules);
    } else {
      setStepIndex(nextIndex);
      setCardKey((k) => k + 1);
    }
  }

  function handleSingleSelect(option: string) {
    const newAnswers = { ...answers, [currentQuestion.id]: [option] };
    setAnswers(newAnswers);
    // Advance immediately
    const nextIndex = stepIndex + 1;
    const nextActive = getActiveQuestions(newAnswers);
    if (nextIndex >= nextActive.length) {
      const q1 = newAnswers["q1"]?.[0] ?? "";
      const patch = buildPersonaState(newAnswers);
      const modules = getVisibleModules(q1);
      onSubmit(patch, modules);
    } else {
      setStepIndex(nextIndex);
      setCardKey((k) => k + 1);
    }
  }

  function handleMultiToggle(option: string) {
    const current = answers[currentQuestion.id] ?? [];
    const next = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option];
    setAnswers({ ...answers, [currentQuestion.id]: next });
  }

  if (!currentQuestion) return null;

  const progressPct = totalSteps > 0 ? ((stepIndex) / totalSteps) * 100 : 0;

  return (
    <div className="px-4 py-5 relative">
      {/* Close button */}
      <button
        onClick={onSkip}
        aria-label="Close setup"
        className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full text-gray-400 dark:text-[#7A9BBF] hover:text-gray-600 dark:hover:text-[#C8D8EE] hover:bg-gray-100 dark:hover:bg-[#1E3050] transition-all text-sm"
      >
        ✕
      </button>

      {/* Progress bar */}
      <div className="w-full mb-4 shrink-0 pr-6">
        <div className="h-1 w-full bg-gray-200 dark:bg-[#162238] rounded-full overflow-hidden">
          <div
            className="h-full bg-violet-600 rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <button
            onClick={onSkip}
            className="text-xs text-gray-400 dark:text-[#7A9BBF] hover:text-gray-600 dark:hover:text-[#C8D8EE] transition-colors"
          >
            Skip setup
          </button>
          <p className="text-xs text-gray-400 dark:text-[#7A9BBF]">
            {stepIndex + 1} of {totalSteps}
          </p>
        </div>
      </div>

      <div className="w-full">
        {/* Agent name context */}
        {stepIndex === 0 && (
          <p className="text-sm text-gray-500 dark:text-[#7A9BBF] mb-3">
            Setting up{" "}
            <span className="font-medium text-gray-700 dark:text-[#C8D8EE]">{agentName}</span>
          </p>
        )}

        {/* Phase label */}
        {currentQuestion.phase && (
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            {currentQuestion.phase}
          </p>
        )}

        {/* Card */}
        <div
          key={cardKey}
          className="animate-slide-up bg-white dark:bg-[#111D30] rounded-2xl border border-gray-200 dark:border-[#1E3050] p-6 shadow-sm"
        >
          {/* Top row: QUESTION N + type badge + stat badge */}
          <div className="flex flex-wrap items-center gap-2 mb-1">
            {currentQuestion.conditional && (
              <span className="text-xs italic text-gray-400 dark:text-[#7A9BBF] w-full mb-0.5">
                {currentQuestion.conditional}
              </span>
            )}
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              QUESTION {stepIndex + 1}
            </span>
            {currentQuestion.selectType === "single" ? (
              <span className="bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                SINGLE SELECT
              </span>
            ) : (
              <span className="bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                MULTI-SELECT
              </span>
            )}
            {currentQuestion.stat && (
              <span className="bg-gray-100 text-gray-500 dark:bg-[#162238] dark:text-[#7A9BBF] text-xs font-medium px-2.5 py-0.5 rounded-full">
                {currentQuestion.stat}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-base font-bold text-gray-900 dark:text-[#C8D8EE] mt-3">
            {currentQuestion.title}
          </h2>

          {/* Subtitle */}
          <p className="text-sm text-gray-500 dark:text-[#7A9BBF] mt-1">
            {currentQuestion.subtitle}
          </p>

          {/* Options */}
          <div className="flex flex-wrap gap-2 mt-5">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedForCurrent.includes(option);
              if (currentQuestion.selectType === "single") {
                return (
                  <button
                    key={option}
                    onClick={() => handleSingleSelect(option)}
                    className={`px-4 py-2.5 text-sm font-medium rounded-xl border transition-all ${
                      isSelected
                        ? "border-violet-500 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                        : "border-gray-200 dark:border-[#1E3050] bg-white dark:bg-[#162238] text-gray-700 dark:text-[#C8D8EE] hover:border-violet-300 dark:hover:border-violet-600 hover:text-violet-700 dark:hover:text-violet-300"
                    }`}
                  >
                    {option}
                  </button>
                );
              } else {
                return (
                  <button
                    key={option}
                    onClick={() => handleMultiToggle(option)}
                    className={`px-4 py-2.5 text-sm font-medium rounded-xl border transition-all ${
                      isSelected
                        ? "border-violet-500 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                        : "border-gray-200 dark:border-[#1E3050] bg-white dark:bg-[#162238] text-gray-700 dark:text-[#C8D8EE] hover:border-violet-300 dark:hover:border-violet-600 hover:text-violet-700 dark:hover:text-violet-300"
                    }`}
                  >
                    {option}
                  </button>
                );
              }
            })}
          </div>

          {/* Multi-select Continue button */}
          {currentQuestion.selectType === "multi" && (
            <div className="mt-4">
              <button
                onClick={advance}
                disabled={selectedForCurrent.length === 0}
                className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2"
              >
                Continue
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}

          {/* Data signal */}
          <p className="text-xs text-gray-500 dark:text-[#7A9BBF] mt-4 leading-relaxed">
            <span className="font-bold">Data signal:</span> {currentQuestion.dataSignal}
          </p>
        </div>
      </div>
    </div>
  );
}
