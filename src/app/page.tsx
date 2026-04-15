"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import PersonaEditor from "@/components/PersonaEditor";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  const [agentName, setAgentName] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [started, setStarted] = useState(false);

  function handleStart() {
    const name = inputValue.trim();
    if (!name) return;
    setAgentName(name);
    setStarted(true);
  }

  if (!started) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#F5F5F5] dark:bg-[#0B1426]">
        {/* Theme toggle top-right */}
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="flex flex-col items-center gap-6 w-full max-w-md px-6">
          {/* Logo */}
          <img
            src="/customgpt-logo.svg"
            alt="CustomGPT.ai"
            className="h-7 w-auto mb-2"
          />

          {/* Heading */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-[#C8D8EE] mb-2">
              Name your agent
            </h1>
            <p className="text-sm text-gray-400 dark:text-[#7A9BBF]">
              You can change this later.
            </p>
          </div>

          {/* Input */}
          <div className="w-full flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleStart(); }}
              placeholder="e.g. Support Agent, Sales Bot…"
              autoFocus
              className="flex-1 px-4 py-3 text-sm rounded-xl border border-gray-200 dark:border-[#1E3050] outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900 bg-white dark:bg-[#162238] text-gray-800 dark:text-[#C8D8EE] placeholder:text-gray-400 dark:placeholder:text-[#7A9BBF] transition-all"
            />
            <button
              onClick={handleStart}
              disabled={!inputValue.trim()}
              className="px-5 py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors shrink-0"
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-[#0B1426]">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <PersonaEditor initialName={agentName} />
      </main>
    </div>
  );
}
