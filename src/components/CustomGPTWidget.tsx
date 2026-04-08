"use client";

import { useEffect } from "react";

export default function CustomGPTWidget() {
  useEffect(() => {
    const existing = document.getElementById("customgpt-embed-script");
    if (existing) return;

    const script = document.createElement("script");
    script.id = "customgpt-embed-script";
    script.src = "https://cdn.customgpt.ai/js/embed.js";
    script.defer = true;
    script.setAttribute("div_id", "customgpt_chat");
    script.setAttribute("p_id", "89781");
    script.setAttribute("p_key", "b9d84bb677dee5b0447a8c72cde07dc9");
    document.body.appendChild(script);
  }, []);

  return (
    <div id="customgpt_chat" className="w-full h-full rounded-2xl overflow-hidden" />
  );
}
