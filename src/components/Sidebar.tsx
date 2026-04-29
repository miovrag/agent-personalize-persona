"use client";

export default function Sidebar({ onClose, onToggleCollapse }: { onClose?: () => void; onToggleCollapse?: () => void }) {
  return (
    <aside className="w-[268px] shrink-0 flex flex-col h-full border-r border-[#E5E5E5] dark:border-[#1E3050] bg-white dark:bg-[#0B1426] will-change-transform">

      {/* Logo row */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <div className="flex items-center">
          <img src="/customgpt-logo.svg" alt="CustomGPT.ai" height={23} className="h-[23px] w-auto" />
        </div>
        {/* Close button — mobile only */}
        {onClose && (
          <button
            onClick={onClose}
            className="xl:hidden p-1.5 rounded-lg hover:bg-[#F5F5F5] dark:hover:bg-[#1E3050] text-[#737373] dark:text-[#7A9BBF] transition-colors"
            aria-label="Close sidebar"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}
        {/* Layout toggle — desktop only */}
        <button onClick={onToggleCollapse} className="hidden xl:block hover:opacity-70 transition-opacity p-1 rounded">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="4" width="16" height="16" rx="2" stroke="#7367F0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 4V20" stroke="#7367F0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* New Agent button */}
      <div className="px-4 pb-5">
        <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors shadow-sm">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          New Agent
        </button>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {/* Dashboard */}
        <NavItem
          label="Dashboard"
          icon={
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M9 9L12.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="9" cy="9" r="1.5" fill="currentColor"/>
            </svg>
          }
        />

        {/* Agents — active */}
        <NavItem
          label="Agents"
          active
          icon={
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M3 15c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="14" cy="5" r="1.5" fill="currentColor" stroke="white" strokeWidth="1"/>
            </svg>
          }
        />

        {/* Resources */}
        <NavItem
          label="Resources"
          icon={
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="3" y="2" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M6 6h6M6 9h6M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          }
        />

        {/* Slack Community */}
        <NavItem
          label="Slack Community"
          icon={
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="6" height="6" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="10" y="2" width="6" height="6" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="2" y="10" width="6" height="6" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="10" y="10" width="6" height="6" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
          }
        />

        {/* Notifications */}
        <NavItem
          label="Notifications"
          badge={3}
          icon={
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2a5 5 0 00-5 5v3l-1.5 2.5h13L14 10V7a5 5 0 00-5-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M7 14.5c0 1.1.9 2 2 2s2-.9 2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          }
        />
      </nav>

      {/* Copilot */}
      <div className="px-4 py-5">
        <p className="text-sm font-semibold text-[#262626] dark:text-[#C8D8EE] mb-2.5">CustomGPT.ai Copilot</p>
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#E5E5E5] dark:border-[#1E3050] bg-white dark:bg-[#162238] hover:border-gray-300 dark:hover:border-[#1E3050] transition-colors">
          <span className="text-sm text-[#A3A3A3] dark:text-[#7A9BBF] flex-1">I need help with...</span>
          <button className="text-[#A3A3A3] dark:text-[#7A9BBF] hover:text-violet-600 transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#F5F5F5] dark:border-[#1E3050]">
        {/* Developers */}
        <button className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[#FAFAFA] dark:hover:bg-[#1E3050] transition-colors border-b border-[#F5F5F5] dark:border-[#1E3050]">
          <div className="w-9 h-9 rounded-full border-2 border-emerald-500 flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M4 4L1 7l3 3M10 4l3 3-3 3M8 2l-2 10" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-sm font-medium text-[#404040] dark:text-[#C8D8EE]">Developers</span>
          <svg className="ml-auto text-[#A3A3A3] dark:text-[#7A9BBF]" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* My Account */}
        <button className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[#FAFAFA] dark:hover:bg-[#1E3050] transition-colors">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-violet-400 to-pink-400 shrink-0 flex items-center justify-center text-white text-xs font-bold">
            MR
          </div>
          <span className="text-sm font-medium text-[#404040] dark:text-[#C8D8EE]">My Account</span>
          <svg className="ml-auto text-[#A3A3A3] dark:text-[#7A9BBF]" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

    </aside>
  );
}

function NavItem({
  label,
  icon,
  active,
  badge,
}: {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  badge?: number;
}) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors text-left
        ${active ? "text-violet-600 font-semibold" : "text-[#525252] dark:text-[#7A9BBF] hover:bg-[#FAFAFA] dark:hover:bg-[#1E3050] hover:text-[#262626] dark:hover:text-[#C8D8EE] font-medium"}`}
    >
      <span className={active ? "text-violet-600" : "text-[#737373] dark:text-[#7A9BBF]"}>{icon}</span>
      <span className="flex-1">{label}</span>
      {badge != null && (
        <span className="min-w-[20px] h-5 px-1.5 rounded-md bg-red-500 text-white text-[11px] font-bold flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  );
}
