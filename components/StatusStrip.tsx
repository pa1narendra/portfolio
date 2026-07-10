"use client";

import { useEffect, useState } from "react";

// Live status line under the hero: real ticking clock, real claims.
export default function StatusStrip() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour12: false,
        }),
      );
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="status-strip mono" aria-label="live status">
      <span className="status-dot" aria-hidden="true" />
      <span>all demos operational</span>
      <span className="status-sep">·</span>
      <span>shipping since 2024</span>
      <span className="status-sep">·</span>
      <span suppressHydrationWarning>{time ? `IST ${time}` : "IST —:—:—"}</span>
    </div>
  );
}
