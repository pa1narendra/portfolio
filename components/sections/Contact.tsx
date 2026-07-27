import { contact, links } from "@/lib/content";
import SplitHeading, { SplitWords } from "@/components/SplitHeading";

export default function Contact() {
  const items: { label: string; href: string }[] = [
    links.github && { label: "GitHub", href: links.github },
    links.linkedin && { label: "LinkedIn", href: links.linkedin },
    links.email && { label: "Email", href: links.email },
    links.resume && { label: "Resume PDF", href: links.resume },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <div className="contact-block">
      <SplitHeading className="contact-h">
        <SplitWords text="Compare" />{" "}
        <span className="sh-word">
          <span>
            <em className="serif-accent">notes</em>
          </span>
        </span>
      </SplitHeading>
      <p className="contact-body">{contact.body}</p>
      <div className="contact-links">
        {items.map((it) => (
            <a
              key={it.label}
              className="contact-pill mono"
              href={it.href}
              target={it.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={it.href.startsWith("mailto:") ? undefined : "noreferrer"}
            >
              {it.label} ↗
            </a>
        ))}
      </div>
      <p className="contact-closer mono">
        <span className="contact-dot" aria-hidden="true" />
        {contact.closer}
      </p>
    </div>
  );
}
