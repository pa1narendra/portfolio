import type { ReactNode } from "react";
import Reveal from "./Reveal";

export default function Section({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: number;
  title: string;
  children: ReactNode;
}) {
  const num = String(index).padStart(2, "0");
  return (
    <section id={id} className="section" style={{ scrollMarginTop: "4.5rem" }}>
      <header className="section-head" data-num={num}>
        <h2 className="mono-label">/ {title}</h2>
      </header>
      <Reveal>{children}</Reveal>
    </section>
  );
}
