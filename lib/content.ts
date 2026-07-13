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
  kicker: "pavan narendra peela · full-stack engineer",
  headingA: "I build",
  headingB: "real software.",
  intro:
    "I'm Pavan. I watch how things work, I get curious, and then I build my own version to find out if I actually understood it. Everything below is something I made, shipped, and use, and every demo on this page actually runs. Go ahead, touch them.",
};

export interface LogEntry {
  id: string;
  date: string;
  text: string;
}

export const log: { entries: LogEntry[] } = {
  entries: [
    {
      id: "job",
      date: "2024",
      text: "Started working as a full-stack engineer. Learned that shipping is a different skill from coding.",
    },
    {
      id: "chessing",
      date: "2025",
      text: "Built Chessing, a full multiplayer chess platform, because I wanted to know how real-time games actually stay honest.",
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
    tagline: "a chess platform built to understand real-time systems",
    description:
      "Multiplayer chess with matchmaking, private games with friends, and offline bots up to about 1600 ELO. The server re-validates every single move and never trusts the client, ratings run on Glicko-2, and a dropped connection gets a 60 second grace period, because real-time software is mostly about what happens when things go wrong.",
    stack: "Flutter · Bun · Elysia · MongoDB · WebSockets",
    href: "https://github.com/pa1narendra/chess-mobile",
    linkLabel: "source",
  },
  {
    id: "mockstar",
    code: "MCK·02",
    name: "Mockstar",
    tagline: "a voice AI that interviews you for real",
    description:
      "Describe the role you want, then hold an actual spoken interview with an AI that asks follow-up questions and scores you across five categories when you hang up. The voice runs on Gemini Live over WebSockets, and the API key never reaches the browser, the server mints single-use tokens instead.",
    stack: "Next.js · TypeScript · Gemini Live · Postgres · Drizzle",
    href: "https://mockstar-ai.vercel.app",
    linkLabel: "live",
  },
  {
    id: "moneycap",
    code: "MNY·03",
    name: "MoneyCap",
    tagline: "an expense tracker with no typing in it",
    description:
      "My phone already knows what I spend, every transaction lands in the SMS inbox. MoneyCap reads those messages on the device, classifies them through a multi-stage parser, and never sends a byte anywhere. No manual entry, no cloud, no account. I built it for myself and I am still its harshest user.",
    stack: "Flutter · SQLite · on-device parsing · GitHub Actions",
    href: "https://github.com/pa1narendra/MoneyCap/releases/latest",
    linkLabel: "download",
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
