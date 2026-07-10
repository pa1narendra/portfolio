"use client";

import { useEffect, useRef, useState } from "react";

// A living miniature of MoneyCap: SMS arrives, gets parsed on-device,
// lands in the ledger. Now a sandbox too — type your own transaction SMS
// and watch the parser pull out the amount and merchant in real time.
const SMS: { text: string; label: string; amt: number }[] = [
  { text: "INR 240.00 debited from a/c **4321 — SWIGGY", label: "food · swiggy", amt: -240 },
  { text: "INR 12,000.00 credited to a/c **4321 — SALARY", label: "income · salary", amt: 12000 },
  { text: "INR 549.00 debited from a/c **4321 — AMZN", label: "shopping · amazon", amt: -549 },
  { text: "INR 89.00 debited from a/c **4321 — METRO", label: "transit · metro", amt: -89 },
  { text: "INR 1,150.00 debited from a/c **4321 — BESCOM", label: "bills · electricity", amt: -1150 },
];

type Row = { label: string; amt: number };
type Parsed = { text: string; amtStr: string; merchant: string; amt: number } | null;

const fmt = (n: number) =>
  (n < 0 ? "−" : "+") + "₹" + Math.abs(n).toLocaleString("en-IN");

// the same shape of multi-stage parse the real app does, in miniature
function parseSms(text: string): Parsed {
  const m = text.match(/(?:INR|RS\.?|₹)\s*([\d,]+(?:\.\d{1,2})?)/i);
  if (!m) return null;
  const amount = parseFloat(m[1].replace(/,/g, ""));
  if (!isFinite(amount) || amount <= 0) return null;
  const credit = /credit/i.test(text);
  const merchant = (
    text.match(/(?:at|@|for|to|—|-)\s+([A-Za-z0-9 &.']{2,24})\s*$/i)?.[1] ?? "unknown"
  ).trim();
  return { text, amtStr: m[0], merchant, amt: credit ? amount : -amount };
}

export default function MoneyMachine() {
  const [idx, setIdx] = useState(0);
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [draft, setDraft] = useState("");
  const [custom, setCustom] = useState<Parsed>(null);
  const [parseError, setParseError] = useState(false);
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
              setRows((p) => [{ label: SMS[i].label, amt: SMS[i].amt }, ...p].slice(0, 3));
              setTotal((t) => t + SMS[i].amt);
              return (i + 1) % SMS.length;
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

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const parsed = parseSms(text);
    if (!parsed) {
      setParseError(true);
      setTimeout(() => setParseError(false), 2200);
      return;
    }
    setDraft("");
    setCustom(parsed);
    setTimeout(() => {
      setRows((p) =>
        [{ label: `yours · ${parsed.merchant.toLowerCase()}`, amt: parsed.amt }, ...p].slice(0, 3),
      );
      setTotal((t) => t + parsed.amt);
      setCustom(null);
    }, 1400);
  };

  // highlight the tokens the parser found inside the custom bubble
  const highlighted = (p: NonNullable<Parsed>) => {
    const parts: React.ReactNode[] = [];
    let rest = p.text;
    const ai = rest.indexOf(p.amtStr);
    if (ai >= 0) {
      parts.push(rest.slice(0, ai));
      parts.push(<mark key="a" className="tok-amt">{p.amtStr}</mark>);
      rest = rest.slice(ai + p.amtStr.length);
    }
    const mi = p.merchant !== "unknown" ? rest.lastIndexOf(p.merchant) : -1;
    if (mi >= 0) {
      parts.push(rest.slice(0, mi));
      parts.push(<mark key="m" className="tok-mer">{p.merchant}</mark>);
      parts.push(rest.slice(mi + p.merchant.length));
    } else {
      parts.push(rest);
    }
    return parts;
  };

  return (
    <div className="money-wrap" ref={rootRef}>
      <div className="money-machine">
        <div className="phone">
          <span className="phone-notch" aria-hidden="true" />
          <p className="mono phone-label">sms inbox</p>
          {custom ? (
            <div className="bubble mono bubble-custom" key="custom">
              {highlighted(custom)}
            </div>
          ) : (
            <div className="bubble mono" key={idx}>
              {SMS[idx].text}
            </div>
          )}
          <form
            className="sms-form"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <input
              className="sms-input mono"
              value={draft}
              maxLength={70}
              placeholder="try your own: INR 450 debited at STARBUCKS"
              aria-label="type a transaction sms to parse"
              onChange={(e) => setDraft(e.target.value)}
            />
            <button type="submit" className="sms-send mono" aria-label="parse this sms">
              parse ↵
            </button>
          </form>
          {parseError && (
            <p className="mono sms-error">✗ no amount found · include INR / ₹ and a number</p>
          )}
        </div>
        <div className="parse-arrow mono" aria-hidden="true">
          → parsed on device →
        </div>
        <div className="ledger">
          <p className="mono phone-label">ledger</p>
          {rows.map((r, k) => (
            <div className="ledger-row mono" key={`${r.label}-${k}`}>
              <span>{r.label}</span>
              <span className={r.amt > 0 ? "credit" : "debit"}>{fmt(r.amt)}</span>
            </div>
          ))}
          <div className="ledger-total mono">
            <span>running total</span>
            <span>{fmt(total)}</span>
          </div>
        </div>
      </div>
      <p className="artifact-caption mono">no typing needed in the real app. but here, try the parser.</p>
    </div>
  );
}
