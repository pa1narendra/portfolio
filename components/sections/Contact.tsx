import { contact, links } from "@/lib/content";
import SplitHeading, { SplitWords } from "@/components/SplitHeading";
import Magnetic from "@/components/Magnetic";

export default function Contact() {
  const items: { label: string; href: string }[] = [
    links.github && { label: "GitHub", href: links.github },
    links.linkedin && { label: "LinkedIn", href: links.linkedin },
    links.email && { label: "Email", href: links.email },
    links.resume && { label: "Résumé", href: links.resume },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <div className="contact-block">
      <SplitHeading className="contact-h">
        <SplitWords text="Let's" />{" "}
        <span className="sh-word">
          <span>
            <em className="serif-accent">talk</em>
          </span>
        </span>
      </SplitHeading>
      <p className="contact-body">{contact.body}</p>
      <div className="contact-links">
        {items.map((it) => (
          <Magnetic key={it.label}>
            <a className="contact-pill mono" href={it.href} target="_blank" rel="noreferrer">
              {it.label} ↗
            </a>
          </Magnetic>
        ))}
      </div>
      <p className="contact-closer mono">
        <span className="contact-dot" aria-hidden="true" />
        {contact.closer}
      </p>
    </div>
  );
}
