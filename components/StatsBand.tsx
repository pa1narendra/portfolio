"use client";

import { useEffect, useRef, useState } from "react";
import { stats } from "@/lib/content";

// A full-bleed dark band that breaks the pale rhythm and puts the numbers
// on screen as proof. Each value counts up when it scrolls into view.
function parse(value: string) {
  const m = value.match(/([~<>]?)([\d.]+)([k+]?)/i);
  if (!m) return { prefix: "", target: 0, suffix: value, isK: false };
  const isK = /k/i.test(m[3]);
  return { prefix: m[1], target: parseFloat(m[2]), suffix: m[3], isK };
}

function Stat({ value, label }: { value: string; label: string }) {
  const { prefix, target, suffix } = parse(value);
  const [n, setN] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(target);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const dur = 1100;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          setN(target * eased);
          if (t < 1) requestAnimationFrame(tick);
          else setN(target);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  const display = Number.isInteger(target) ? Math.round(n).toString() : n.toFixed(1);

  return (
    <div className="stat" ref={ref}>
      <div className="stat-value">
        <span className="stat-prefix">{prefix}</span>
        {display}
        <span className="stat-suffix">{suffix}</span>
      </div>
      <p className="stat-label">{label}</p>
    </div>
  );
}

export default function StatsBand() {
  return (
    <section className="stats-band" aria-label="by the numbers">
      <div className="stats-inner">
        {stats.map((s) => (
          <Stat key={s.label} value={s.value} label={s.label} />
        ))}
      </div>
    </section>
  );
}
