"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import PersonaEditor from "@/components/PersonaEditor";

const INTRO_KEY = "cg-persona-intro-seen";

function IntroModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#111D30] rounded-2xl border border-[#E5E5E5] dark:border-[#1E3050] shadow-2xl max-w-md w-full p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#7367F0] flex items-center justify-center shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <h2 className="text-[15px] font-semibold text-[#171717] dark:text-white leading-tight">Personalize your agent</h2>
            <p className="text-[12px] text-[#737373] dark:text-[#94A3B8]">Configure with natural language or the settings panel</p>
          </div>
        </div>

        {/* Features */}
        <ul className="flex flex-col gap-3">
          {[
            {
              icon: (
                <path d="M8 9h8M8 13h6M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>
              ),
              title: "Chat to configure",
              desc: "Type commands like "make the tone more casual" or "use sharp corners" and your agent updates instantly.",
            },
            {
              icon: (
                <><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M9 12l2 2 4-4"/></>
              ),
              title: "Inline settings widgets",
              desc: "Say "change the font" or "loading indicator settings" to open the exact settings panel right in chat.",
            },
            {
              icon: (
                <><circle cx="12" cy="12" r="9"/><path d="M8 12h8M12 8v8"/></>
              ),
              title: "Live preview",
              desc: "Every change is reflected instantly in the preview panel on the right — no save button needed.",
            },
          ].map(({ icon, title, desc }) => (
            <li key={title} className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-lg bg-[#EAE8FD] dark:bg-[#1E2D4A] flex items-center justify-center shrink-0 mt-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7367F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {icon}
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-medium text-[#171717] dark:text-white leading-tight">{title}</p>
                <p className="text-[12px] text-[#737373] dark:text-[#94A3B8] mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#7367F0] hover:bg-[#685DD8] active:bg-[#5C53C0] text-white text-[13px] font-semibold transition-colors"
        >
          Get started
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(INTRO_KEY)) {
      setShowIntro(true);
    }
  }, []);

  function dismissIntro() {
    localStorage.setItem(INTRO_KEY, "1");
    setShowIntro(false);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-[#0B1426]">
      {showIntro && <IntroModal onClose={dismissIntro} />}
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — drawer on mobile/tablet, collapsible on desktop */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 lg:z-auto shrink-0 lg:overflow-hidden
          transition-[width,transform] duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${sidebarCollapsed ? "lg:w-0" : "lg:w-[268px]"}`}
      >
        <Sidebar
          onClose={() => setSidebarOpen(false)}
          onToggleCollapse={() => setSidebarCollapsed(true)}
        />
      </div>

      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <PersonaEditor
          onMenuClick={() => setSidebarOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
          onExpandSidebar={() => setSidebarCollapsed(false)}
        />
      </main>
    </div>
  );
}
