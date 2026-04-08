"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { PersonaState } from "./types";
import { generateInstruction, completionScore } from "./generateInstruction";
import RoleField from "./RoleField";
import ToneSlider from "./ToneSlider";
import StyleChips from "./StyleChips";
import GuardrailTags from "./GuardrailTags";
import OutcomeCards from "./OutcomeCards";
import AdvancedToggle from "./AdvancedToggle";
import CompletionScore from "./CompletionScore";
import PresetManager from "./PresetManager";
import CustomGPTWidget from "./CustomGPTWidget";

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
  const [widgetKey, setWidgetKey] = useState(0);
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "synced">("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Regenerate instruction + debounce-sync to live agent
  useEffect(() => {
    if (!hasCustomEdit) {
      const generated = generateInstruction(state);
      setInstruction(generated);
    }
    setIsDirty(true);
  }, [state]);

  // Debounce: push instruction to CustomGPT API 1.5s after last change
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSyncStatus("syncing");
      try {
        await fetch("/api/update-persona", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ persona_instructions: instruction }),
        });
        setSyncStatus("synced");
        setWidgetKey((k) => k + 1); // reload widget with updated persona
        setTimeout(() => setSyncStatus("idle"), 2000);
      } catch {
        setSyncStatus("idle");
      }
    }, 1500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [instruction]);

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

  const handleLoadPreset = (presetState: PersonaState) => {
    setState(presetState);
    setHasCustomEdit(false);
    setIsDirty(true);
    setSaveState("idle");
  };

  const score = completionScore(state);

  const saveLabel =
    saveState === "saving"
      ? "Publishing..."
      : saveState === "saved"
      ? "Published ✓"
      : "Publish";

  const saveBg =
    saveState === "saved"
      ? "bg-emerald-600 hover:bg-emerald-700"
      : "bg-violet-600 hover:bg-violet-700";

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div>
          <h1 className="heading-h5 mb-1">
            Personalize · {state.agentName}
          </h1>
          <p className="text-sm text-gray-400">Settings here apply to all deployment options.</p>
        </div>

        <div className="flex items-center gap-3">
          {isDirty && saveState === "idle" && (
            <span className="text-xs text-amber-500 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
              Unsaved changes
            </span>
          )}
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
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-0 border-b border-gray-200 px-6 overflow-x-auto">
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-[600px] bg-[#F5F5F5]">
          {/* Section header */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400">✦</span>
            <h2 className="text-base font-semibold text-gray-800">Set Up Instructions For Your Agent</h2>
          </div>

          {/* Completion score */}
          <CompletionScore score={score} />

          {/* 1. Identity */}
          <Section number={1} label="Identity">
            <RoleField value={state.role} onChange={(role) => updateState({ role })} />
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
            <GuardrailTags selected={state.guardrails} onChange={(guardrails) => updateState({ guardrails })} />
          </Section>

          {/* 4. Workflow Outcomes */}
          <Section number={4} label="Workflow Outcomes">
            <OutcomeCards selected={state.outcomes} onChange={(outcomes) => updateState({ outcomes })} />
          </Section>

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

        {/* Right: Live agent preview */}
        <div className="w-[420px] shrink-0 border-l border-gray-200 bg-[#F5F5F5] flex flex-col">
          {/* Sync indicator */}
          <div className="flex items-center gap-2 px-4 pt-3 pb-2">
            <span className={`w-2 h-2 rounded-full shrink-0 ${
              syncStatus === "syncing" ? "bg-amber-400 animate-pulse" :
              syncStatus === "synced" ? "bg-emerald-400" : "bg-gray-300"
            }`} />
            <span className="text-xs text-gray-400">
              {syncStatus === "syncing" ? "Applying changes to agent..." :
               syncStatus === "synced" ? "Agent updated — chat reloaded" :
               "Live agent"}
            </span>
          </div>
          <div className="flex-1 px-4 pb-4">
            <CustomGPTWidget reloadKey={widgetKey} />
          </div>
        </div>
      </div>
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
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
        <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center shrink-0">
          {number}
        </span>
        <span className="heading-h5">{label}</span>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}
