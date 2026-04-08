import type { PersonaState } from "./types";

function toneDescriptor(tone: number): string {
  if (tone < 20) return "in a formal, precise, and authoritative tone";
  if (tone < 40) return "in a professional and clear tone";
  if (tone < 60) return "in a balanced, approachable tone";
  if (tone < 80) return "in a friendly and conversational tone";
  return "in a warm, casual, and engaging tone";
}

function toneAdverb(tone: number): string {
  if (tone < 30) return "Maintain formal language at all times. Avoid colloquialisms.";
  if (tone < 60) return "Use clear, professional language. Be approachable but precise.";
  return "Use everyday language. Be warm and personable. Contractions are encouraged.";
}

export function generateInstruction(state: PersonaState): string {
  const { role, tone, styles, guardrails, outcomes } = state;

  const roleText = role.trim() || "assist users with their questions";
  const toneText = toneDescriptor(tone);
  const toneStyle = toneAdverb(tone);

  const lines: string[] = [];

  lines.push(`## Role & Scope`);
  lines.push(`You are an AI agent designed to ${roleText}. Respond ${toneText}.`);
  lines.push("");

  lines.push(`## Communication Style`);
  lines.push(toneStyle);
  if (styles.length > 0) {
    lines.push(`Emphasize these qualities in your responses: ${styles.join(", ")}.`);
  }
  lines.push("");

  if (guardrails.length > 0) {
    lines.push(`## Behavior Rules`);
    guardrails.forEach((g) => lines.push(`- ${g}`));
    lines.push("");
  }

  if (outcomes.length > 0) {
    lines.push(`## Capabilities`);
    lines.push(
      `Beyond answering questions, you are enabled to: ${outcomes.join(", ")}.`
    );
    lines.push(
      "Use these capabilities when they serve the user's goal, not proactively."
    );
    lines.push("");
  }

  lines.push(`## Fallback Behavior`);
  lines.push(
    `If you cannot answer a question based on your knowledge base, say so clearly and suggest where the user might find help. Never fabricate information.`
  );

  return lines.join("\n");
}

export function generatePreviewResponse(state: PersonaState): {
  greeting: string;
  response: string;
  suggestions: string[];
} {
  const { role, tone } = state;
  const roleHint = role.trim()
    ? role.trim().toLowerCase()
    : "your questions";

  if (tone < 25) {
    return {
      greeting: `How may I assist you?`,
      response: `I am an AI assistant configured to ${roleHint}. I will provide accurate, documented responses based on verified information. Please state your inquiry precisely.`,
      suggestions: [
        "What is the official process for...?",
        "Can you provide documentation on...?",
        "What are the requirements for...?",
      ],
    };
  }

  if (tone < 50) {
    return {
      greeting: `Hello! How can I help you today?`,
      response: `I'm here to help with ${roleHint}. I can look things up, walk you through processes, and point you in the right direction. What would you like to know?`,
      suggestions: [
        "How does the process work for...?",
        "Can you explain...?",
        "What do I need to do to...?",
      ],
    };
  }

  if (tone < 75) {
    return {
      greeting: `Hi there! What can I help you with?`,
      response: `I'm your go-to for ${roleHint}. Ask me anything — I'll do my best to give you a clear, helpful answer. What's on your mind?`,
      suggestions: [
        "Tell me about...",
        "How do I get started with...?",
        "What's the best way to...?",
      ],
    };
  }

  return {
    greeting: `Hey! Great to see you 👋`,
    response: `I'm here to make ${roleHint} easy for you! Feel free to ask me anything — there are no silly questions. What would you like to explore today?`,
    suggestions: [
      "Hey, quick question about...",
      "I need help with...",
      "Can you walk me through...?",
    ],
  };
}

export function generateExampleQuestions(state: PersonaState): string[] {
  const role = state.role.trim().toLowerCase();
  const tone = state.tone;

  // Formal phrasing (low tone) vs casual (high tone)
  const ask = tone < 40 ? "What is the procedure for" : tone < 70 ? "How do I" : "Can you help me with";
  const tell = tone < 40 ? "Please provide information on" : tone < 70 ? "Tell me about" : "What's the deal with";
  const find = tone < 40 ? "Where can I find documentation regarding" : tone < 70 ? "Where can I find info about" : "Where do I look for";
  const latest = tone < 40 ? "What are the latest decisions regarding" : tone < 70 ? "What are recent updates on" : "What's new with";

  // Derive topic keywords from role
  if (role.includes("city") || role.includes("grad") || role.includes("municipal") || role.includes("official") || role.includes("citizen")) {
    return [
      `${ask} applying for facade renovation co-financing?`,
      `${tell} the city budget for this year`,
      `${find} decisions on urban planning changes`,
      `${latest} public infrastructure projects`,
    ];
  }

  if (role.includes("support") || role.includes("customer") || role.includes("help")) {
    return [
      `${ask} getting a refund?`,
      `${tell} your pricing plans`,
      `${find} your cancellation policy`,
      `${latest} product features`,
    ];
  }

  if (role.includes("hr") || role.includes("employee") || role.includes("human resource")) {
    return [
      `${ask} requesting time off?`,
      `${tell} the onboarding process`,
      `${find} the benefits package details`,
      `${latest} company policies`,
    ];
  }

  if (role.includes("legal") || role.includes("law") || role.includes("compliance")) {
    return [
      `${ask} submitting a legal inquiry?`,
      `${tell} your compliance requirements`,
      `${find} the relevant regulations`,
      `${latest} policy changes`,
    ];
  }

  if (role.includes("health") || role.includes("medical") || role.includes("clinic") || role.includes("patient")) {
    return [
      `${ask} booking an appointment?`,
      `${tell} your available services`,
      `${find} information about my treatment options`,
      `${latest} clinic hours and locations`,
    ];
  }

  // Generic fallback based on role text
  const subject = role.length > 5 ? role.slice(0, 40) : "your services";
  return [
    `${ask} getting started with ${subject}?`,
    `${tell} what you can help me with`,
    `${find} more information about ${subject}`,
    `${latest} updates or changes`,
  ];
}

export function completionScore(state: PersonaState): number {
  let score = 0;
  if (state.role.trim().length > 10) score++;
  if (state.tone !== 50) score++;
  if (state.styles.length > 0) score++;
  if (state.guardrails.length > 0) score++;
  if (state.outcomes.length > 0) score++;
  return score;
}
