"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors text-sm font-medium
        border-[#E5E5E5] text-[#525252] bg-white hover:bg-[#FAFAFA]
        dark:border-[#1E3050] dark:text-[#7A9BBF] dark:bg-[#111D30] dark:hover:bg-[#162238]"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path d="M7.5 1v1M7.5 13v1M1 7.5H0M15 7.5h-1M3.05 3.05l-.7-.7M12.65 12.65l-.7-.7M3.05 11.95l-.7.7M12.65 2.35l-.7.7M10.5 7.5a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      ) : (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path d="M12.5 9.5a6 6 0 01-7.5-7.5A6.5 6.5 0 1012.5 9.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
