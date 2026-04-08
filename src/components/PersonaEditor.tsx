"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { PersonaState } from "./types";
import { generateInstruction, generatePreviewResponse, completionScore } from "./generateInstruction";
import RoleField from "./RoleField";
import ToneSlider from "./ToneSlider";
import StyleChips from "./StyleChips";
import GuardrailTags from "./GuardrailTags";
import OutcomeCards from "./OutcomeCards";
import AdvancedToggle from "./AdvancedToggle";
import LivePreview from "./LivePreview";
import CompletionScore from "./CompletionScore";

const DEFAULT_STATE: PersonaState = {
  agentName: "My Agent",
  role: "",
  tone: 50,
  styles: [],
  guardrails: [],
  outcomes: [],
};

type SaveState = "idle" | "saving" | "saved";

export default function PersonaEditor({ initialName = "My Agent" }: { initialName?: string }) {
  const [state, setState] = useState<PersonaState>({ ...DEFAULT_STATE, agentName: initialName });
  const [instruction, setInstruction] = useState(() => generateInstruction({ ...DEFAULT_STATE, agentName: initialName }));
  const [hasCustomEdit, setHasCustomEdit] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [isDirty, setIsDirty] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Regenerate instruction when state changes (unless user manually edited)
  useEffect(() => {
    if (!hasCustomEdit) {
      const generated = generateInstruction(state);
      setInstruction(generated);
    }
    setIsDirty(true);
  }, [state]);

  const updateState = useCallback((patch: Partial<PersonaState>) => {
    setState((prev) => ({ ...prev, ...patch }));
    setHasCustomEdit(false); // structured control change resets manual edit flag
    setSaveState("idle");
  }, []);

  const handleSave = () => {
    setSaveState("saving");
    setTimeout(() => {
      setSaveState("saved");
      setIsDirty(false);
      setTimeout(() => setSaveState("idle"), 2500);
    }, 800);
  };

  const previewData = generatePreviewResponse(state);
  const score = completionScore(state);

  const saveLabel =
    saveState === "saving"
      ? "Saving..."
      : saveState === "saved"
      ? "Saved ✓"
      : "Save Changes";

  const saveBg =
    saveState === "saved"
      ? "bg-emerald-600 hover:bg-emerald-700"
      : "bg-violet-600 hover:bg-violet-700";

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <span>Personalize</span>
            <span>•</span>
            <span className="font-medium text-gray-700">{state.agentName}</span>
          </div>
          <p className="text-xs text-gray-400">Settings here apply to all deployment options.</p>
        </div>

        <div className="flex items-center gap-3">
          {isDirty && saveState === "idle" && (
            <span className="text-xs text-amber-500 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
              Unsaved changes
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saveState === "saving"}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors ${saveBg} disabled:opacity-70`}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M11.5 2L5.5 10L2.5 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {saveLabel}
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-0 border-b border-gray-200 bg-white px-6 overflow-x-auto">
        {["General", "Persona", "Conversation", "Citations", "Intelligence", "Advanced", "Security"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
              ${tab === "Persona"
                ? "border-violet-600 text-violet-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main split layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Controls */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-[600px]">
          {/* Section header */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400">✦</span>
            <h2 className="text-base font-semibold text-gray-800">Set Up Instructions For Your Agent</h2>
          </div>

          {/* Completion score */}
          <CompletionScore score={score} />

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* 1. Role */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center">1</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Identity</span>
            </div>
            <RoleField value={state.role} onChange={(role) => updateState({ role })} />
          </div>

          <div className="border-t border-gray-100" />

          {/* 2. Tone */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center">2</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Personality</span>
            </div>
            <div className="space-y-5">
              <ToneSlider value={state.tone} onChange={(tone) => updateState({ tone })} />
              <StyleChips selected={state.styles} onChange={(styles) => updateState({ styles })} />
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* 3. Guardrails */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center">3</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Behavior Rules</span>
            </div>
            <GuardrailTags selected={state.guardrails} onChange={(guardrails) => updateState({ guardrails })} />
          </div>

          <div className="border-t border-gray-100" />

          {/* 4. Outcomes */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center">4</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Workflow Outcomes</span>
            </div>
            <OutcomeCards selected={state.outcomes} onChange={(outcomes) => updateState({ outcomes })} />
          </div>

          <div className="border-t border-gray-100" />

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

          {/* Bottom CTA row */}
          <div className="flex items-center gap-3 pt-2 pb-6">
            <button
              onClick={handleSave}
              disabled={saveState === "saving"}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors ${saveBg} disabled:opacity-70`}
            >
              {saveLabel}
            </button>
            <button className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors">
              Cancel
            </button>
            {score === 0 && (
              <p className="text-xs text-amber-600 flex items-center gap-1.5 ml-1">
                <span>⚠</span>
                Your agent will behave generically without a defined role
              </p>
            )}
          </div>
        </div>

        {/* Right: Preview */}
        <div className="w-[420px] shrink-0 p-6 border-l border-gray-200 bg-gray-50 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Live Preview</p>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              Updates as you edit
            </div>
          </div>
          <div className="flex-1">
            <LivePreview
              agentName={state.agentName}
              previewData={previewData}
              tone={state.tone}
            />
          </div>

          {/* Preview hint */}
          <div className="mt-4 p-3 bg-violet-50 rounded-xl border border-violet-100">
            <p className="text-xs text-violet-700 font-medium mb-1">What you&apos;re seeing</p>
            <p className="text-xs text-violet-600 leading-relaxed">
              This preview simulates how your agent greets users and responds based on your current tone and role settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
