"use client";

import { useState } from "react";
import { links } from "@/lib/content";
import Magnetic from "@/components/Magnetic";

// A contact form that is exactly as honest as the rest of the page:
// type a message, hit send, your own mail app opens with it filled in.
export default function MailTerminal() {
  const [msg, setMsg] = useState("");
  const email = links.email.replace("mailto:", "");
  const href = `mailto:${email}?subject=${encodeURIComponent("hello from your portfolio")}&body=${encodeURIComponent(msg || "hi Pavan,")}`;

  return (
    <div className="term mail-term">
      <div className="term-bar">
        <span className="term-dot" />
        <span className="term-dot" />
        <span className="term-dot" />
        <span className="term-title mono">~/you — mail pavan</span>
      </div>
      <div className="term-body">
        <label className="mono mail-label" htmlFor="mail-body">
          <span className="term-hash">$</span> compose · this actually sends
        </label>
        <textarea
          id="mail-body"
          className="mail-input mono"
          rows={4}
          placeholder="type here…"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <div className="mail-actions">
          <Magnetic>
            <a className="modal-link mono" href={href}>
              send ↗
            </a>
          </Magnetic>
        </div>
      </div>
    </div>
  );
}
