import Nav from "@/components/Nav";
import Section from "@/components/Section";
import HeroCinematic from "@/components/HeroCinematic";
import WorkGallery from "@/components/WorkGallery";
import StatsBand from "@/components/StatsBand";
import Work from "@/components/sections/Work";
import Craft from "@/components/sections/Craft";
import Contact from "@/components/sections/Contact";
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
      <main id="content">
        <div className="page">
          <HeroCinematic />
        <Section id="about" index={1} title="about">
          <div className="about-grid">
            <div className="about-left">
              <p className="about-lede serif-accent">{about.lede}</p>
              <p className="about-now mono">
                <span className="about-now-dot" aria-hidden="true" />
                <span className="about-now-label">currently</span>
                {about.now}
              </p>
            </div>
            <div className="about-body">
              {about.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
          </Section>
        </div>

        <div className="page">
          <Section id="work" index={2} title="working systems">
          <div className="notebook-intro">
            <p className="section-lede serif-accent">
              Three products, reduced to the decisions that make them work.
            </p>
            <p className="notebook-note mono">
              field note / each miniature is interactive / scroll to inspect
            </p>
          </div>
          </Section>
        </div>
        <WorkGallery artifacts={ARTIFACTS} />
        <StatsBand />

        <div className="page">
          <Section id="more" index={3} title="also built">
          <div className="other-grid">
            {otherWork.map((w) => (
              <article className="other-card" key={w.name}>
                <span className="other-status mono">{w.status}</span>
                <h3 className="other-name">{w.name}</h3>
                {w.label && <span className="other-label mono">{w.label}</span>}
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
                {!w.href && w.note && <span className="other-note mono">{w.note}</span>}
              </article>
            ))}
          </div>
        </Section>

        <Section id="log" index={4} title="build log">
          <p className="section-lede serif-accent">
            Production systems, side projects, and the lessons between them.
          </p>
          <Work />
        </Section>

        <Section id="craft" index={5} title="approach">
          <p className="section-lede serif-accent">
            Five principles, with the projects that tested them.
          </p>
          <Craft />
        </Section>

        <Section id="contact" index={6} title="contact">
          <Contact />
        </Section>

        <footer className="footer">
          <span className="mono-label">© {new Date().getFullYear()} {site.name}</span>
          <a className="u-link mono footer-src" href={links.github} target="_blank" rel="noreferrer">
            view source ↗
          </a>
          </footer>
        </div>
      </main>
    </>
  );
}
