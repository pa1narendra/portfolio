"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const ITEMS = ["Chessing", "Mockstar", "MoneyCap", "touch the work"];

// Marquee whose speed and skew react to scroll velocity.
export default function VelocityMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const track = trackRef.current;
    if (!track) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const loop = gsap.to(track, { xPercent: -50, ease: "none", duration: 22, repeat: -1 });
      const st = ScrollTrigger.create({
        onUpdate: (self) => {
          const v = self.getVelocity();
          gsap.to(track, {
            skewX: gsap.utils.clamp(-8, 8, v / -140),
            duration: 0.5,
            ease: "power2.out",
            overwrite: "auto",
          });
          loop.timeScale(gsap.utils.clamp(0.6, 4, 1 + Math.abs(v) / 900));
        },
      });
      return () => {
        st.kill();
        loop.kill();
      };
    });

    return () => mm.revert();
  }, []);

  const row = (key: string) => (
    <span key={key} style={{ display: "inline-flex", gap: "3rem" }}>
      {ITEMS.map((it, i) => (
        <span key={i} className={it === "touch the work" ? "filled" : undefined}>
          {it}
          <span aria-hidden="true" style={{ margin: "0 0 0 3rem" }}>
            ·
          </span>
        </span>
      ))}
    </span>
  );

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track" ref={trackRef}>
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}
