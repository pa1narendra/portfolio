# Pavan Narendra Peela / portfolio

A working systems notebook for a full-stack engineer. The portfolio pairs concise engineering field notes with interactive miniatures of products at different release stages.

## What is on the page

- Chessing: a playable knight demonstrates the move model behind an unreleased Android rewrite that is still being tested.
- Mockstar: a canvas waveform reacts to pointer input or an opt-in local microphone stream while an interview exchange runs.
- MoneyCap: a small SMS parser extracts an amount and merchant, then moves the result into a local-style ledger.
- A build log presents employment and independent releases as a chronological Git history.
- Engineering principles include concrete evidence from the systems that tested them.
- A WebGL2 background adds a restrained cursor displacement on capable desktop devices.

## Stack

Next.js App Router, TypeScript, Tailwind CSS v4, GSAP and ScrollTrigger, Framer Motion, Lenis, Canvas, Web Audio, and WebGL2. There is no component library.

## Performance and accessibility

- Reduced-motion preferences disable positional choreography and the WebGL background.
- Touch devices retain native scrolling and do not run the WebGL effect.
- The waveform, typing loop, and ledger loop pause while offscreen; audio stops on unmount.
- The interactive chess squares are keyboard operable and have descriptive labels.
- Focus styles, a content skip link, semantic headings, and readable static fallbacks are included.
- The microphone interaction is opt-in and does not record or send audio.

## Run locally

```bash
npm install
npm run dev
```

Primary narrative and project data live in `lib/content.ts`. Design tokens live at the top of `app/globals.css`.

Set `NEXT_PUBLIC_SITE_URL` in production when deploying outside Vercel. Vercel deployments derive the canonical URL from the provided deployment environment variables.
