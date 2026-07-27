"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/lib/content";
import DeviceFrame from "./DeviceFrame";

// The centerpiece: vertical scroll drives a pinned horizontal journey
// through the three live demos, each riding its own floating device.
export default function WorkGallery({ artifacts }: { artifacts: Record<string, ReactNode> }) {
  const secRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const sec = secRef.current;
    const track = trackRef.current;
    if (!sec || !track) return;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 56rem) and (prefers-reduced-motion: no-preference)", () => {
      const amount = () => track.scrollWidth - window.innerWidth;
      const scrub = gsap.to(track, {
        x: () => -amount(),
        ease: "none",
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: () => `+=${amount()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // inner parallax: copy drifts slower than its panel while passing through
      track.querySelectorAll<HTMLElement>(".g-copy").forEach((copy) => {
        gsap.fromTo(
          copy,
          { x: 90 },
          {
            x: -90,
            ease: "none",
            scrollTrigger: {
              trigger: copy,
              containerAnimation: scrub,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          },
        );
      });

      // progress rail
      const rail = sec.querySelector(".g-rail-fill");
      if (rail) {
        gsap.fromTo(
          rail,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sec,
              start: "top top",
              end: () => `+=${amount()}`,
              scrub: true,
            },
          },
        );
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="systems" className="gallery" ref={secRef} aria-label="interactive system notes">
      <h2 className="sr-only">Three interactive system notes</h2>
      <div className="g-rail" aria-hidden="true">
        <span className="g-rail-fill" />
      </div>
      <div className="gallery-track" ref={trackRef}>
        {projects.map((p, index) => (
          <article className="g-panel" key={p.id}>
            <div className="g-copy">
              <div className="g-meta-row mono-label">
                <span>{p.code} / field test</span>
                <span>{String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
              </div>
              <h3 className="g-name">{p.name}</h3>
              <p className="project-tagline">{p.tagline}</p>
              <p className="project-desc">{p.description}</p>
              <p className="mono project-meta">{p.stack}</p>
              <dl className="field-notes">
                {p.fieldNotes.map((note) => (
                  <div className="field-note" key={note.label}>
                    <dt className="mono">{note.label}</dt>
                    <dd>{note.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="show-actions">
                  <a className="modal-link mono" href={p.href} target="_blank" rel="noreferrer">
                    {p.linkLabel} ↗
                  </a>
              </div>
            </div>
            <div className="g-stage">
              <DeviceFrame>{artifacts[p.id]}</DeviceFrame>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
