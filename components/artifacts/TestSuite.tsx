"use client";

import { useEffect, useRef, useState } from "react";
import { principles } from "@/lib/content";

// Principles don't get stated here, they get tested. All green.
const SLUGS = [
  "watch_learn_then_build",
  "boring_tech_used_carefully",
  "ship_only_what_i_use",
  "read_the_margins",
  "unshipped_equals_nonexistent",
];

const ms = (i: number) => 9 + ((i * 37) % 28);

export default function TestSuite() {
  const [done, setDone] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const total = principles.length;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDone(total + 1);
      return;
    }
    let timer: ReturnType<typeof setInterval> | null = null;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !timer) {
          io.disconnect();
          timer = setInterval(() => {
            setDone((s) => {
              if (s >= total + 1) {
                if (timer) clearInterval(timer);
                return s;
              }
              return s + 1;
            });
          }, 650);
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
        <span className="term-title mono">~/pavan — npx test principles/</span>
      </div>
      <div className="term-body mono">
        {principles.map((p, i) => {
          const state = i < done ? "pass" : i === done ? "run" : "wait";
          if (state === "wait") return null;
          return (
            <div className="test-block" key={p.no}>
              <p className="term-line">
                {state === "pass" ? (
                  <span className="test-pass">✓</span>
                ) : (
                  <span className="test-run">⟳</span>
                )}
                <span className="term-msg">
                  {SLUGS[i]}
                  {state === "pass" && <span className="test-ms"> ({ms(i)} ms)</span>}
                </span>
              </p>
              {state === "pass" && <p className="test-detail">{p.text}</p>}
            </div>
          );
        })}
        {done > total && (
          <p className="term-line test-summary">
            <span className="test-pass">✓</span>
            <span className="term-msg">
              {total} passed · 0 failed · principles hold under load
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
