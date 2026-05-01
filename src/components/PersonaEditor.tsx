"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { PersonaState } from "./types";
import { generateInstruction, generateExampleQuestions, completionScore } from "./generateInstruction";
import AdvancedToggle from "./AdvancedToggle";
import PresetManager from "./PresetManager";
import LivePreview from "./LivePreview";
import BuilderChat from "./BuilderChat";
import ThemeToggle from "./ThemeToggle";
import GeneralSettings from "./GeneralSettings";
import ConversationSettings from "./ConversationSettings";
import CitationsSettings from "./CitationsSettings";
import IntelligenceSettings from "./IntelligenceSettings";
import AdvancedSettings from "./AdvancedSettings";
import SecuritySettings from "./SecuritySettings";

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
  iDontKnowMessage: "",
  starterQuestions: [],
  useContextRichStarters: false,
  starterQuestionsHeader: "",
  starterQuestionsExpand: "",
  starterQuestionsCollapse: "",
  agentLanguage: "English",
  placeholderPrompt: "",
  loadingIndicator: "typing-dots",
  backgroundActivityMessages: [
    "Searching knowledge base...",
    "Analyzing your question...",
    "Reviewing relevant sources...",
    "Processing request...",
    "Preparing your answer...",
  ],
  loadingCustomMessage: "",
  customMessageEnding: "",
  errorMessage: "",
  failedModerationMessage: "",
  conversationDuration: "24-hour-memory",
  markdownInResponses: "enabled",
  antiHallucination: "enabled",
  agentVisibility: "public",
  recaptcha: "disabled",
  whitelistedDomains: "",
  retentionPeriod: "never",
  retentionDays: 30,
  conversationHistory: "hidden",
  titleAvatarEnabled: true,
  spotlightAvatarEnabled: true,
  spotlightAvatarType: "main",
  spotlightAvatarShape: "round",
  userAvatarEnabled: true,
  userAvatarUploadUrl: "",
  avatarOrientation: "agent-left-user-right",
  titleAvatarAlignment: "left",
  inChatAgentAvatar: true,
  inChatUserAvatar: false,
  affiliateId: "",
  termsOfService: "",
  userFeedback: "enabled",
  showCopyButton: "enabled",
  conversationSharing: "enabled",
  conversationExporting: "enabled",
  removeBranding: false,
  agentTitle: "",
  titleColor: "#000000",
  nextGenEnabled: false,
  primaryGoal: "optimal",
  aiModel: "claude-sonnet-4-6-reasoning",
  dataSource: "my-data",
  userAwareness: true,
  enableCitations: true,
  numberedCitations: true,
  renderImageCitationsInline: true,
  limitImageCitationHeight: false,
  useOpenGraphImages: true,
  maxImagesPerResponse: "unlimited",
  classicCitations: true,
  citationHeader: "",
  citationLabel: "",
  citationDisplayState: "opened",
  enablePdfViewer: true,
  autoOpenPdfViewer: true,
  preventPdfDownload: false,
  allowKnowledgeBaseQueries: true,
  enableNumericSearch: true,
  typingIndicatorStyle: "dots",
  agentRole: "Customer Support",
  agentAvatarUrl: "",
  agentColorScheme: "adaptive",
  agentColor: "#7367F0",
  agentStyle: "soft",
  fontFamily: "inter",
  backgroundType: "color",
  backgroundColor: "#7367F0",
  backgroundImageUrl: "",
};

type SaveState = "idle" | "saving" | "saved";


