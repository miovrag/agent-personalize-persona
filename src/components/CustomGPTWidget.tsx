"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

export default function CustomGPTWidget() {
  const initialized = useRef(false);

  const init = () => {
    if (initialized.current) return;
    // @ts-ignore
    if (typeof window !== "undefined" && window.CustomGPT) {
      initialized.current = true;
      // @ts-ignore
      window.CustomGPT.init({
        p_id: "89781",
        p_key: "b9d84bb677dee5b0447a8c72cde07dc9",
      });
    }
  };

  return (
    <Script
      src="https://cdn.customgpt.ai/js/chat.js"
      strategy="afterInteractive"
      onLoad={init}
    />
  );
}
