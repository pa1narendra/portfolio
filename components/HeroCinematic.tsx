"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

// Pinned cinematic hero: letters rise in behind the boot shutters,
// then scrolling scrubs them apart — the headline disassembles as you leave.
export default function HeroCinematic() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    // returning visitors skip the boot, so the hero shouldn't wait for it
    const revisit = sessionStorage.getItem("pnp.visited") === "1";

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const letters = el.querySelectorAll(".hero-h .lt");
      const rest = el.querySelectorAll(".hero-kicker, .status-strip");

      // entrance (behind the boot shutters, after Einstein's greeting)
      gsap.fromTo(
        letters,
        { yPercent: 120 },
        {
          yPercent: 0,
          duration: 1.15,
          ease: "power4.out",
          stagger: 0.028,
          delay: revisit ? 0.2 : 3.35,
          onComplete: () => el.classList.add("unmasked"),
        },
      );
      gsap.fromTo(
        rest,
        { y: 34, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.12, delay: revisit ? 0.55 : 3.75 },
      );
    });

    // the pin + scrub disassembly is desktop-only; mobile scrolls straight past
    mm.add("(min-width: 56rem) and (prefers-reduced-motion: no-preference)", () => {
      const letters = el.querySelectorAll(".hero-h .lt");
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "+=110%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });
      tl.to(
        letters,
        {
          yPercent: -160,
          rotate: () => gsap.utils.random(-16, 16),
          xPercent: () => gsap.utils.random(-40, 40),
          opacity: 0,
          stagger: { each: 0.014, from: "random" },
          ease: "power1.in",
        },
        0,
      )
        .to(el.querySelector(".status-strip"), { y: -70, opacity: 0 }, 0.1)
        .to(el.querySelector(".hero-kicker"), { y: -50, opacity: 0 }, 0);
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="top" className="hero" ref={ref}>
      <p className="mono-label hero-kicker">{hero.kicker}</p>
      <h1 className="hero-h">
        <span className="line-mask">
          <span>
            <Letters text="I build" />
          </span>
        </span>
        <span className="line-mask">
          <span>
            <em className="serif-accent">
              <Letters text="real" />
            </em>{" "}
            <Letters text="software." />
          </span>
        </span>
      </h1>
      <StatusStrip />
    </section>
  );
}
