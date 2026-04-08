/**
 * FlashSaleBanner.tsx
 * Top banner: "FLASH SALE ACTIVE" on the left, countdown timer on the right.
 * Now dynamically fetches status from the database.
 */
"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

/** Format seconds → HH:MM:SS */
function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

const INITIAL_SECONDS = 2 * 60 * 60; // 2 hours fallback

export default function FlashSaleBanner() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [seconds, setSeconds] = useState(INITIAL_SECONDS);

  // Fetch settings to check if enabled
  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(data => {
        setEnabled(!!data.flashSaleEnabled);
      })
      .catch(() => setEnabled(false));
  }, []);

  /* Tick every second, reset when it reaches 0 */
  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => {
      setSeconds((prev) => (prev <= 1 ? INITIAL_SECONDS : prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [enabled]);

  if (enabled === null || enabled === false) return null;

  return (
    <div className="flash-banner flash-shimmer">
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Left: sale label */}
        <div className="flex items-center gap-2">
          <Zap size={13} className="fill-current" />
          <span>Flash Sale Active</span>
        </div>

        {/* Right: countdown */}
        <div className="flex items-center gap-2 font-mono text-xs tracking-widest">
          <span className="text-green-200 opacity-80 normal-case font-normal not-italic text-[0.7rem]">
            ENDS IN
          </span>
          <span className="tabular-nums">{formatTime(seconds)}</span>
        </div>
      </div>
    </div>
  );
}
