"use client";

import { useEffect } from "react";

export default function CustomGPTWidget() {
  useEffect(() => {
    // Remove any existing script to avoid duplicates
    const existing = document.getElementById("customgpt-script");
    if (existing) return;

    const script = document.createElement("script");
    script.id = "customgpt-script";
    script.src = "https://cdn.customgpt.ai/js/chat.js";
    script.defer = true;
    script.onload = () => {
      // @ts-ignore
      if (window.CustomGPT) {
        // @ts-ignore
        window.CustomGPT.init({
          p_id: "89781",
          p_key: "b9d84bb677dee5b0447a8c72cde07dc9",
        });
      }
    };
    document.body.appendChild(script);
  }, []);

  return null;
}
