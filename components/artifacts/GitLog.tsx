"use client";

import { useEffect, useRef, useState } from "react";
import { log } from "@/lib/content";

// The log replays itself as a git history when it scrolls into view.
// Each message streams in character by character, like a live response,
// instead of whole lines dropping in.
const fakeHash = (s: string) => {
  let h = 2166136261;
  for (const c of s) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "a").slice(0, 7);
};

// ghost characters appended to each line's budget: a beat of silence
// between one commit finishing and the next starting to type
const LINE_PAUSE = 14;

export default function GitLog() {
  const [chars, setChars] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // cumulative char offset at which each line starts typing
  const offsets: number[] = [];
  let acc = 0;
  for (const e of log.entries) {
    offsets.push(acc);
    acc += e.text.length + LINE_PAUSE;
  }
  const total = acc;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const t = setTimeout(() => setChars(total + 1), 0);
      return () => clearTimeout(t);
    }
    let timer: ReturnType<typeof setInterval> | null = null;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !timer) {
          io.disconnect();
          // 1-2 chars every 28ms — a calmer typing pace, with a little jitter
          timer = setInterval(() => {
            setChars((c) => {
              if (c > total) {
                if (timer) clearInterval(timer);
                return c;
              }
              return c + 1 + (Math.random() < 0.4 ? 1 : 0);
            });
          }, 28);
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

  const done = chars > total;

  return (
    <div className="term" ref={ref}>
      <div className="term-bar">
        <span className="term-dot" />
        <span className="term-dot" />
        <span className="term-dot" />
        <span className="term-title mono">~/pavan — git log --oneline --reverse</span>
      </div>
      <div className="term-body mono">
        {log.entries.map((e, i) => {
          const typed = Math.max(0, Math.min(chars - offsets[i], e.text.length));
          if (chars < offsets[i]) return null;
          const typing = !done && typed < e.text.length;
          return (
            <p className="term-line" key={e.id}>
              <span className="term-hash">{fakeHash(e.id)}</span>
              <span className="term-date">{e.date}</span>
              <span className="term-msg">
                {e.text.slice(0, typed)}
                {typing && <span className="caret" aria-hidden="true" />}
                {i === log.entries.length - 1 && typed >= e.text.length && (
                  <span className="term-head"> ← HEAD</span>
                )}
              </span>
            </p>
          );
        })}
        {done && (
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
