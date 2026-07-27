"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { hero } from "@/lib/content";
import StatusStrip from "./StatusStrip";

function Letters({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, w) => (
        <span key={w}>
          {w > 0 && " "}
          <span className="word">
            {word.split("").map((ch, i) => (
              <span key={i} className="lt">
                {ch}
              </span>
            ))}
          </span>
        </span>
      ))}
    </>
  );
}

// A short typographic entrance; the content remains stable once it arrives.
export default function HeroCinematic() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const letters = el.querySelectorAll(".hero-h .lt");
      const rest = el.querySelectorAll(".hero-kicker, .status-strip");

      // Brief entrance, without delaying access to the portfolio.
      gsap.fromTo(
        letters,
        { yPercent: 120 },
        {
          yPercent: 0,
          duration: 1.15,
          ease: "power4.out",
          stagger: 0.028,
          delay: 0.12,
          onComplete: () => el.classList.add("unmasked"),
        },
      );
      gsap.fromTo(
        rest,
        { y: 34, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.1, delay: 0.35 },
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="top" className="hero" ref={ref}>
      <p className="mono-label hero-kicker">{hero.kicker}</p>
      <h1 className="hero-h">
        <span className="line-mask">
          <span>
            <Letters text={hero.headingA} />
          </span>
        </span>
        <span className="line-mask">
          <span>
            <em className="serif-accent">
              <Letters text={hero.headingAccent} />
            </em>{" "}
            <Letters text={hero.headingB} />
          </span>
        </span>
      </h1>
      <StatusStrip />
    </section>
  );
}
