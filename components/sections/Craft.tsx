import { principles } from "@/lib/content";
import Reveal from "@/components/Reveal";

export default function Craft() {
  return (
    <ol className="creed">
      {principles.map((p) => (
        <li key={p.no}>
          <Reveal>
            <article className="creed-row">
              <span className="creed-no mono">{p.no}</span>
              <h3 className="creed-title serif-accent">{p.title}</h3>
              <p className="creed-detail">{p.detail}</p>
              <p className="creed-evidence mono">
                <span>proof /</span> {p.evidence}
              </p>
            </article>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
