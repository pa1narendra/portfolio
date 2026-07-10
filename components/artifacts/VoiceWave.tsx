"use client";

import { useEffect, useRef, useState } from "react";

// A miniature Mockstar interview: a live waveform that stirs when your
// cursor moves over it, while the interviewer types questions and scores.
const QA = [
  {
    q: "Walk me through a system you built.",
    a: "Chessing. The server re-validates every move, it trusts nobody.",
    s: "system design · 8/10",
  },
  {
    q: "What do you do when you don't know something?",
    a: "Watch it, learn it, then build my own version of it.",
    s: "honesty · 9/10",
  },
  {
    q: "How do I know you actually ship?",
    a: "MoneyCap v1.0 — I open it every morning.",
    s: "proof · 10/10",
  },
];

export default function VoiceWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const boost = useRef(0);
  const [line, setLine] = useState({ qa: 0, phase: 0, chars: 0 }); // phase 0=q 1=a 2=score
  const [mic, setMic] = useState<"off" | "on" | "denied">("off");
  const micRef = useRef<{
    stream: MediaStream;
    ctx: AudioContext;
    analyser: AnalyserNode;
    data: Uint8Array<ArrayBuffer>;
  } | null>(null);

  const stopMic = () => {
    const m = micRef.current;
    if (!m) return;
    m.stream.getTracks().forEach((t) => t.stop());
    m.ctx.close();
    micRef.current = null;
  };

  const toggleMic = async () => {
    if (mic === "on") {
      stopMic();
      setMic("off");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      micRef.current = {
        stream,
        ctx,
        analyser,
        data: new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount)),
      };
      setMic("on");
    } catch {
      setMic("denied");
    }
  };

  useEffect(() => stopMic, []);

  // waveform
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let t = 0;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = () => {
      boost.current = Math.min(1, boost.current + 0.18);
    };
    const root = rootRef.current;
    root?.addEventListener("pointermove", onMove);

    const accent = () =>
      getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#c9a36a";

    const tick = () => {
      t += 0.035;
      boost.current *= 0.96;
      // live mic drives the wave when enabled
      const m = micRef.current;
      if (m) {
        m.analyser.getByteFrequencyData(m.data);
        let sum = 0;
        for (let i = 0; i < m.data.length; i++) sum += m.data[i];
        boost.current = Math.max(boost.current, (sum / m.data.length / 255) * 3.2);
      }
      const r = canvas.getBoundingClientRect();
      const w = r.width;
      const h = r.height;
      const mid = h / 2;
      ctx.clearRect(0, 0, w, h);
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        const amp = (6 + layer * 5) * (0.5 + boost.current * 2.2);
        for (let x = 0; x <= w; x += 3) {
          const y =
            mid +
            Math.sin(x * 0.02 + t * (1 + layer * 0.4)) *
              amp *
              Math.sin((x / w) * Math.PI);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = layer === 1 ? accent() : "rgba(233,230,223,0.25)";
        ctx.lineWidth = layer === 1 ? 1.5 : 1;
        ctx.stroke();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      root?.removeEventListener("pointermove", onMove);
    };
  }, []);

  // typed interview loop (only while visible)
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let timer: ReturnType<typeof setInterval> | null = null;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !timer) {
          timer = setInterval(() => {
            setLine((s) => {
              const cur = QA[s.qa];
              const target = s.phase === 0 ? cur.q.length : s.phase === 1 ? cur.a.length : 8;
              if (s.chars < target) return { ...s, chars: s.chars + 1 };
              if (s.phase < 2) return { ...s, phase: s.phase + 1, chars: 0 };
              return { qa: (s.qa + 1) % QA.length, phase: 0, chars: 0 };
            });
          }, 45);
        } else if (!e.isIntersecting && timer) {
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

  const cur = QA[line.qa];
  const qText = line.phase === 0 ? cur.q.slice(0, line.chars) : cur.q;
  const aText = line.phase === 1 ? cur.a.slice(0, line.chars) : line.phase > 1 ? cur.a : "";
  const showScore = line.phase === 2;

  return (
    <div className="voice-wrap" ref={rootRef}>
      <canvas ref={canvasRef} className="voice-canvas" aria-hidden="true" />
      <div className="voice-script" aria-label="sample interview exchange">
        <p className="mono voice-q">
          <span className="voice-who">interviewer</span> {qText}
          {line.phase === 0 && <span className="caret" aria-hidden="true" />}
        </p>
        {aText && (
          <p className="voice-a">
            <span className="voice-who mono">you</span> {aText}
            {line.phase === 1 && <span className="caret" aria-hidden="true" />}
          </p>
        )}
        {showScore && <span className="score-chip mono">{cur.s}</span>}
      </div>
      <div className="wave-foot">
        <p className="artifact-caption mono">
          {mic === "on" ? "that's your voice in the wave" : "move your cursor over the wave · it listens"}
        </p>
        <button type="button" className="wave-mic mono" onClick={toggleMic}>
          {mic === "on" ? "■ stop mic" : mic === "denied" ? "mic blocked by browser" : "● test with your real mic"}
        </button>
      </div>
    </div>
  );
}
