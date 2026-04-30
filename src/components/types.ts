export interface PersonaState {
  agentName: string;
  role: string;
  mission: string;
  audience: string;
  tone: number; // 0 = Formal, 100 = Conversational
  styles: string[];
  guardrails: string[];
  behaviorToggles: string[];
  boundaries: string;
  outputStyle: string;
  additionalInstructions: string;
  outcomes: string[];
  // Conversation tab
  iDontKnowMessage: string;
  starterQuestions: string[];
  useContextRichStarters: boolean;
  starterQuestionsHeader: string;
  starterQuestionsExpand: string;
  starterQuestionsCollapse: string;
  agentLanguage: string;
  placeholderPrompt: string;
  loadingIndicator: "typing-dots" | "custom-message" | "background-activity";
  backgroundActivityMessages: string[];
  loadingCustomMessage: string;
  customMessageEnding: string;
  errorMessage: string;
  failedModerationMessage: string;
  conversationDuration: "unlimited" | "24-hour-memory" | "24-hour-close";
  markdownInResponses: "enabled" | "disabled";
  // Security tab
  antiHallucination: "enabled" | "disabled";
  agentVisibility: "private" | "public";
  recaptcha: "enabled" | "disabled";
  whitelistedDomains: string;
  retentionPeriod: "custom" | "12-months" | "never";
  retentionDays: number;
  // Advanced tab
  conversationHistory: "everyone" | "team-members" | "hidden";
  titleAvatarEnabled: boolean;
  spotlightAvatarEnabled: boolean;
  spotlightAvatarType: "special" | "main";
  spotlightAvatarShape: "rectangular" | "round";
  userAvatarEnabled: boolean;
  userAvatarUploadUrl: string;
  avatarOrientation: "agent-left-user-right" | "agent-right-user-left" | "both-left" | "both-right";
  titleAvatarAlignment: "left" | "center" | "right";
  inChatAgentAvatar: boolean;
  inChatUserAvatar: boolean;
  affiliateId: string;
  termsOfService: string;
  userFeedback: "enabled" | "disabled";
  showCopyButton: "enabled" | "disabled";
  conversationSharing: "enabled" | "disabled";
  conversationExporting: "enabled" | "disabled";
  removeBranding: boolean;
  agentTitle: string;
  titleColor: string;
  // Intelligence tab
  nextGenEnabled: boolean;
  primaryGoal: "speed" | "optimal" | "accuracy" | "understanding";
  aiModel: string;
  dataSource: "my-data" | "my-data-plus-llm";
  userAwareness: boolean;
  // Citations tab
  enableCitations: boolean;
  numberedCitations: boolean;
  renderImageCitationsInline: boolean;
  limitImageCitationHeight: boolean;
  useOpenGraphImages: boolean;
  maxImagesPerResponse: "1" | "2" | "3" | "unlimited";
  classicCitations: boolean;
  citationHeader: string;
  citationLabel: string;
  citationDisplayState: "opened" | "closed";
  enablePdfViewer: boolean;
  autoOpenPdfViewer: boolean;
  preventPdfDownload: boolean;
  allowKnowledgeBaseQueries: boolean;
  enableNumericSearch: boolean;
  typingIndicatorStyle: "dots" | "wave" | "pulse" | "bars";
  // General tab
  agentRole: string;
  agentAvatarUrl: string;
  agentColorScheme: "adaptive" | "legacy";
  agentColor: string;
  agentStyle: "sharp" | "soft" | "round";
  fontFamily: "inter" | "public-sans" | "nunito" | "merriweather" | "roboto";
  backgroundType: "image" | "color";
  backgroundColor: string;
  backgroundImageUrl: string;
}

export const AGENT_ROLE_OPTIONS = [
  "Enterprise Search",
  "Customer Support",
  "Sales Assistant",
  "HR Assistant",
  "Knowledge Base",
  "Product Guide",
  "Legal Assistant",
  "IT Helpdesk",
];

export const STYLE_OPTIONS = [
  "Direct",
  "Empathetic",
  "Technical",
  "Friendly",
  "Concise",
  "Detailed",
];

export const GUARDRAIL_PRESETS = [
  "Refuse off-topic questions",
  "Never share personal data",
  "Always cite sources",
  "Escalate to human if unsure",
  "Avoid opinions on sensitive topics",
];

export const BEHAVIOR_TOGGLE_OPTIONS = [
  { id: "steps", label: "Always provide steps" },
  { id: "institution", label: "Always mention responsible institution" },
  { id: "clarify", label: "Ask clarifying question before final answer" },
  { id: "cite", label: "Cite source when possible" },
] as const;

export const OUTPUT_STYLE_OPTIONS = [
  { id: "short-steps", label: "Short + Steps" },
  { id: "bullets", label: "Bullet points" },
  { id: "detailed", label: "Detailed explanation" },
  { id: "step-guide", label: "Step-by-step guide" },
  { id: "summary", label: "Summary + details" },
] as const;

export const OUTCOME_OPTIONS = [
  {
    id: "ticket",
    icon: "🎫",
    label: "Create support ticket",
    description: "Route unresolved questions to your helpdesk automatically",
  },
  {
    id: "email",
    icon: "✉️",
    label: "Send email summary",
    description: "Email a conversation recap to the user or your team",
  },
  {
    id: "form",
    icon: "📋",
    label: "Fill out a form",
    description: "Collect structured data and submit it to your CRM or database",
  },
  {
    id: "schedule",
    icon: "📅",
    label: "Book a meeting",
    description: "Let users schedule time with your team through the chat",
  },
  {
    id: "search",
    icon: "🔍",
    label: "Search external data",
    description: "Query live APIs or databases during the conversation",
  },
  {
    id: "route",
    icon: "↗️",
    label: "Route to another agent",
    description: "Hand off the conversation to a specialized agent",
  },
];
