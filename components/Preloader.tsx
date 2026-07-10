"use client";

import { useEffect, useState } from "react";

// Boot sequence: name + counting line → anime Einstein waves hello →
// the shutters split open and he's gone. A greeting, not a mascot.
function Einstein({ waving }: { waving: boolean }) {
  return (
    <div className="ein-wrap">
      <span className="ein-bubble mono">hello!</span>
      <svg
        className={`ein${waving ? " waving" : ""}`}
        viewBox="0 0 170 180"
        width="170"
        height="180"
        aria-hidden="true"
      >
        {/* waving arm (behind body) */}
        <g className="ein-arm">
          <path
            d="M118 118 Q142 100 146 72"
            fill="none"
            stroke="#e8e6ef"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <circle cx="147" cy="66" r="8.5" fill="#f2e4d5" stroke="#2a2833" strokeWidth="2" />
        </g>
        {/* body: suit */}
        <path d="M52 178 L52 132 Q52 112 85 112 Q118 112 118 132 L118 178 Z" fill="#2a2833" />
        {/* shirt + bow */}
        <path d="M74 114 L85 132 L96 114 Z" fill="#f1f0f5" />
        <path d="M79 120 L85 126 L91 120 L85 116 Z" fill="#a5763b" />
        {/* resting arm */}
        <path d="M56 124 Q42 138 44 156" fill="none" stroke="#e8e6ef" strokeWidth="9" strokeLinecap="round" />
        {/* wild hair — spiky cloud */}
        <path
          d="M85 8
             Q100 4 108 16 Q124 12 128 26 Q144 26 142 42 Q154 48 146 60
             Q152 72 140 76 Q142 88 128 86 Q120 96 110 88
             L60 88
             Q50 96 42 86 Q28 88 30 76 Q18 72 24 60 Q16 48 28 42 Q26 26 42 26 Q46 12 62 16 Q70 4 85 8 Z"
          fill="#e8e6ef"
          stroke="#2a2833"
          strokeWidth="2.5"
        />
        {/* face */}
        <circle cx="85" cy="62" r="30" fill="#f2e4d5" stroke="#2a2833" strokeWidth="2.5" />
        {/* hair overlaps forehead */}
        <path d="M56 52 Q60 34 85 32 Q110 34 114 52 Q102 40 85 40 Q68 40 56 52 Z" fill="#e8e6ef" />
        {/* bushy eyebrows */}
        <path d="M62 52 Q70 46 78 51" fill="none" stroke="#dcd9e6" strokeWidth="5" strokeLinecap="round" />
        <path d="M92 51 Q100 46 108 52" fill="none" stroke="#dcd9e6" strokeWidth="5" strokeLinecap="round" />
        {/* anime eyes */}
        <ellipse cx="71" cy="60" rx="6" ry="7" fill="#fff" stroke="#2a2833" strokeWidth="1.6" />
        <ellipse cx="99" cy="60" rx="6" ry="7" fill="#fff" stroke="#2a2833" strokeWidth="1.6" />
        <circle cx="72.5" cy="61" r="3" fill="#2a2833" />
        <circle cx="100.5" cy="61" r="3" fill="#2a2833" />
        <circle cx="73.8" cy="59.4" r="1.1" fill="#fff" />
        <circle cx="101.8" cy="59.4" r="1.1" fill="#fff" />
        {/* nose */}
        <path d="M85 62 Q82 70 86 72" fill="none" stroke="#2a2833" strokeWidth="2" strokeLinecap="round" />
        {/* the mustache */}
        <path
          d="M68 77 Q76 70 85 76 Q94 70 102 77 Q97 85 85 81 Q73 85 68 77 Z"
          fill="#e8e6ef"
          stroke="#2a2833"
          strokeWidth="2"
        />
        {/* smile under mustache */}
        <path d="M79 87 Q85 91 91 87" fill="none" stroke="#2a2833" strokeWidth="2" strokeLinecap="round" />
        {/* chalk formula floating */}
        <text x="14" y="118" className="ein-formula">
          E=mc²
        </text>
      </svg>
    </div>
  );
}

export default function Preloader() {
  const [phase, setPhase] = useState<"fill" | "greet" | "split" | "gone">("fill");
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("gone");
      return;
    }
    // full boot + Einstein only once per session; instant entry after
    if (sessionStorage.getItem("pnp.visited")) {
      setPhase("gone");
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const tick = () => {
      const p = Math.min(100, Math.round(((performance.now() - t0) / 1400) * 100));
      setPct(p);
      if (p < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const t1 = setTimeout(() => setPhase("greet"), 1500);
    const t2 = setTimeout(() => setPhase("split"), 3050);
    const t3 = setTimeout(() => {
      setPhase("gone");
      sessionStorage.setItem("pnp.visited", "1");
    }, 4050);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div className={`boot${phase === "split" ? " split" : ""}`} aria-hidden="true">
      <div className="boot-panel top" />
      <div className="boot-panel bottom" />
      {phase === "fill" ? (
        <div className="boot-stamp mono">
          <span className="boot-name">PAVAN NARENDRA PEELA</span>
          <span className="boot-line">
            <span className="boot-fill" />
          </span>
          <span className="boot-meta">loading the machines · {pct}%</span>
        </div>
      ) : (
        <div className="boot-stamp">
          <Einstein waving={phase === "greet"} />
        </div>
      )}
      <span className="boot-pct mono" aria-hidden="true">
        {pct}
      </span>
    </div>
  );
}
