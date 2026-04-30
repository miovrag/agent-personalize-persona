"use client";

export const PRESET_AVATARS = [
  {
    id: "male-1", category: "Male", label: "Professional",
    svg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#3730a3"/>
        <path d="M18 100 Q20 72 50 68 Q80 72 82 100Z" fill="#4f46e5"/>
        <path d="M43 68 L47 62 L50 65 L53 62 L57 68Z" fill="#4f46e5"/>
        <rect x="44" y="60" width="12" height="10" rx="3" fill="#fdba74"/>
        <circle cx="50" cy="50" r="19" fill="#fdba74"/>
        <path d="M31 48 Q33 30 50 28 Q67 30 69 48 Q66 36 50 34 Q34 36 31 48Z" fill="#1e293b"/>
        <ellipse cx="43.5" cy="50" rx="2.5" ry="2.5" fill="#1e293b"/>
        <ellipse cx="56.5" cy="50" rx="2.5" ry="2.5" fill="#1e293b"/>
        <path d="M45 57 Q50 61 55 57" stroke="#92400e" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "male-2", category: "Male", label: "Casual",
    svg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#065f46"/>
        <path d="M18 100 Q20 72 50 68 Q80 72 82 100Z" fill="#059669"/>
        <rect x="44" y="60" width="12" height="10" rx="3" fill="#fcd34d"/>
        <circle cx="50" cy="50" r="19" fill="#fcd34d"/>
        <path d="M31 47 Q34 29 50 27 Q66 29 69 47 Q60 33 50 33 Q40 33 31 47Z" fill="#78350f"/>
        <path d="M31 47 Q33 52 32 55 Q37 45 50 44 Q63 45 68 55 Q67 52 69 47 Q60 33 50 33 Q40 33 31 47Z" fill="#92400e"/>
        <ellipse cx="43.5" cy="50" rx="2.5" ry="2.5" fill="#1e293b"/>
        <ellipse cx="56.5" cy="50" rx="2.5" ry="2.5" fill="#1e293b"/>
        <path d="M44 58 Q50 62 56 58" stroke="#92400e" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M40 62 Q43 64 46 63 M54 63 Q57 64 60 62" stroke="#92400e" strokeWidth="1" fill="none" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "female-1", category: "Female", label: "Professional",
    svg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#6d28d9"/>
        <path d="M15 100 Q18 70 50 66 Q82 70 85 100Z" fill="#7367F0"/>
        <rect x="44" y="60" width="12" height="10" rx="3" fill="#fca5a5"/>
        <circle cx="50" cy="50" r="19" fill="#fca5a5"/>
        <path d="M31 46 Q31 28 50 26 Q69 28 69 46" fill="#1e293b"/>
        <path d="M31 46 Q29 55 30 62 Q32 56 31 50Z" fill="#1e293b"/>
        <path d="M69 46 Q71 55 70 62 Q68 56 69 50Z" fill="#1e293b"/>
        <path d="M30 62 Q28 72 32 80 Q38 70 31 62Z" fill="#1e293b"/>
        <path d="M70 62 Q72 72 68 80 Q62 70 69 62Z" fill="#1e293b"/>
        <ellipse cx="43.5" cy="50" rx="2.2" ry="2.5" fill="#1e293b"/>
        <ellipse cx="56.5" cy="50" rx="2.2" ry="2.5" fill="#1e293b"/>
        <path d="M41 46 Q44 44 47 45" stroke="#1e293b" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <path d="M53 45 Q56 44 59 46" stroke="#1e293b" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <path d="M45 57 Q50 61 55 57" stroke="#be123c" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "female-2", category: "Female", label: "Casual",
    svg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#b45309"/>
        <path d="M16 100 Q19 71 50 67 Q81 71 84 100Z" fill="#d97706"/>
        <rect x="44" y="60" width="12" height="10" rx="3" fill="#fed7aa"/>
        <circle cx="50" cy="50" r="19" fill="#fed7aa"/>
        <circle cx="50" cy="29" r="9" fill="#b45309"/>
        <ellipse cx="50" cy="32" rx="7" ry="5" fill="#d97706"/>
        <path d="M41 32 Q50 24 59 32 Q57 27 50 26 Q43 27 41 32Z" fill="#92400e"/>
        <ellipse cx="43.5" cy="50" rx="2.2" ry="2.5" fill="#1e293b"/>
        <ellipse cx="56.5" cy="50" rx="2.2" ry="2.5" fill="#1e293b"/>
        <path d="M41 46 Q44 44 47 45" stroke="#1e293b" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <path d="M53 45 Q56 44 59 46" stroke="#1e293b" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <path d="M45 57 Q50 61 55 57" stroke="#be123c" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <circle cx="43" cy="52" r="1.5" fill="#fda4af" opacity="0.7"/>
        <circle cx="57" cy="52" r="1.5" fill="#fda4af" opacity="0.7"/>
      </svg>
    ),
  },
  {
    id: "ai-1", category: "AI", label: "Bot",
    svg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#0f172a"/>
        <rect x="27" y="35" width="46" height="36" rx="8" fill="#1e293b" stroke="#7367F0" strokeWidth="1.5"/>
        <rect x="35" y="44" width="12" height="9" rx="3" fill="#7367F0" opacity="0.9"/>
        <rect x="53" y="44" width="12" height="9" rx="3" fill="#7367F0" opacity="0.9"/>
        <ellipse cx="41" cy="48.5" rx="3.5" ry="3.5" fill="#a78bfa"/>
        <ellipse cx="59" cy="48.5" rx="3.5" ry="3.5" fill="#a78bfa"/>
        <rect x="43" y="57" width="14" height="3" rx="1.5" fill="#7367F0"/>
        <rect x="48" y="27" width="4" height="10" rx="2" fill="#7367F0"/>
        <circle cx="50" cy="25" r="3" fill="#a78bfa"/>
        <rect x="23" y="47" width="6" height="3" rx="1.5" fill="#7367F0"/>
        <rect x="71" y="47" width="6" height="3" rx="1.5" fill="#7367F0"/>
        <path d="M35 71 Q50 78 65 71" stroke="#7367F0" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "ai-2", category: "AI", label: "Flow",
    svg: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#0c1a2e"/>
        <circle cx="50" cy="50" r="8" fill="#06b6d4" opacity="0.9"/>
        <circle cx="25" cy="35" r="5" fill="#22d3ee" opacity="0.7"/>
        <circle cx="75" cy="35" r="5" fill="#22d3ee" opacity="0.7"/>
        <circle cx="25" cy="65" r="5" fill="#22d3ee" opacity="0.7"/>
        <circle cx="75" cy="65" r="5" fill="#22d3ee" opacity="0.7"/>
        <circle cx="50" cy="20" r="4" fill="#67e8f9" opacity="0.6"/>
        <circle cx="50" cy="80" r="4" fill="#67e8f9" opacity="0.6"/>
        <line x1="50" y1="42" x2="50" y2="24" stroke="#06b6d4" strokeWidth="1.2" opacity="0.6"/>
        <line x1="50" y1="58" x2="50" y2="76" stroke="#06b6d4" strokeWidth="1.2" opacity="0.6"/>
        <line x1="43" y1="45" x2="29" y2="37" stroke="#06b6d4" strokeWidth="1.2" opacity="0.6"/>
        <line x1="57" y1="45" x2="71" y2="37" stroke="#06b6d4" strokeWidth="1.2" opacity="0.6"/>
        <line x1="43" y1="55" x2="29" y2="63" stroke="#06b6d4" strokeWidth="1.2" opacity="0.6"/>
        <line x1="57" y1="55" x2="71" y2="63" stroke="#06b6d4" strokeWidth="1.2" opacity="0.6"/>
        <circle cx="50" cy="50" r="14" stroke="#06b6d4" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4"/>
        <circle cx="50" cy="50" r="25" stroke="#22d3ee" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.3"/>
      </svg>
    ),
  },
] as const;

export type PresetAvatarId = typeof PRESET_AVATARS[number]["id"];

export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export function InitialsAvatar({ initials }: { initials: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#7367F0"/>
      <text
        x="50" y="50"
        dominantBaseline="central"
        textAnchor="middle"
        fontSize="32"
        fontWeight="700"
        fontFamily="Inter, system-ui, sans-serif"
        fill="white"
        letterSpacing="1"
      >
        {initials}
      </text>
    </svg>
  );
}
