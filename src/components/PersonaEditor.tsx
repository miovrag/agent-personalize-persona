"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { PersonaState } from "./types";
import { OUTPUT_STYLE_OPTIONS } from "./types";
import { generateInstruction, generateExampleQuestions, completionScore } from "./generateInstruction";
import StructuredIdentity from "./StructuredIdentity";
import ToneSlider from "./ToneSlider";
import StyleChips from "./StyleChips";
import GuardrailTags from "./GuardrailTags";
import BehaviorToggles from "./BehaviorToggles";
import OutcomeCards from "./OutcomeCards";
import AdvancedToggle from "./AdvancedToggle";
import CompletionScore from "./CompletionScore";
import PresetManager from "./PresetManager";
import CustomGPTWidget from "./CustomGPTWidget";
import BuilderChat from "./BuilderChat";
import ThemeToggle from "./ThemeToggle";

const DEFAULT_STATE: PersonaState = {
  agentName: "My Agent",
  role: "",
  mission: "",
  audience: "",
  tone: 50,
  styles: [],
  guardrails: [],
  behaviorToggles: [],
  boundaries: "",
  outputStyle: "",
  additionalInstructions: "",
  outcomes: [],
};

type SaveState = "idle" | "saving" | "saved";


export default function PersonaEditor({
  initialName = "My Agent",
  onMenuClick,
}: {
  initialName?: string;
  onMenuClick?: () => void;
}) {
  const [state, setState] = useState<PersonaState>({ ...DEFAULT_STATE, agentName: initialName });
  const [instruction, setInstruction] = useState(() => generateInstruction({ ...DEFAULT_STATE, agentName: initialName }));
  const [hasCustomEdit, setHasCustomEdit] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [isDirty, setIsDirty] = useState(false);
  const [widgetKey, setWidgetKey] = useState(0);
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "synced" | "error">("idle");
  const [publishConfirm, setPublishConfirm] = useState(false);
  const lastInstructionRef = useRef<{ instruction: string; questions: string[] } | null>(null);
  const [chatMode, setChatMode] = useState<"user" | "builder">("builder");
  const [mobileView, setMobileView] = useState<"settings" | "preview">("settings");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!hasCustomEdit) {
      const base = generateInstruction(state);
      const full = state.additionalInstructions.trim()
        ? `${base}\n\n## Detailed Instructions\n${state.additionalInstructions.trim()}`
        : base;
      setInstruction(full);
    }
    setIsDirty(true);
  }, [state]);

  const pushToAgent = useCallback(async (personaInstruction: string, questions: string[]) => {
    setSyncStatus("syncing");
    try {
      await fetch("/api/update-persona", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona_instructions: personaInstruction,
          example_questions: questions,
        }),
      });
      setSyncStatus("synced");
      setWidgetKey((k) => k + 1);
      setTimeout(() => setSyncStatus("idle"), 2000);
    } catch {
      setSyncStatus("error");
      setTimeout(() => setSyncStatus("idle"), 8000);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const questions = generateExampleQuestions(state);
    lastInstructionRef.current = { instruction, questions };
    debounceRef.current = setTimeout(() => {
      pushToAgent(instruction, questions);
    }, 1500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [instruction, pushToAgent]);

  const updateState = useCallback((patch: Partial<PersonaState>) => {
    setState((prev) => ({ ...prev, ...patch }));
    setHasCustomEdit(false);
    setSaveState("idle");
  }, []);

  const handleSave = () => {
    if (score === 0 && !publishConfirm) {
      setPublishConfirm(true);
      return;
    }
    setPublishConfirm(false);
    setSaveState("saving");
    setTimeout(() => {
      setSaveState("saved");
      setIsDirty(false);
      setTimeout(() => setSaveState("idle"), 2500);
    }, 800);
  };

  const handleLoadPreset = (presetState: PersonaState) => {
    setState({ ...DEFAULT_STATE, ...presetState });
    setHasCustomEdit(false);
    setIsDirty(true);
    setSaveState("idle");
  };

  const score = completionScore(state);

  const saveLabel =
    saveState === "saving" ? "Publishing..." : saveState === "saved" ? "Published ✓" : "Publish";

  const saveBg =
    saveState === "saved"
      ? "bg-emerald-600 hover:bg-emerald-700"
      : "bg-violet-600 hover:bg-violet-700";

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between shrink-0 px-4 lg:px-6 py-3 lg:py-4 border-b border-gray-200 dark:border-[#1E3050]">
        <div className="flex items-center gap-3 min-w-0">
          {/* Hamburger — mobile only */}
          <button
            onClick={onMenuClick}
            className="xl:hidden shrink-0 p-1.5 -ml-1 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1E3050] text-gray-600 dark:text-[#7A9BBF] transition-colors"
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <div className="min-w-0">
            <h1 className="heading-h5 mb-0 lg:mb-1 truncate">{state.agentName}</h1>
            <p className="hidden sm:block text-sm text-gray-400 dark:text-[#7A9BBF]">Settings here apply to all deployment options.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 lg:gap-3 shrink-0">
          {isDirty && saveState === "idle" && (
            <span className="hidden sm:flex text-xs text-amber-500 font-medium items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
              Unsaved changes
            </span>
          )}
          <ThemeToggle />
          <PresetManager currentState={state} onLoad={handleLoadPreset} />
          {publishConfirm ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-500 font-medium hidden sm:block">No configuration — publish anyway?</span>
              <button
                onClick={handleSave}
                className="px-3 py-2 rounded-lg text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                Publish
              </button>
              <button
                onClick={() => setPublishConfirm(false)}
                className="px-3 py-2 rounded-lg text-xs font-semibold text-gray-600 dark:text-[#7A9BBF] hover:bg-gray-100 dark:hover:bg-[#1E3050] transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={handleSave}
              disabled={saveState === "saving"}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors ${saveBg} disabled:opacity-70`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C12 2 7 6 7 12H10L9 16L12 14L15 16L14 12H17C17 6 12 2 12 2Z" fill="white"/>
                <circle cx="12" cy="9" r="1.5" fill="currentColor" opacity="0.4"/>
                <path d="M9 16C9 17.5 10 19 12 20C14 19 15 17.5 15 16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {saveLabel}
            </button>
          )}
        </div>
      </div>

      {/* Tab bar — always visible */}
      <div className="flex gap-0 shrink-0 border-b border-gray-200 dark:border-[#1E3050] px-6 overflow-x-auto">
        {["General", "Persona", "Conversation", "Citations", "Intelligence", "Advanced", "Security"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
              ${tab === "Persona"
                ? "border-violet-600 text-violet-700"
                : "border-transparent text-gray-500 dark:text-[#7A9BBF] hover:text-gray-700 dark:hover:text-[#C8D8EE]"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Mobile Settings / Preview switcher */}
      <div className="xl:hidden flex shrink-0 border-b border-gray-200 dark:border-[#1E3050]">
        {(["settings", "preview"] as const).map((view) => (
          <button
            key={view}
            onClick={() => setMobileView(view)}
            className={`flex-1 py-2.5 text-sm font-semibold capitalize transition-colors border-b-2
              ${mobileView === view
                ? "border-violet-600 text-violet-700 dark:text-violet-400"
                : "border-transparent text-gray-500 dark:text-[#7A9BBF]"
              }`}
          >
            {view}
          </button>
        ))}
      </div>

      {/* Two-panel layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left panel */}
        <div className={`flex-col flex-1 bg-[#F5F5F5] dark:bg-[#0B1426] overflow-hidden
          ${mobileView === "settings" ? "flex" : "hidden"} xl:flex`}>

          {/* Mode toggle — centered below tab bar */}
          <div className="shrink-0 flex justify-center px-6 py-3 border-b border-gray-200 dark:border-[#1E3050]">
            <ModeToggle chatMode={chatMode} onChange={setChatMode} />
          </div>

          {/* Instructions — always mounted, hidden when not active */}
          <div className={`flex-1 flex-col overflow-hidden ${chatMode === "builder" ? "flex" : "hidden"}`}>
            <div className="flex-1 flex flex-col overflow-hidden w-full max-w-[640px] mx-auto">
              <BuilderChat state={state} onApply={(patch) => updateState(patch)} />
            </div>
          </div>

          {/* Settings — always mounted, hidden when not active */}
          <div className={`flex-1 overflow-y-auto ${chatMode === "user" ? "block" : "hidden"}`}>
            <div className="w-full max-w-[640px] mx-auto">
              <div className="px-6 pt-6 pb-4">
                <CompletionScore score={score} />
              </div>

            <div className="p-6 space-y-6">

              {/* 1. Identity */}
              <Section number={1} label="Identity">
                <StructuredIdentity
                  role={state.role}
                  mission={state.mission}
                  audience={state.audience}
                  onChange={(patch) => updateState(patch)}
                />
              </Section>

              {/* 2. Personality */}
              <Section number={2} label="Personality">
                <div className="space-y-5">
                  <ToneSlider value={state.tone} onChange={(tone) => updateState({ tone })} />
                  <StyleChips selected={state.styles} onChange={(styles) => updateState({ styles })} />
                </div>
              </Section>

              {/* 3. Behavior Rules */}
              <Section number={3} label="Behavior Rules">
                <div className="space-y-5">
                  <GuardrailTags selected={state.guardrails} onChange={(guardrails) => updateState({ guardrails })} />
                  <div className="border-t border-gray-100 dark:border-[#1E3050] pt-4">
                    <BehaviorToggles
                      selected={state.behaviorToggles}
                      onChange={(behaviorToggles) => updateState({ behaviorToggles })}
                    />
                  </div>
                </div>
              </Section>

              {/* 4. Output & Limits */}
              <Section number={4} label="Output & Limits">
                  <div className="space-y-5">
                    <div className="space-y-2.5">
                      <label className="text-sm font-semibold text-[#2F3D39] dark:text-[#C8D8EE]">
                        Output style
                        <span className="ml-2 text-xs font-normal text-gray-400 dark:text-[#7A9BBF]">How should responses be formatted?</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {OUTPUT_STYLE_OPTIONS.map((opt) => {
                          const isOn = state.outputStyle === opt.id;
                          return (
                            <button
                              key={opt.id}
                              onClick={() => updateState({ outputStyle: isOn ? "" : opt.id })}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                                ${isOn
                                  ? "bg-violet-600 text-white border-violet-600"
                                  : "bg-white dark:bg-[#162238] text-gray-500 dark:text-[#7A9BBF] border-gray-200 dark:border-[#1E3050] hover:border-violet-300 dark:hover:border-violet-700 hover:text-violet-700 dark:hover:text-violet-300"
                                }`}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-[#2F3D39] dark:text-[#C8D8EE]">
                        Boundaries
                        <span className="ml-2 text-xs font-normal text-gray-400 dark:text-[#7A9BBF]">What should this agent never do?</span>
                      </label>
                      <textarea
                        value={state.boundaries}
                        onChange={(e) => updateState({ boundaries: e.target.value })}
                        placeholder={'e.g. "Ne izmišlja propise, ne daje pravni savet kao advokat, ne tvrdi nešto bez osnova"'}
                        rows={3}
                        className="w-full px-3.5 py-3 text-sm rounded-xl border border-gray-200 dark:border-[#1E3050] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 bg-white dark:bg-[#162238] resize-none placeholder:text-gray-400 dark:placeholder:text-[#7A9BBF] text-gray-800 dark:text-[#C8D8EE] transition-all leading-relaxed"
                      />
                    </div>
                  </div>
                </Section>

              {/* 5. Workflow Outcomes */}
              <Section number={5} label="Workflow Outcomes">
                <OutcomeCards selected={state.outcomes} onChange={(outcomes) => updateState({ outcomes })} />
              </Section>

              {/* Detailed instructions */}
              <div className="bg-white dark:bg-[#111D30] rounded-2xl border border-gray-200 dark:border-[#1E3050] overflow-hidden">
                <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 dark:border-[#1E3050]">
                  <span className="text-gray-400 dark:text-[#7A9BBF] text-sm">✎</span>
                  <span className="heading-h5">Detailed instructions</span>
                  <span className="text-xs text-gray-400 dark:text-[#7A9BBF] font-normal">Filled automatically from Instructions</span>
                </div>
                <div className="px-5 py-4">
                  <textarea
                    value={state.additionalInstructions}
                    onChange={(e) => updateState({ additionalInstructions: e.target.value })}
                    placeholder="Instructions will appear here. You can also type directly."
                    rows={6}
                    className="w-full px-3.5 py-3 text-sm rounded-xl border border-gray-200 dark:border-[#1E3050] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 bg-white dark:bg-[#162238] resize-none placeholder:text-gray-400 dark:placeholder:text-[#7A9BBF] text-gray-800 dark:text-[#C8D8EE] transition-all leading-relaxed"
                  />
                </div>
              </div>

              {/* Advanced */}
              <AdvancedToggle
                instruction={instruction}
                onEdit={(text) => {
                  setInstruction(text);
                  setHasCustomEdit(true);
                  setSaveState("idle");
                  setIsDirty(true);
                }}
                hasCustomEdit={hasCustomEdit}
              />

              {/* Bottom CTA */}
              <div className="flex items-center gap-3 pt-2 pb-6">
                <button
                  onClick={handleSave}
                  disabled={saveState === "saving"}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors ${saveBg} disabled:opacity-70`}
                >
                  {saveLabel}
                </button>
              </div>
            </div>
            </div>
            </div>
          </div>

        {/* Right panel — preview */}
        <div className={`flex-col w-full xl:w-[420px] shrink-0 border-l border-gray-200 dark:border-[#1E3050] bg-[#F5F5F5] dark:bg-[#0B1426] min-h-0
          ${mobileView === "preview" ? "flex" : "hidden"} xl:flex`}>
          <div className="flex items-center gap-2 px-4 pt-3 pb-2 shrink-0">
            <span className={`w-2 h-2 rounded-full shrink-0 ${
              syncStatus === "syncing" ? "bg-amber-400 animate-pulse" :
              syncStatus === "synced"  ? "bg-emerald-400" :
              syncStatus === "error"   ? "bg-red-500" :
              "bg-gray-300"
            }`} />
            <span className={`text-xs ${syncStatus === "error" ? "text-red-500 font-medium" : "text-gray-400 dark:text-[#7A9BBF]"}`}>
              {syncStatus === "syncing" ? "Applying changes..." :
               syncStatus === "synced"  ? "Agent updated" :
               syncStatus === "error"   ? "Sync failed — changes not saved" :
               "Preview"}
            </span>
            {syncStatus === "error" && lastInstructionRef.current && (
              <button
                onClick={() => pushToAgent(
                  lastInstructionRef.current!.instruction,
                  lastInstructionRef.current!.questions
                )}
                className="ml-1 text-xs font-semibold text-red-500 hover:text-red-600 underline underline-offset-2 transition-colors"
              >
                Retry
              </button>
            )}
          </div>
          <div className="flex-1 min-h-0 overflow-hidden px-5 pb-6">
            <CustomGPTWidget reloadKey={widgetKey} />
          </div>
        </div>

      </div>
    </div>
  );
}

function ModeToggle({
  chatMode,
  onChange,
}: {
  chatMode: "user" | "builder";
  onChange: (mode: "user" | "builder") => void;
}) {
  return (
    <div className="flex items-center bg-gray-100 dark:bg-[#162238] rounded-lg p-0.5 shrink-0">
      {(["builder", "user"] as const).map((mode) => (
        <button
          key={mode}
          onClick={() => onChange(mode)}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all
            ${chatMode === mode
              ? "bg-white dark:bg-[#111D30] text-gray-800 dark:text-[#C8D8EE] shadow-sm"
              : "text-gray-400 dark:text-[#7A9BBF] hover:text-gray-600 dark:hover:text-[#C8D8EE]"
            }`}
        >
          {mode === "user" ? "Settings" : "Instructions"}
        </button>
      ))}
    </div>
  );
}

function Section({
  number,
  label,
  children,
}: {
  number: number;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-[#111D30] rounded-2xl border border-gray-200 dark:border-[#1E3050] overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 dark:border-[#1E3050]">
        <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-[#162238] text-gray-500 dark:text-[#7A9BBF] text-xs font-bold flex items-center justify-center shrink-0">
          {number}
        </span>
        <span className="heading-h5">{label}</span>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}
