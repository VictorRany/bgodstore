"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CrownScene = dynamic(() => import("./CrownScene"), { ssr: false, loading: () => <CrownFallback /> });

type Mode = "pending" | "3d" | "static";

function canUseWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Decide entre a coroa 3D e o fallback estático.
 * O bundle do three.js só é baixado quando o navegador está ocioso e o 3D é suportado.
 */
export function HeroVisual({ scroll }: { scroll: React.RefObject<number> }) {
  const [mode, setMode] = useState<Mode>("pending");
  const [lowPower, setLowPower] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    const saveData = nav.connection?.saveData === true;
    if (reduced || saveData || !canUseWebGL()) {
      setMode("static");
      return;
    }
    setLowPower(window.innerWidth < 768 || (nav.deviceMemory ?? 8) <= 4 || (navigator.hardwareConcurrency ?? 8) <= 4);
    const start = () => setMode("3d");
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 1200 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 300);
    return () => clearTimeout(id);
  }, []);

  if (mode === "3d") return <CrownScene scroll={scroll} lowPower={lowPower} />;
  return <CrownFallback />;
}

/** Coroa estática em SVG com acabamento cromado — leve e sem JavaScript de 3D. */
export function CrownFallback() {
  return (
    <div aria-hidden className="absolute inset-0 grid place-items-center md:translate-x-[11%]">
      <svg viewBox="0 0 400 300" className="w-[min(72vw,520px)] drop-shadow-[0_40px_60px_rgba(0,0,0,0.9)]">
        <defs>
          <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.28" stopColor="#8d8d8d" />
            <stop offset="0.42" stopColor="#1b1b1b" />
            <stop offset="0.52" stopColor="#e6e6e6" />
            <stop offset="0.7" stopColor="#5e5e5e" />
            <stop offset="1" stopColor="#f2f2f2" />
          </linearGradient>
          <linearGradient id="band" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f5f5f5" />
            <stop offset="0.45" stopColor="#4a4a4a" />
            <stop offset="0.55" stopColor="#d0d0d0" />
            <stop offset="1" stopColor="#2a2a2a" />
          </linearGradient>
        </defs>
        <path
          d="M60 210 L70 110 Q100 150 130 120 L150 60 Q180 120 200 40 Q220 120 250 60 L270 120 Q300 150 330 110 L340 210 Z"
          fill="url(#chrome)"
        />
        {[70, 150, 200, 250, 330].map((x, i) => (
          <circle key={x} cx={x} cy={[104, 54, 32, 54, 104][i]} r="9" fill="url(#chrome)" />
        ))}
        <rect x="52" y="205" width="296" height="44" rx="6" fill="url(#band)" />
        {[110, 200, 290].map((x) => (
          <ellipse key={x} cx={x} cy="227" rx="9" ry="9" fill="#0a0a0a" stroke="#9a9a9a" strokeWidth="1.5" />
        ))}
        <ellipse cx="200" cy="292" rx="150" ry="8" fill="#000" opacity="0.8" />
      </svg>
    </div>
  );
}
