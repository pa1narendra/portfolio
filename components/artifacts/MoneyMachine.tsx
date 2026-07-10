"use client";

import { useEffect, useRef, useState } from "react";

// A living miniature of MoneyCap: SMS arrives, gets parsed on-device,
// lands in the ledger. Runs only while on screen.
const SMS: { text: string; label: string; amt: number }[] = [
  { text: "INR 240.00 debited from a/c **4321 — SWIGGY", label: "food · swiggy", amt: -240 },
  { text: "INR 12,000.00 credited to a/c **4321 — SALARY", label: "income · salary", amt: 12000 },
  { text: "INR 549.00 debited from a/c **4321 — AMZN", label: "shopping · amazon", amt: -549 },
  { text: "INR 89.00 debited from a/c **4321 — METRO", label: "transit · metro", amt: -89 },
  { text: "INR 1,150.00 debited from a/c **4321 — BESCOM", label: "bills · electricity", amt: -1150 },
];

const fmt = (n: number) =>
  (n < 0 ? "−" : "+") + "₹" + Math.abs(n).toLocaleString("en-IN");

export default function MoneyMachine() {
  const [idx, setIdx] = useState(0);
  const [parsed, setParsed] = useState<number[]>([]);
  const [total, setTotal] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const running = useRef(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let timer: ReturnType<typeof setInterval> | null = null;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !running.current) {
          running.current = true;
          timer = setInterval(() => {
            setIdx((i) => {
              const next = (i + 1) % SMS.length;
              setParsed((p) => [i, ...p].slice(0, 3));
              setTotal((t) => t + SMS[i].amt);
              return next;
            });
          }, 2100);
        } else if (!e.isIntersecting && timer) {
          running.current = false;
          clearInterval(timer);
          timer = null;
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) clearInterval(timer);
    };
  }, []);

  return (
    <div className="money-wrap" ref={rootRef}>
      <div className="money-machine">
        <div className="phone">
          <span className="phone-notch" aria-hidden="true" />
          <p className="mono phone-label">sms inbox</p>
          <div className="bubble mono" key={idx}>
            {SMS[idx].text}
          </div>
        </div>
        <div className="parse-arrow mono" aria-hidden="true">
          → parsed on device →
        </div>
        <div className="ledger">
          <p className="mono phone-label">ledger</p>
          {parsed.map((i, k) => (
            <div className="ledger-row mono" key={`${i}-${k}`}>
              <span>{SMS[i].label}</span>
              <span className={SMS[i].amt > 0 ? "credit" : "debit"}>{fmt(SMS[i].amt)}</span>
            </div>
          ))}
          <div className="ledger-total mono">
            <span>running total</span>
            <span>{fmt(total)}</span>
          </div>
        </div>
      </div>
      <p className="artifact-caption mono">no typing. the inbox is the input.</p>
    </div>
  );
}
