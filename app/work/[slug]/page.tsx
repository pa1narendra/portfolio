import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies, getCaseStudy } from "@/lib/case-studies";
import Reveal from "@/components/Reveal";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const cs = getCaseStudy((await params).slug);
  if (!cs) return {};
  return {
    title: `${cs.name} — case study`,
    description: cs.seoDescription,
    alternates: { canonical: `/work/${cs.slug}` },
    openGraph: { title: `${cs.name} — case study`, description: cs.seoDescription },
  };
}

function CaseSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="case-section">
      <Reveal>
        <h2 className="mono-label case-label">/ {label}</h2>
        {children}
      </Reveal>
    </section>
  );
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const cs = getCaseStudy((await params).slug);
  if (!cs) notFound();

  return (
    <main id="content" className="page case-page">
      <nav className="case-crumb mono" aria-label="breadcrumb">
        <Link href="/#work" className="u-link">
          ← back to the work
        </Link>
      </nav>

      <header className="case-hero">
        <p className="mono-label">case study</p>
        <h1 className="case-title">{cs.name}</h1>
        <p className="case-tagline serif-accent">{cs.tagline}</p>
        <dl className="case-meta mono">
          <div>
            <dt>role</dt>
            <dd>{cs.role}</dd>
          </div>
          <div>
            <dt>period</dt>
            <dd>{cs.period}</dd>
          </div>
          <div>
            <dt>status</dt>
            <dd>{cs.status}</dd>
          </div>
          <div>
            <dt>stack</dt>
            <dd>{cs.stack.join(" · ")}</dd>
          </div>
        </dl>
        <div className="case-links">
          {cs.links.map((l) => (
            <a
              key={l.label}
              className="contact-pill mono"
              href={l.href}
              target="_blank"
              rel="noreferrer"
            >
              {l.label} ↗
            </a>
          ))}
        </div>
      </header>

      <CaseSection label="what it is">
        <p className="case-outcome">{cs.outcome}</p>
      </CaseSection>

      {cs.media.length > 0 && (
        <CaseSection label="the product">
          <div className="case-media-grid">
            {cs.media.map((m) => (
              <figure key={m.src} className="case-figure">
                <div className="case-shot">
                  <Image
                    src={m.src}
                    alt={m.alt}
                    width={m.width}
                    height={m.height}
                    sizes="(max-width: 899px) 100vw, 50vw"
                    className="case-img"
                  />
                </div>
                <figcaption className="mono case-caption">{m.caption}</figcaption>
              </figure>
            ))}
          </div>
        </CaseSection>
      )}

      <CaseSection label="why it exists">
        <div className="case-prose">
          {cs.problem.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </CaseSection>

      <CaseSection label="the constraints">
        <ul className="case-constraints">
          {cs.constraints.map((c, i) => (
            <li key={i}>
              <span className="mono constraint-mark">{String(i + 1).padStart(2, "0")}</span>
              {c}
            </li>
          ))}
        </ul>
      </CaseSection>

      <CaseSection label="how it works">
        <p className="case-prose-lede">{cs.architecture.intro}</p>
        <div className="arch-flow" role="img" aria-label={`architecture: ${cs.architecture.flow.join(", then ")}`}>
          {cs.architecture.flow.map((step, i) => (
            <div key={i} className="arch-step-wrap">
              <div className="arch-step mono">{step}</div>
              {i < cs.architecture.flow.length - 1 && (
                <span className="arch-arrow" aria-hidden="true">
                  →
                </span>
              )}
            </div>
          ))}
        </div>
        <ul className="arch-notes">
          {cs.architecture.notes.map((n, i) => (
            <li key={i} className="mono">
              {n}
            </li>
          ))}
        </ul>
      </CaseSection>

      <CaseSection label="decisions that mattered">
        <div className="case-decisions">
          {cs.decisions.map((d, i) => (
            <article key={i} className="case-decision">
              <p className="decision-situation">{d.situation}</p>
              <p className="decision-choice">
                <span className="mono decision-tag">decision /</span> {d.decision}
              </p>
              <p className="decision-tradeoff">
                <span className="mono decision-tag">tradeoff /</span> {d.tradeoff}
              </p>
            </article>
          ))}
        </div>
      </CaseSection>

      <CaseSection label="the edge cases">
        <p className="case-prose-lede">
          The part I care about most. A system is what it does when things go wrong.
        </p>
        <div className="case-edges">
          {cs.edgeCases.map((e, i) => (
            <div key={i} className="case-edge">
              <h3 className="edge-name mono">✗ {e.name}</h3>
              <p className="edge-handling">{e.handling}</p>
            </div>
          ))}
        </div>
      </CaseSection>

      <CaseSection label="in numbers">
        <div className="case-results">
          {cs.results.map((r) => (
            <div key={r.label} className="case-result">
              <span className="result-value">{r.value}</span>
              <span className="result-label mono">{r.label}</span>
            </div>
          ))}
        </div>
      </CaseSection>

      <CaseSection label="looking back">
        <div className="case-prose case-reflection serif-accent">
          {cs.reflection.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </CaseSection>

      <footer className="case-footer">
        <Link href="/#work" className="u-link mono">
          ← back to the work
        </Link>
        <div className="case-next mono">
          {caseStudies
            .filter((c) => c.slug !== cs.slug)
            .map((c) => (
              <Link key={c.slug} href={`/work/${c.slug}`} className="u-link">
                {c.name} →
              </Link>
            ))}
        </div>
      </footer>
    </main>
  );
}
