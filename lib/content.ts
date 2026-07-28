// Primary portfolio narrative and project data live here.

export const links = {
  github: "https://github.com/pa1narendra",
  linkedin: "https://www.linkedin.com/in/pavan-narendra/",
  email: "mailto:pavannarendra2002@gmail.com",
  resume: "/resume.pdf",
};

export const site = {
  name: "Pavan Narendra Peela",
  title: "Pavan Narendra Peela \u00b7 Full-stack engineer",
  description:
    "Full-stack engineer building healthcare systems, real-time products, and applied AI. Explore interactive engineering notes and working product miniatures.",
};

export const hero = {
  kicker: "pavan narendra peela \u00b7 full-stack engineer \u00b7 healthcare systems / real-time products / applied ai",
  headingA: "Software that",
  headingAccent: "survives",
  headingB: "real users.",
};

export const about = {
  lede: "I learn systems by rebuilding them, then keep refining them until people can rely on them.",
  body: [
    "By day I'm at Vectorsoft, working on a healthcare platform that real clinics rely on. I've built its form builder and its realtime messaging, and lately I've taken on the security, compliance, and AWS side that comes with holding patient data.",
    "Outside work I build small things around questions I can't quite leave alone: how multiplayer games recover from a dropped connection, how a voice interface should feel to talk to, how financial data can stay entirely on your phone. The three below are working miniatures, not screenshots — go ahead and touch them.",
  ],
  now: "healthcare security & platform work at Vectorsoft",
};

export interface LogEntry { id: string; date: string; text: string; }

export const log: { entries: LogEntry[] } = {
  entries: [
    { id: "flyingfox", date: "jul 2024", text: "Joined Flying Fox Labs. Worked with Frappe and ERPNext, Keycloak SSO, Docker, Helm, and the backend of a private fintech product." },
    { id: "vectorsoft", date: "jan 2025", text: "Moved to Vectorsoft to work on a multi-tenant healthcare platform. Shipped its React form builder first." },
    { id: "chat", date: "2025", text: "Built its real-time messaging system with WebSockets and Redis. A million-message capacity test passed; against roughly 10,000 production messages, pagination and caching brought fetches from 2-3 seconds to under 500 ms." },
    { id: "chessing", date: "2025", text: "Reworked Chessing from its original web version into an Android app, moving the client to Flutter and the real-time backend to Bun and Elysia." },
    { id: "moneycap-start", date: "2025", text: "Started MoneyCap after getting tired of manually entering expenses. The phone now parses its own transaction messages locally." },
    { id: "moneycap-v1", date: "2026", text: "Released MoneyCap v1.0 with a signed APK and CI pipeline. It remains part of my daily routine." },
    { id: "mockstar", date: "2026", text: "Released Mockstar, a voice-first interview practice tool with adaptive follow-ups and scored reports." },
    { id: "now", date: "now", text: "Working across healthcare security, SOC 2 and HIPAA readiness, and AWS services including Cognito, S3, EC2, and Route 53." },
  ],
};

export interface Project {
  id: string; code: string; name: string; tagline: string; description: string;
  stack: string; href: string; linkLabel: string; caseHref?: string;
  fieldNotes: { label: string; value: string }[];
}

