"use client";

import { useEffect } from "react";

interface Props {
  reloadKey: number;
}

export default function CustomGPTWidget({ reloadKey }: Props) {
  useEffect(() => {
    // Remove old script so it re-initialises on new key
    const existing = document.getElementById("customgpt-embed-script");
    if (existing) existing.remove();

    // Clear the div so the widget re-renders cleanly
    const div = document.getElementById("customgpt_chat");
    if (div) div.innerHTML = "";

    const script = document.createElement("script");
    script.id = "customgpt-embed-script";
    script.src = "https://cdn.customgpt.ai/js/embed.js";
    script.defer = true;
    script.setAttribute("div_id", "customgpt_chat");
    script.setAttribute("p_id", "89781");
    script.setAttribute("p_key", "b9d84bb677dee5b0447a8c72cde07dc9");
    document.body.appendChild(script);
  }, [reloadKey]);

  return (
    <div id="customgpt_chat" className="w-full rounded-2xl overflow-hidden" style={{ height: "100%" }} />
  );
}
