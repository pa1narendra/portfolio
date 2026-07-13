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
import { site, links, about, otherWork } from "@/lib/content";

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
      <main className="page">
        <Section id="about" index={1} title="about">
          <div className="about-grid">
            <p className="about-lede serif-accent">{about.lede}</p>
            <div className="about-body">
              {about.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </Section>
      </main>
      <WorkGallery artifacts={ARTIFACTS} />
      <main className="page">
        <Section id="more" index={4} title="also built">
          <div className="other-grid">
            {otherWork.map((w) => (
              <article className="other-card" key={w.name}>
                <span className="other-status mono">{w.status}</span>
                <h3 className="other-name">{w.name}</h3>
                <p className="other-desc">{w.desc}</p>
                {w.href && (
                  <a
                    className="u-link mono other-link"
                    href={w.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    visit ↗
                  </a>
                )}
              </article>
            ))}
          </div>
        </Section>
        <Section id="log" index={5} title="git log">
          <Work />
        </Section>
        <Section id="craft" index={6} title="principles, tested">
          <Craft />
        </Section>
        <Section id="contact" index={7} title="contact">
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
