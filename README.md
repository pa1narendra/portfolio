# pavan · portfolio

Personal portfolio of Pavan Narendra Peela, full-stack engineer. One idea drives the whole site: **everything on the page actually runs.** No screenshots pretending to be products — working miniatures of the real things.

## What's on the page

- **Three live demos**, one per shipped product, presented on floating tablet frames inside a scroll-driven horizontal gallery:
  - **Chessing** — a 3D CSS chessboard with a knight you can really move (legal-move highlighting, hop animation)
  - **Mockstar** — a voice waveform that reacts to your cursor *or your actual microphone* (Web Audio API, processed locally, nothing recorded or sent), over a self-typing interview exchange
  - **MoneyCap** — an SMS-to-ledger machine; type your own transaction SMS and watch the on-device-style parser extract the amount and merchant live
- **A cinematic hero** whose headline disassembles letter-by-letter under scroll scrub
- **Living sections**: the work log replays as an animated `git log`, principles run as a passing test suite, and contact is a mail composer that opens your mail app pre-filled
- **A liquid background**: the lavender field bends along the cursor's path — an analytic gaussian-displacement shader (deliberately *not* a fluid simulation, so it cannot alias or artifact on any GPU)

## Stack

Next.js (App Router) · TypeScript · Tailwind v4 (custom tokens only, no component library) · GSAP + ScrollTrigger (scroll choreography) · Framer Motion (device-frame springs) · Lenis (smooth scroll) · one hand-written WebGL2 shader

## Interaction & accessibility choices

- All animation is transform/opacity only; one shared RAF loop via `gsap.ticker`
- `prefers-reduced-motion` disables the loader, scrub, reveals, and shader — content is fully readable statically
- Demos pause when off-screen (IntersectionObserver) and when the tab is hidden
- Skip-to-content link, visible focus styles, semantic heading hierarchy, keyboard-operable demos
- The intro loader plays once per session and has a visible skip
- Microphone demo is opt-in, labeled, and processes audio locally only

## Run it

```bash
npm install
npm run dev
```

Content lives in one file: `lib/content.ts`. Design tokens live at the top of `app/globals.css`.