export default function PersonaEditor({
  initialName = "My Agent",
  onMenuClick,
  sidebarCollapsed,
  onExpandSidebar,
}: {
  initialName?: string;
  onMenuClick?: () => void;
  sidebarCollapsed?: boolean;
  onExpandSidebar?: () => void;
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
  const [chatMode, setChatMode] = useState<"builder" | "settings">("builder");
  const [settingsTab, setSettingsTab] = useState<"general" | "persona" | "conversation" | "citations" | "intelligence" | "advanced" | "security">("general");
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
      <div className="flex items-center justify-between shrink-0 px-4 lg:px-6 py-3 lg:py-4 border-b border-[#E5E5E5] dark:border-[#1E3050]">
        <div className="flex items-center gap-3 min-w-0">
          {/* Hamburger — mobile only */}
          <button
            onClick={onMenuClick}
            className="lg:hidden shrink-0 p-1.5 -ml-1 rounded-lg hover:bg-[#F5F5F5] dark:hover:bg-[#1E3050] text-[#525252] dark:text-[#7A9BBF] transition-colors"
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          {/* Expand sidebar — desktop only, shown when sidebar is collapsed */}
          {sidebarCollapsed && (
            <button
              onClick={onExpandSidebar}
              className="hidden lg:block shrink-0 p-1 -ml-1 rounded hover:opacity-70 transition-opacity"
              aria-label="Expand sidebar"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="4" width="16" height="16" rx="2" stroke="#7367F0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 4V20" stroke="#7367F0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
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
                className="px-3 py-2 rounded-lg text-xs font-semibold text-[#525252] dark:text-[#7A9BBF] hover:bg-[#F5F5F5] dark:hover:bg-[#1E3050] transition-colors"
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

      {/* Mobile Settings / Preview switcher */}
      <div className="lg:hidden flex shrink-0 border-b border-[#E5E5E5] dark:border-[#1E3050]">
        {(["settings", "preview"] as const).map((view) => (
          <button
            key={view}
            onClick={() => setMobileView(view)}
            className={`flex-1 py-2.5 text-sm font-semibold capitalize transition-colors border-b-2
              ${mobileView === view
                ? "border-violet-600 text-violet-700 dark:text-violet-400"
                : "border-transparent text-[#737373] dark:text-[#7A9BBF]"
              }`}
          >
            {view}
          </button>
        ))}
      </div>

      {/* Two-panel layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left panel */}
        <div className={`flex-col flex-1 bg-[#FAFAFA] dark:bg-[#0B1426] overflow-hidden
          ${mobileView === "settings" ? "flex" : "hidden"} lg:flex`}>

          {/* Mode toggle — centered below tab bar */}
          <div className="shrink-0 flex justify-center px-6 py-3">
            <ModeToggle chatMode={chatMode} onChange={(m) => { setChatMode(m); if (m === "settings") setSettingsTab("general"); }} />
          </div>

          {/* Settings sub-tabs — shown when in settings mode */}
          {chatMode === "settings" && (
            <div className="shrink-0 flex border-b border-[#E5E5E5] dark:border-[#1E3050]">
              {(["general","persona","conversation","citations","intelligence","advanced","security"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSettingsTab(tab)}
                  className={`flex-1 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 capitalize transition-colors
                    ${settingsTab === tab
                      ? "border-violet-600 text-violet-700 dark:text-violet-400"
                      : "border-transparent text-[#737373] dark:text-[#7A9BBF] hover:text-[#404040] dark:hover:text-[#C8D8EE]"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}

          {/* Instructions — always mounted, hidden when not active */}
          <div className={`flex-1 flex-col overflow-hidden ${chatMode === "builder" ? "flex" : "hidden"}`}>
            <div className="flex-1 flex flex-col overflow-hidden w-full max-w-[640px] mx-auto">
              <BuilderChat state={state} onApply={(patch) => updateState(patch)} />
            </div>
          </div>

          {/* Settings — always mounted, hidden when not active */}
          <div className={`flex-1 overflow-y-auto ${chatMode === "settings" ? "block" : "hidden"}`}>
            <div className="w-full max-w-[640px] mx-auto">

              {/* General tab */}
              {settingsTab === "general" && (
                <GeneralSettings state={state} onChange={updateState} onSave={handleSave} />
              )}

              {/* Conversation tab */}
              {settingsTab === "conversation" && (
                <ConversationSettings state={state} onChange={updateState} onSave={handleSave} />
              )}

              {/* Citations tab */}
              {settingsTab === "citations" && (
                <CitationsSettings state={state} onChange={updateState} onSave={handleSave} />
              )}

              {/* Intelligence tab */}
              {settingsTab === "intelligence" && (
                <IntelligenceSettings state={state} onChange={updateState} onSave={handleSave} />
              )}

              {/* Advanced tab */}
              {settingsTab === "advanced" && (
                <AdvancedSettings state={state} onChange={updateState} onSave={handleSave} />
              )}

              {/* Security tab */}
              {settingsTab === "security" && (
                <SecuritySettings state={state} onChange={updateState} onSave={handleSave} />
              )}

              {/* Persona tab (existing settings content) */}
              {settingsTab === "persona" && (<>
            <div className="p-6 space-y-6">

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
            </>)}
            </div>
            </div>
          </div>

        {/* Right panel — preview */}
        <div className={`flex-col w-full lg:w-[380px] shrink-0 border-l border-[#E5E5E5] dark:border-[#1E3050] bg-[#FAFAFA] dark:bg-[#0B1426] min-h-0
          ${mobileView === "preview" ? "flex" : "hidden"} lg:flex`}>
          <div className="flex-1 min-h-0 overflow-hidden">
            <LivePreview
              agentName={state.agentName}
              agentColor={state.agentColor}
              agentStyle={state.agentStyle}
              agentAvatarUrl={state.agentAvatarUrl}
              fontFamily={state.fontFamily}
              backgroundType={state.backgroundType}
              backgroundColor={state.backgroundColor}
              backgroundImageUrl={state.backgroundImageUrl}
              typingIndicatorStyle={state.typingIndicatorStyle}
              onTypingIndicatorChange={(v) => updateState({ typingIndicatorStyle: v })}
              starterQuestions={state.starterQuestions}
              starterQuestionsHeader={state.starterQuestionsHeader}
              starterQuestionsExpand={state.starterQuestionsExpand}
              starterQuestionsCollapse={state.starterQuestionsCollapse}
              loadingIndicator={state.loadingIndicator}
              backgroundActivityMessages={state.backgroundActivityMessages}
              onBackgroundActivityMessagesChange={(msgs) => updateState({ backgroundActivityMessages: msgs })}
              loadingCustomMessage={state.loadingCustomMessage}
              outputStyle={state.outputStyle}
              markdownInResponses={state.markdownInResponses}
            />
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
  chatMode: "builder" | "settings";
  onChange: (mode: "builder" | "settings") => void;
}) {
  return (
    <div className="flex items-center bg-[#F5F5F5] dark:bg-[#162238] rounded-lg p-0.5 shrink-0">
      {(["builder", "settings"] as const).map((mode) => (
        <button
          key={mode}
          onClick={() => onChange(mode)}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all
            ${chatMode === mode
              ? "bg-white dark:bg-[#111D30] text-[#262626] dark:text-[#C8D8EE] shadow-sm"
              : "text-[#A3A3A3] dark:text-[#7A9BBF] hover:text-[#525252] dark:hover:text-[#C8D8EE]"
            }`}
        >
          {mode === "builder" ? "Instructions" : "Settings"}
        </button>
      ))}
    </div>
  );
}

