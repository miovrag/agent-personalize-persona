"use client";

import Sidebar from "@/components/Sidebar";
import PersonaEditor from "@/components/PersonaEditor";

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-[#0B1426]">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <PersonaEditor />
      </main>
    </div>
  );
}
