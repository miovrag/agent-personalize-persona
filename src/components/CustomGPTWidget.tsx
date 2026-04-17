"use client";

import { useEffect, useRef } from "react";

interface Props {
  reloadKey: number;
}

export default function CustomGPTWidget({ reloadKey }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const chat = chatRef.current;
    if (!wrapper || !chat) return;

    const existing = document.getElementById("customgpt-embed-script");
    if (existing) existing.remove();
    chat.innerHTML = "";

    // Pin the chat div to the wrapper's current pixel height so the iframe
    // inherits a concrete value rather than inflating via its own content.
    const pinHeight = () => {
      const h = wrapper.clientHeight;
      if (h > 0) {
        chat.style.height = `${h}px`;
        const iframe = chat.querySelector("iframe");
        if (iframe) {
          iframe.style.height = `${h}px`;
          iframe.style.minHeight = `${h}px`;
          iframe.style.maxHeight = `${h}px`;
        }
      }
    };

    // Measure before the embed inflates the div.
    pinHeight();

    const script = document.createElement("script");
    script.id = "customgpt-embed-script";
    script.src = "https://cdn.customgpt.ai/js/embed.js";
    script.defer = true;
    script.setAttribute("div_id", "customgpt_chat");
    script.setAttribute("p_id", "89781");
    script.setAttribute("p_key", "b9d84bb677dee5b0447a8c72cde07dc9");
    document.body.appendChild(script);

    // Re-pin when the WRAPPER resizes (window resize, panel resize).
    const ro = new ResizeObserver(pinHeight);
    ro.observe(wrapper);

    // Re-pin once the iframe appears.
    const mo = new MutationObserver(pinHeight);
    mo.observe(chat, { childList: true, subtree: true });

    return () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, [reloadKey]);

  return (
    <div ref={wrapperRef} className="w-full h-full">
      <div ref={chatRef} id="customgpt_chat" className="w-full" />
    </div>
  );
}
