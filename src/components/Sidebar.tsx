"use client";

const NAV_ITEMS = [
  { icon: "⚙", label: "Build" },
  { icon: "✦", label: "Personalize", active: true },
  { icon: "⚡", label: "Actions" },
  { icon: "💬", label: "Ask" },
  { icon: "🚀", label: "Deploy" },
  { icon: "📊", label: "Analyze" },
];

const AGENTS = [
  { name: "Grad Niš", initials: "GN", color: "#dc2626" },
  { name: "Support Bot", initials: "SB", color: "#7c3aed" },
  { name: "HR Assistant", initials: "HR", color: "#0891b2" },
];

export default function Sidebar() {
  return (
    <aside className="w-[220px] shrink-0 flex flex-col h-full border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <circle cx="8" cy="8" r="2" fill="white"/>
            </svg>
          </div>
          <span className="text-sm font-bold text-gray-800">CustomGPT.ai</span>
        </div>
        <button className="text-gray-400 hover:text-gray-600 text-xs">☰</button>
      </div>

      {/* New Agent button */}
      <div className="px-3 py-3">
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors">
          <span className="text-base leading-none">+</span>
          New Agent
        </button>
      </div>

      {/* Current agent */}
      <div className="px-3 pb-1">
        <div className="px-2 py-1.5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Current Agent</p>
          <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
            <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white text-[9px] font-bold">
              GN
            </div>
            Grad Niš
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-1 space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left
              ${item.active
                ? "bg-violet-50 text-violet-700 font-semibold"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
              }`}
          >
            <span className="text-base leading-none w-4 text-center">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Copilot */}
      <div className="px-3 py-3 border-t border-gray-100">
        <p className="text-xs font-semibold text-gray-400 mb-2">CustomGPT.ai Copilot</p>
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
          <span className="text-xs text-gray-400 flex-1">I need help with...</span>
          <button className="text-violet-500 hover:text-violet-700">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1L11 6L6 11M1 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 pb-4 space-y-0.5 border-t border-gray-100 pt-3">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          <span className="text-base">⟨⟩</span> Developers
          <span className="ml-auto text-gray-300 text-xs">›</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-[9px] font-bold text-gray-600">
            MR
          </div>
          My Profile
          <span className="ml-auto text-gray-300 text-xs">›</span>
        </button>
      </div>
    </aside>
  );
}
