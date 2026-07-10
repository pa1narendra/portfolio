import { contact, links } from "@/lib/content";
import MailTerminal from "@/components/artifacts/MailTerminal";
import SplitHeading, { SplitWords } from "@/components/SplitHeading";

export default function Contact() {
  const items: { label: string; href: string }[] = [
    links.github && { label: "github", href: links.github },
    links.linkedin && { label: "linkedin", href: links.linkedin },
    links.email && { label: "email", href: links.email },
    links.resume && { label: "resume (pdf)", href: links.resume },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <div className="contact-grid">
      <div>
        <SplitHeading className="contact-h">
          <SplitWords text="Write to" />{" "}
          <span className="sh-word">
            <span>
              <em className="serif-accent">me</em>
            </span>
          </span>
        </SplitHeading>
        <p className="contact-body">{contact.body}</p>
        <ul className="contact-links">
          {items.map((it) => (
            <li key={it.label}>
              <a className="u-link mono" href={it.href} target="_blank" rel="noreferrer">
                {it.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </div>
      <MailTerminal />
    </div>
  );
}