export const projects: Project[] = [
  {
    id: "chessing", code: "CHS\u00b701", name: "Chessing",
    tagline: "multiplayer chess that distrusts the client",
    description: "Originally a web app, Chessing is now an unreleased Android rewrite exploring server-authoritative multiplayer, reconnect recovery, ranked matches, invite codes, and offline bots. Its planned features are implemented, but the complete build is still being tested.",
    stack: "unreleased / in testing \u00b7 Flutter \u00b7 Bun \u00b7 Elysia \u00b7 MongoDB \u00b7 WebSockets",
    href: "https://github.com/pa1narendra/chess-mobile", linkLabel: "inspect the code",
    fieldNotes: [
      { label: "evolution", value: "The original web app became a Flutter Android client with a Bun and Elysia backend." },
      { label: "decision", value: "The server validates every move; the client only proposes it." },
      { label: "failure mode", value: "Persisted state restores interrupted matches." },
      { label: "status", value: "Feature-complete for the planned scope, but unreleased while testing continues." },
    ],
  },
  {
    id: "mockstar", code: "MCK\u00b702", name: "Mockstar",
    tagline: "a voice interface that listens before it scores",
    description: "A voice-first mock interviewer that asks adaptive follow-ups and produces a scored report when the conversation ends.",
    stack: "Next.js \u00b7 TypeScript \u00b7 Gemini Live \u00b7 Postgres \u00b7 Drizzle",
    href: "https://mockstar-ai.vercel.app", linkLabel: "try the interview",
    caseHref: "/work/mockstar",
    fieldNotes: [
      { label: "constraint", value: "Conversation latency must feel natural, not queued." },
      { label: "decision", value: "Streaming voice and transcript state share one session model." },
      { label: "output", value: "A structured report is generated at hang-up." },
      { label: "release", value: "The public web app is available without private configuration." },
      { label: "next", value: "The next iteration is aimed at institute and recruiting-team workflows." },
    ],
  },
  {
    id: "moneycap", code: "MNY\u00b703", name: "MoneyCap",
    tagline: "expenses that remain on your phone",
    description: "An offline-first expense tracker that converts bank SMS messages into ledger entries without manual input or transaction data leaving the device.",
    stack: "Flutter \u00b7 SQLite \u00b7 on-device parsing \u00b7 GitHub Actions",
    href: "https://github.com/pa1narendra/MoneyCap/releases/latest", linkLabel: "get the release",
    caseHref: "/work/moneycap",
    fieldNotes: [
      { label: "constraint", value: "Financial messages should never reach a server." },
      { label: "decision", value: "Parsing and storage both run locally." },
      { label: "edge case", value: "Bank formats vary, so parsing is staged and defensive." },
      { label: "release", value: "A signed Android APK is publicly installable from GitHub Releases." },
    ],
  },
];

// the dark "chorus" band — real proof, glanceable
export const stats: { value: string; label: string }[] = [
  { value: "~20", label: "clinics run on software I built" },
  { value: "200+", label: "people using it every day" },
  { value: "10k", label: "patient records it safely holds" },
  { value: "6", label: "products built end to end" },
];

export const otherWork: { name: string; label?: string; status: string; desc: string; note?: string; href?: string }[] = [
  { name: "Factory Operations Portal", label: "ERP Portal", status: "in production", desc: "Order and production tracking for an eco-bag factory: role-based access, a ten-stage pipeline, cash book, attendance, and PDF reports.", href: "https://erp.buildnweb.in" },
  { name: "Shipstory", status: "local plugin", desc: "An agent that studies a repository and turns the decisions inside it into honest release stories without publishing on the user's behalf.", note: "private working tool" },
  { name: "AI Job Search", status: "personal tooling", desc: "A two-agent pipeline that tailors LaTeX resumes to a role, reviews the draft, compiles it, and checks the rendered PDF.", note: "private working tool" },
];

export const principles = [
  { no: "01", title: "Watch, then build.", detail: "I test my understanding by making the smallest complete version of a system.", evidence: "Chessing turned multiplayer consistency from a diagram into failure cases I could reproduce." },
  { no: "02", title: "Use boring foundations.", detail: "Proven tools leave more attention for the parts of a product that are genuinely uncertain.", evidence: "MoneyCap uses SQLite and deterministic parsing because privacy matters more than novelty." },
  { no: "03", title: "Design for the failure path.", detail: "Reconnects, retries, malformed input, and denied permissions are product behavior, not cleanup work.", evidence: "The demos handle reconnects, parse failures, and microphone denial explicitly." },
  { no: "04", title: "Measure before polishing.", detail: "A precise bottleneck is more useful than a vague feeling that a system should be faster.", evidence: "Redis caching and pagination reduced message fetches from 2-3 seconds to under 500 ms." },
  { no: "05", title: "Release the complete loop.", detail: "A product is not finished at the happy-path demo; it needs packaging, recovery, and a way to improve.", evidence: "MoneyCap ships as a signed release through CI and remains in daily use." },
];

export const contact = {
  body: "If you're building something with hard constraints, hiring someone who actually ships, or just want to trade ideas, I'd genuinely like to hear from you. Pick whichever of these is easiest.",
  closer: "I usually reply within a day.",
};

export const consoleNote =
  "%cSYSTEM NOTE / You found the margin.\nThe interactive miniatures use Next.js, GSAP, Framer Motion, Canvas, Web Audio, and a hand-written WebGL shader.\nInspect the source: https://github.com/pa1narendra";
