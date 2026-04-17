"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import PersonaEditor from "@/components/PersonaEditor";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-[#0B1426]">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 xl:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — drawer on mobile/tablet, always visible on desktop */}
      <div
        className={`fixed xl:static inset-y-0 left-0 z-50 xl:z-auto transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"}`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <PersonaEditor onMenuClick={() => setSidebarOpen(true)} />
      </main>
    </div>
  );
}
