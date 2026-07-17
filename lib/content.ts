// All site copy lives here. Edit this file, not the components.

export const links = {
  github: "https://github.com/pa1narendra",
  linkedin: "https://www.linkedin.com/in/pavan-narendra/",
  email: "mailto:pavannarendra2002@gmail.com",
  resume: "/resume.pdf",
};

export const site = {
  name: "Pavan Narendra Peela",
  title: "Pavan Narendra Peela · field notes",
  description:
    "Random internet dude. Ships real software. A small notebook of things built, used daily, and annotated in the margins.",
};

export const hero = {
  kicker: "pavan narendra peela · full-stack engineer · health-tech, realtime & ai",
  headingA: "I build",
  headingB: "real software.",
};

export const about = {
  lede: "I watch how things work, I get curious, and then I build my own version to find out if I actually understood it.",
  body: [
    "By day I'm a full-stack engineer at Vectorsoft, building an EMR that real clinics run on. I've shipped its form builder and its realtime chat, and these days I handle the security and compliance side that comes with holding patient data.",
    "Off the clock I build my own things, and everything below is one of them, made and shipped and actually used. And every demo on this page runs for real. I'd rather show you working software than talk about it.",
  ],
  now: "security & compliance at Vectorsoft · open to good problems",
};

export interface LogEntry {
  id: string;
  date: string;
  text: string;
}

export const log: { entries: LogEntry[] } = {
  entries: [
    {
      id: "flyingfox",
      date: "jun 2024",
      text: "Joined FlyingFox Labs. Frappe and ERPNext, Docker and Helm, and the backend of a private fintech product.",
    },
    {
      id: "vectorsoft",
      date: "jan 2025",
      text: "Moved to Vectorsoft to build an EMR that clinics across a couple of US states now run on. Shipped its React form builder first.",
    },
    {
      id: "chat",
      date: "2025",
      text: "Built the EMR's realtime chat on WebSockets and Redis — clinic staff share patient profiles and open todos right in the thread.",
    },
    {
      id: "chessing",
      date: "2025",
      text: "Built Chessing on the side, a multiplayer chess app, because I wanted to know how real-time games actually stay honest.",
    },
    {
      id: "moneycap-start",
      date: "2025",
      text: "Got tired of typing my expenses into apps, so I taught my phone to read its own SMS inbox. MoneyCap was born.",
    },
    {
      id: "moneycap-v1",
      date: "2026",
      text: "Released MoneyCap v1.0, signed APK, CI pipeline, the app I still open every day.",
    },
    {
      id: "mockstar",
      date: "2026",
      text: "Shipped Mockstar, a voice AI that interviews you out loud and scores you honestly when you hang up.",
    },
    {
      id: "now",
      date: "now",
      text: "On the security side of the EMR now — SOC 2 and HIPAA, plus running its AWS setup (Cognito, S3, EC2, Route 53).",
    },
  ],
};

export interface Project {
  id: string;
  code: string; // plate number, also the gate-3 ordering
  name: string;
  tagline: string;
  description: string;
  stack: string;
  href: string;
  linkLabel: string;
}

// gate 3: click the plates in index order (true chronological build order)
export const projects: Project[] = [
  {
    id: "chessing",
    code: "CHS·01",
    name: "Chessing",
    tagline: "chess worth coming back to",
    description:
      "Want to actually get better at chess, not just pass the time? Play ranked matches, challenge a friend with a code, or train against offline bots when you're on your own.",
    stack: "Flutter · Bun · Elysia · MongoDB · WebSockets",
    href: "https://github.com/pa1narendra/chess-mobile",
    linkLabel: "see the code",
  },
  {
    id: "mockstar",
    code: "MCK·02",
    name: "Mockstar",
    tagline: "rehearse the interview first",
    description:
      "Prepping for your first job, or planning a switch? Mockstar runs a real mock interview out loud — it talks, asks follow-ups, and scores you honestly the moment you hang up.",
    stack: "Next.js · TypeScript · Gemini Live · Postgres · Drizzle",
    href: "https://mockstar-ai.vercel.app",
    linkLabel: "try it",
  },
  {
    id: "moneycap",
    code: "MNY·03",
    name: "MoneyCap",
    tagline: "expenses that track themselves",
    description:
      "Paying through five different apps and losing track of your money? MoneyCap reads your transaction texts right on your phone and keeps the ledger for you. No typing, nothing leaves your device.",
    stack: "Flutter · SQLite · on-device parsing · GitHub Actions",
    href: "https://github.com/pa1narendra/MoneyCap/releases/latest",
    linkLabel: "try it",
  },
];

export const otherWork: { name: string; status: string; desc: string; href?: string }[] = [
  {
    name: "ERP-Portal",
    status: "in production",
    desc: "Order and production tracking for an eco-bag factory. Role-based access, a ten-stage pipeline, cash book, attendance, PDF reports. Real business, real users, running live.",
    href: "https://erp.buildnweb.in",
  },
  {
    name: "shipstory",
    status: "claude plugin",
    desc: "An agent that reads a project deeply and writes honest social posts about it. Truth over hype, physically unable to publish on its own.",
  },
  {
    name: "ai-job-search",
    status: "personal tooling",
    desc: "An agentic pipeline that tailors LaTeX CVs per posting, then a second agent reviews the drafts and a render loop checks the compiled PDFs.",
  },
];

export const principles: { no: string; text: string }[] = [
  {
    no: "01",
    text: "Watch first, learn second, build third. I don't trust that I know something until I've made my own version of it.",
  },
  {
    no: "02",
    text: "Boring technology used carefully beats clever technology used carelessly.",
  },
  {
    no: "03",
    text: "If I won't use it every day, I don't ship it. MoneyCap survived because I can't escape its bugs.",
  },
  {
    no: "04",
    text: "Read the margins. The interesting parts of any system live in the edge cases, the reconnects, the retries.",
  },
  {
    no: "05",
    text: "If it isn't shipped, it doesn't exist.",
  },
];

export const contact = {
  heading: "Write to me",
  body: "I like hearing from people who build things, or want to start. No forms, no scheduling links, just the usual places.",
};

export const consoleNote =
  "%cYou opened the console. Of course you did.\nEvery demo on this page actually runs: Next.js, GSAP, Framer Motion, a hand-rolled liquid shader, no component library, one accent color.\nSay hello: https://github.com/pa1narendra";
