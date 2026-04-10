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
}

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
