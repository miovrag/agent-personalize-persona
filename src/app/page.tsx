"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import PersonaEditor from "@/components/PersonaEditor";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-[#0B1426]">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 xl:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — drawer on mobile/tablet, collapsible on desktop */}
      <div
        className={`fixed xl:static inset-y-0 left-0 z-50 xl:z-auto shrink-0 xl:overflow-hidden
          transition-[width,transform] duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"}
          ${sidebarCollapsed ? "xl:w-0" : "xl:w-[268px]"}`}
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
