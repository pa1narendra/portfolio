"use client";

import { useEffect, useRef, useState } from "react";
import { log } from "@/lib/content";

// The log replays itself as a git history when it scrolls into view.
const fakeHash = (s: string) => {
  let h = 2166136261;
  for (const c of s) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "a").slice(0, 7);
};

export default function GitLog() {
  const [shown, setShown] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const total = log.entries.length;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const t = setTimeout(() => setShown(total + 1), 0);
      return () => clearTimeout(t);
    }
    let timer: ReturnType<typeof setInterval> | null = null;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !timer) {
          io.disconnect();
          timer = setInterval(() => {
            setShown((s) => {
              if (s >= total + 1) {
                if (timer) clearInterval(timer);
                return s;
              }
              return s + 1;
            });
          }, 480);
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) clearInterval(timer);
    };
  }, [total]);

  return (
    <div className="term" ref={ref}>
      <div className="term-bar">
        <span className="term-dot" />
        <span className="term-dot" />
        <span className="term-dot" />
        <span className="term-title mono">~/pavan — git log --oneline --reverse</span>
      </div>
      <div className="term-body mono">
        {log.entries.slice(0, shown).map((e, i) => (
          <p className="term-line" key={e.id}>
            <span className="term-hash">{fakeHash(e.id)}</span>
            <span className="term-date">{e.date}</span>
            <span className="term-msg">
              {e.text}
              {i === total - 1 && shown > total - 1 && (
                <span className="term-head"> ← HEAD</span>
              )}
            </span>
          </p>
        ))}
        {shown > total && (
          <p className="term-line term-prompt">
            <span className="term-hash">$</span>
            <span className="term-msg">
              git log --future <span className="caret" aria-hidden="true" />
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
