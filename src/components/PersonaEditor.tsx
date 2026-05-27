"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { PersonaState } from "./types";
import { generateInstruction, generateExampleQuestions, completionScore } from "./generateInstruction";
import ExpertModeSection from "./ExpertModeSection";
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
import LiveChatSettings from "./LiveChatSettings";

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
  starterQuestionsExpand: "Show more",
  starterQuestionsCollapse: "Show less",
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
  subInstructionOverrides: {},
  contextDepth: "balanced",
  contextDepthEnabled: true,
  liveChatEnabled: false,
  liveChatPosition: "bottom-right",
  liveChatLauncherStyle: "bubble",
  liveChatGreeting: "",
  liveChatNotificationBadge: true,
  liveChatSound: false,
  liveChatAvailability: "always",
  liveChatOfflineMessage: "",
  liveChatLeadCapture: false,
  liveChatLeadFields: ["email"],
  liveChatPrivacyNotice: false,
  liveChatPrivacyUrl: "",
  liveChatEmailTranscript: false,
  liveChatHumanHandoff: false,
  liveChatHandoffTrigger: "",
  liveChatHandoffEmail: "",
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
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [isDirty, setIsDirty] = useState(false);
  const [widgetKey, setWidgetKey] = useState(0);
  const [showDemoConversation, setShowDemoConversation] = useState(true);
  const [primaryPersonaGenerating, setPrimaryPersonaGenerating] = useState(false);
  const [subPersonasGenerating, setSubPersonasGenerating] = useState(false);
  const [personaUpdated, setPersonaUpdated] = useState(false);
  const [detailedInputLocked, setDetailedInputLocked] = useState(false);
  const primaryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const subGenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputLockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [publishConfirm, setPublishConfirm] = useState(false);
  const lastInstructionRef = useRef<{ instruction: string; questions: string[] } | null>(null);
  const [settingsTab, setSettingsTab] = useState<"general" | "persona" | "conversation" | "citations" | "intelligence" | "advanced" | "security" | "livechat">("general");
  const [mobileView, setMobileView] = useState<"settings" | "preview">("settings");
  const [rightView, setRightView] = useState<"preview" | "instructions">("preview");
  const [rightWidth, setRightWidth] = useState(380);
  const settingsScrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(380);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!isDragging.current) return;
      const delta = dragStartX.current - e.clientX;
      setRightWidth(Math.max(280, Math.min(720, dragStartWidth.current + delta)));
    }
    function onMouseUp() {
      if (!isDragging.current) return;
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const base = generateInstruction(state);
    const full = state.additionalInstructions.trim()
      ? `${base}\n\n## Detailed Instructions\n${state.additionalInstructions.trim()}`
      : base;
    setInstruction(full);
    setIsDirty(true);
  }, [state]);

  const hasMountedRef = useRef(false);

  const pushToAgent = useCallback(async (personaInstruction: string, questions: string[]) => {
    try {
      await fetch("/api/update-persona", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona_instructions: personaInstruction,
          example_questions: questions,
        }),
      });
    } catch {
      // silent — generation UI is driven by handleSave timers, not API response
    }
  }, []);

  useEffect(() => {
    if (!hasMountedRef.current) { hasMountedRef.current = true; return; }
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
    setSaveState("idle");
  }, []);

  const personaNoticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGenerationCycle = () => {
    if (primaryTimerRef.current) clearTimeout(primaryTimerRef.current);
    if (subGenTimerRef.current) clearTimeout(subGenTimerRef.current);
    if (inputLockTimerRef.current) clearTimeout(inputLockTimerRef.current);
    if (personaNoticeTimerRef.current) clearTimeout(personaNoticeTimerRef.current);

    setPrimaryPersonaGenerating(true);
    setSubPersonasGenerating(false);
    setPersonaUpdated(false);
    setDetailedInputLocked(true);

    inputLockTimerRef.current = setTimeout(() => setDetailedInputLocked(false), 6000);

    personaNoticeTimerRef.current = setTimeout(() => setPersonaUpdated(true), 2000);

    primaryTimerRef.current = setTimeout(() => {
      setPrimaryPersonaGenerating(false);
      setSubPersonasGenerating(true);

      subGenTimerRef.current = setTimeout(() => {
        setSubPersonasGenerating(false);
      }, 5000);
    }, 5000);
  };

  const handleSave = () => {
    if (score === 0 && !publishConfirm) {
      setPublishConfirm(true);
      return;
    }
    setPublishConfirm(false);
    setSaveState("saving");
    startGenerationCycle();
    if (lastInstructionRef.current) {
      pushToAgent(lastInstructionRef.current.instruction, lastInstructionRef.current.questions);
    }
    setTimeout(() => {
      setSaveState("saved");
      setIsDirty(false);
      setShowDemoConversation(true);
      setWidgetKey((k) => k + 1);
      setTimeout(() => setSaveState("idle"), 2500);
    }, 800);
  };

  const handleLoadPreset = (presetState: PersonaState) => {
    setState({ ...DEFAULT_STATE, ...presetState });
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
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A3A3A3] dark:text-[#7A9BBF] leading-none">Personalize</span>
        </div>
        <div className="flex items-center gap-2 lg:gap-3 shrink-0">
          {isDirty && saveState === "idle" && (
            <span className="hidden sm:flex text-xs text-amber-500 font-medium items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
              Unsaved changes
            </span>
          )}
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
              disabled={saveState === "saving" || primaryPersonaGenerating || subPersonasGenerating}
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
        <div className={`flex-col flex-1 bg-white dark:bg-[#0B1426] overflow-hidden
          ${mobileView === "settings" ? "flex" : "hidden"} lg:flex`}>

          {/* Settings tabs — always visible */}
          <div className="shrink-0 flex overflow-x-auto scrollbar-hide border-b border-[#E5E5E5] dark:border-[#1E3050]">
            {(
              [
                { id: "general",      label: "General",      icon: <><circle cx="9" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.4"/><path d="M3.5 15c0-3 2.5-4.5 5.5-4.5s5.5 1.5 5.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></> },
                { id: "persona",      label: "Persona",      icon: <><rect x="2.5" y="2.5" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M6 7h6M6 10h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></> },
                { id: "conversation", label: "Conversation", icon: <><path d="M13.5 2.5H4.5a2 2 0 00-2 2v6a2 2 0 002 2h1.5l2 2 2-2h3.5a2 2 0 002-2v-6a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M5.5 7h7M5.5 9.5h4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></> },
                { id: "citations",    label: "Citations",    icon: <><path d="M5 3.5h8a1.5 1.5 0 011.5 1.5v9a1.5 1.5 0 01-1.5 1.5H5A1.5 1.5 0 013.5 14V5A1.5 1.5 0 015 3.5z" stroke="currentColor" strokeWidth="1.4"/><path d="M6 7h6M6 9.5h4M6 12h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></> },
                { id: "intelligence", label: "Intelligence", icon: <><path d="M9 2.5a4.5 4.5 0 014.5 4.5c0 1.8-1 3.3-2.5 4.1V13H7v-1.9C5.5 10.3 4.5 8.8 4.5 7A4.5 4.5 0 019 2.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M7 15h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></> },
                { id: "advanced",     label: "Advanced",     icon: <><circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.4"/><path d="M9 2v2M9 14v2M2 9h2M14 9h2M3.93 3.93l1.41 1.41M12.66 12.66l1.41 1.41M3.93 14.07l1.41-1.41M12.66 5.34l1.41-1.41" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></> },
                { id: "security",     label: "Security",     icon: <><path d="M9 2L3.5 4.5v4c0 3 2.5 5.5 5.5 6.5 3-1 5.5-3.5 5.5-6.5v-4L9 2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M6.5 9l1.5 1.5 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></> },
                { id: "livechat",     label: "Live Chat",    icon: <><path d="M14.5 2H3.5a2 2 0 00-2 2v7a2 2 0 002 2h2l3 3 3-3h3a2 2 0 002-2V4a2 2 0 00-2-2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><circle cx="15" cy="3" r="2.2" fill="#10B981" stroke="white" strokeWidth="0.75"/></> },
              ] as const
            ).map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => { setSettingsTab(id); settingsScrollRef.current?.scrollTo({ top: 0 }); }}
                className={`shrink-0 md:flex-1 px-3 md:px-2 py-2 flex flex-row items-center gap-1.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors
                  ${settingsTab === id
                    ? "border-violet-600 text-violet-700 dark:text-violet-400"
                    : "border-transparent text-[#737373] dark:text-[#7A9BBF] hover:text-[#404040] dark:hover:text-[#C8D8EE]"
                  }`}
              >
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">{icon}</svg>
                {label}
              </button>
            ))}
          </div>

          {/* Settings content — always visible */}
          <div ref={settingsScrollRef} className="flex-1 overflow-y-auto">
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

              {/* Live Chat tab */}
              {settingsTab === "livechat" && (
                <LiveChatSettings state={state} onChange={updateState} onSave={handleSave} />
              )}

              {/* Persona tab */}
              {settingsTab === "persona" && (
                <div className="p-6 space-y-6">

                  {/* Main detailed instruction field */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-[#262626] dark:text-[#C8D8EE]">
                        Detailed Instructions
                      </label>
                      <span className="text-xs text-[#A3A3A3] dark:text-[#7A9BBF]">
                        {state.additionalInstructions.length} chars
                      </span>
                    </div>
                    <p className="text-xs text-[#737373] dark:text-[#7A9BBF]">
                      Describe how your agent should behave. This is added to the system-generated instruction.
                    </p>
                    <textarea
                      value={state.additionalInstructions}
                      onChange={(e) => updateState({ additionalInstructions: e.target.value })}
                      disabled={detailedInputLocked}
                      rows={10}
                      placeholder="e.g. Always greet users by name if known. When unsure, ask a clarifying question before answering..."
                      className="w-full px-3 py-3 text-sm rounded-xl border border-[#E5E5E5] dark:border-[#1E3050] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 bg-white dark:bg-[#162238] resize-none leading-relaxed text-[#404040] dark:text-[#C8D8EE] placeholder:text-[#C0C0C0] dark:placeholder:text-[#3A5070] disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Expert Mode */}
                  <ExpertModeSection
                    state={state}
                    onChange={updateState}
                    primaryPersonaGenerating={primaryPersonaGenerating}
                    subPersonasGenerating={subPersonasGenerating}
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
              )}
            </div>
            </div>
          </div>

        {/* Drag handle */}
        <div
          className="hidden lg:flex shrink-0 w-1.5 cursor-col-resize items-center justify-center group hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
          onMouseDown={(e) => {
            isDragging.current = true;
            dragStartX.current = e.clientX;
            dragStartWidth.current = rightWidth;
            document.body.style.cursor = "col-resize";
            document.body.style.userSelect = "none";
          }}
        >
          <div className="w-0.5 h-8 rounded-full bg-[#E5E5E5] dark:bg-[#1E3050] group-hover:bg-violet-400 dark:group-hover:bg-violet-500 transition-colors" />
        </div>

        {/* Right panel — preview / instructions */}
        <div
          className={`flex-col shrink-0 border-l border-[#E5E5E5] dark:border-[#1E3050] bg-[#FAFAFA] dark:bg-[#0B1426] min-h-0
            ${mobileView === "preview" ? "flex" : "hidden"} lg:flex`}
          style={{ width: rightWidth }}
        >

          {/* Right panel segmented control */}
          <div className="shrink-0 flex items-center justify-center px-4 py-2.5 border-b border-[#E5E5E5] dark:border-[#1E3050]">
            <div className="flex items-center bg-[#F5F5F5] dark:bg-[#162238] rounded-lg p-0.5">
              {(["preview", "instructions"] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setRightView(view)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all capitalize
                    ${rightView === view
                      ? "bg-white dark:bg-[#111D30] text-[#262626] dark:text-[#C8D8EE] shadow-sm"
                      : "text-[#737373] dark:text-[#7A9BBF] hover:text-[#262626] dark:hover:text-[#C8D8EE]"
                    }`}
                >
                  {view === "preview" ? "Preview Chat" : (
                    <span className="flex items-center gap-1.5">
                      Instructions
                      <span className="px-1 py-0.5 rounded text-[9px] font-bold leading-none bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400">V3</span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Preview Chat */}
          <div className={`flex-1 min-h-0 overflow-hidden ${rightView === "preview" ? "flex flex-col" : "hidden"}`}>
            <LivePreview
              key={widgetKey}
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
              personaUpdated={personaUpdated}
              showDemoConversation={showDemoConversation}
              onDismissPersonaUpdate={() => setPersonaUpdated(false)}
              onStartNewConversation={() => { setPersonaUpdated(false); setShowDemoConversation(false); setWidgetKey((k) => k + 1); }}
            />
          </div>

          {/* Instructions (BuilderChat) */}
          <div className={`flex-1 flex-col overflow-hidden ${rightView === "instructions" ? "flex" : "hidden"}`}>
            <div className="flex-1 flex flex-col overflow-hidden">
              <BuilderChat
              state={state}
              onApply={(patch) => updateState(patch)}
              personaUpdated={personaUpdated}
              onDismissPersonaUpdate={() => setPersonaUpdated(false)}
              onStartNewConversation={() => setPersonaUpdated(false)}
            />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}


