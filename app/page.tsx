import Nav from "@/components/Nav";
import Section from "@/components/Section";
import HeroCinematic from "@/components/HeroCinematic";
import WorkGallery from "@/components/WorkGallery";
import Work from "@/components/sections/Work";
import Craft from "@/components/sections/Craft";
import Contact from "@/components/sections/Contact";
import VelocityMarquee from "@/components/VelocityMarquee";
import ConsoleNote from "@/components/ConsoleNote";
import ChessBoard from "@/components/artifacts/ChessBoard";
import VoiceWave from "@/components/artifacts/VoiceWave";
import MoneyMachine from "@/components/artifacts/MoneyMachine";
import { site, links, projectFootnotes } from "@/lib/content";

const ARTIFACTS = {
  chessing: <ChessBoard />,
  mockstar: <VoiceWave />,
  moneycap: <MoneyMachine />,
};

export default function Home() {
  return (
    <>
      <ConsoleNote />
      <Nav />
      <main className="page">
        <HeroCinematic />
      </main>
      <VelocityMarquee />
      <WorkGallery artifacts={ARTIFACTS} />
      <main className="page">
        <div className="footnotes">
          {projectFootnotes.map((f, i) => (
            <p key={i} className="footnote">
              <span className="mono footnote-mark">{"†".repeat(i + 1)}</span> {f.text}{" "}
              {f.href && (
                <a className="u-link mono" href={f.href} target="_blank" rel="noreferrer">
                  see it ↗
                </a>
              )}
            </p>
          ))}
        </div>
        <Section id="log" index={4} title="git log">
          <Work />
        </Section>
        <Section id="craft" index={5} title="principles, tested">
          <Craft />
        </Section>
        <Section id="contact" index={6} title="contact">
          <Contact />
        </Section>
        <footer className="footer">
          <span className="mono-label">© 2026 {site.name}</span>
          <a className="u-link mono footer-src" href={links.github} target="_blank" rel="noreferrer">
            view source ↗
          </a>
        </footer>
      </main>
    </>
  );
}
