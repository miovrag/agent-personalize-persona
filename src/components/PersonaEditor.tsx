"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { PersonaState } from "./types";
import { OUTPUT_STYLE_OPTIONS } from "./types";
import { generateInstruction, generateExampleQuestions, completionScore } from "./generateInstruction";
import OnboardingChat from "./OnboardingChat";
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

// Determine which modules to show based on the user's onboarding answer
function parseModulesFromIntent(text: string): Set<string> {
  const t = text.toLowerCase();
  const modules = new Set(["identity", "behavior"]); // always shown

  // Personality — tone matters when the agent is customer/citizen-facing
  if (/customer|client|user|citizen|grad|patient|student|employee|tone|brand|friendly|formal/.test(t)) {
    modules.add("personality");
  }

  // Output — structured formatting needed
  if (/step|procedure|process|document|form|format|guide|admin|official|institution|report|city|government|municipal|grad|procedure/.test(t)) {
    modules.add("output");
  }

  // Outcomes — workflow automations
  if (/ticket|email|book|meeting|schedule|route|crm|handoff|connect|integrate|database/.test(t)) {
    modules.add("outcomes");
  }

  return modules;
}

export default function PersonaEditor({ initialName = "My Agent" }: { initialName?: string }) {
  const [state, setState] = useState<PersonaState>({ ...DEFAULT_STATE, agentName: initialName });
  const [instruction, setInstruction] = useState(() => generateInstruction({ ...DEFAULT_STATE, agentName: initialName }));
  const [hasCustomEdit, setHasCustomEdit] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [isDirty, setIsDirty] = useState(false);
  const [widgetKey, setWidgetKey] = useState(0);
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "synced">("idle");
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [visibleModules, setVisibleModules] = useState<Set<string>>(new Set());
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!hasCustomEdit) {
      const generated = generateInstruction(state);
      setInstruction(generated);
    }
    setIsDirty(true);
  }, [state]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSyncStatus("syncing");
      try {
        await fetch("/api/update-persona", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            persona_instructions: instruction,
            example_questions: generateExampleQuestions(state),
          }),
        });
        setSyncStatus("synced");
        setWidgetKey((k) => k + 1);
        setTimeout(() => setSyncStatus("idle"), 2000);
      } catch {
        setSyncStatus("idle");
      }
    }, 1500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [instruction]);

  const updateState = useCallback((patch: Partial<PersonaState>) => {
    setState((prev) => ({ ...prev, ...patch }));
    setHasCustomEdit(false);
    setSaveState("idle");
  }, []);

  const handleOnboardingSubmit = (answer: string) => {
    const modules = parseModulesFromIntent(answer);
    setVisibleModules(modules);
    setShowOnboarding(false);
  };

  const handleSave = () => {
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

  const show = (module: string) => visibleModules.has(module);

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-[#1E3050]">
        <div>
          <h1 className="heading-h5 mb-1">Personalize · {state.agentName}</h1>
          <p className="text-sm text-gray-400 dark:text-[#7A9BBF]">Settings here apply to all deployment options.</p>
        </div>
        <div className="flex items-center gap-3">
          {!showOnboarding && isDirty && saveState === "idle" && (
            <span className="text-xs text-amber-500 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
              Unsaved changes
            </span>
          )}
          <ThemeToggle />
          {!showOnboarding && (
            <>
              <PresetManager currentState={state} onLoad={handleLoadPreset} />
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
            </>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-0 border-b border-gray-200 dark:border-[#1E3050] px-6 overflow-x-auto">
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

      {/* Onboarding or Editor */}
      {showOnboarding ? (
        <OnboardingChat agentName={state.agentName} onSubmit={handleOnboardingSubmit} />
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Controls */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-[600px] bg-[#F5F5F5] dark:bg-[#0B1426]">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 dark:text-[#7A9BBF]">✦</span>
              <h2 className="text-base font-semibold text-gray-800 dark:text-[#C8D8EE]">Set Up Instructions For Your Agent</h2>
            </div>

            <CompletionScore score={score} />

            {/* 1. Identity — always shown */}
            <Section number={1} label="Identity">
              <StructuredIdentity
                role={state.role}
                mission={state.mission}
                audience={state.audience}
                onChange={(patch) => updateState(patch)}
              />
            </Section>

            {/* 2. Personality — conditional */}
            {show("personality") && (
              <Section number={2} label="Personality">
                <div className="space-y-5">
                  <ToneSlider value={state.tone} onChange={(tone) => updateState({ tone })} />
                  <StyleChips selected={state.styles} onChange={(styles) => updateState({ styles })} />
                </div>
              </Section>
            )}

            {/* 3. Behavior Rules — always shown */}
            <Section number={show("personality") ? 3 : 2} label="Behavior Rules">
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

            {/* 4. Output & Limits — conditional */}
            {show("output") && (
              <Section number={show("personality") ? 4 : 3} label="Output & Limits">
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
            )}

            {/* Outcomes — conditional */}
            {show("outcomes") && (
              <Section
                number={
                  [show("personality"), show("output")].filter(Boolean).length +
                  (show("personality") ? 3 : 2)
                }
                label="Workflow Outcomes"
              >
                <OutcomeCards selected={state.outcomes} onChange={(outcomes) => updateState({ outcomes })} />
              </Section>
            )}

            {/* Additional Instructions */}
            <div className="bg-white dark:bg-[#111D30] rounded-2xl border border-gray-200 dark:border-[#1E3050] overflow-hidden">
              <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 dark:border-[#1E3050]">
                <span className="text-gray-400 dark:text-[#7A9BBF] text-sm">✎</span>
                <span className="heading-h5">Additional Instructions</span>
                <span className="text-xs text-gray-400 dark:text-[#7A9BBF] font-normal">Describe this assistant in your own words</span>
              </div>
              <div className="px-5 py-4">
                <textarea
                  value={state.additionalInstructions}
                  onChange={(e) => updateState({ additionalInstructions: e.target.value })}
                  placeholder={'e.g. "Agent treba da se ponaša kao digitalni službenik visokog nivoa, ali da građaninu objašnjava jednostavno, bez administrativnog zamora."'}
                  rows={4}
                  className="w-full px-3.5 py-3 text-sm rounded-xl border border-gray-200 dark:border-[#1E3050] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 bg-white dark:bg-[#162238] resize-none placeholder:text-gray-400 dark:placeholder:text-[#7A9BBF] text-gray-800 dark:text-[#C8D8EE] transition-all leading-relaxed"
                />
                <p className="text-xs text-gray-400 dark:text-[#7A9BBF] mt-2">
                  Use this for nuances that don&apos;t fit the structured fields above.
                </p>
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
              <button
                onClick={() => setShowOnboarding(true)}
                className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-[#7A9BBF] hover:text-gray-800 dark:hover:text-[#C8D8EE] hover:bg-gray-100 dark:hover:bg-[#1E3050] transition-colors"
              >
                Start over
              </button>
            </div>
          </div>

          {/* Right: Live agent preview */}
          <div className="w-[420px] shrink-0 border-l border-gray-200 dark:border-[#1E3050] bg-[#F5F5F5] dark:bg-[#0B1426] flex flex-col min-h-0">
            <div className="flex items-center gap-2 px-4 pt-3 pb-2 shrink-0">
              <span className={`w-2 h-2 rounded-full shrink-0 ${
                syncStatus === "syncing" ? "bg-amber-400 animate-pulse" :
                syncStatus === "synced" ? "bg-emerald-400" : "bg-gray-300"
              }`} />
              <span className="text-xs text-gray-400 dark:text-[#7A9BBF]">
                {syncStatus === "syncing" ? "Applying changes to agent..." :
                 syncStatus === "synced" ? "Agent updated — chat reloaded" :
                 "Live agent"}
              </span>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden px-5 pb-6">
              <CustomGPTWidget reloadKey={widgetKey} />
            </div>
          </div>
        </div>
      )}
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
