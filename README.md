# jdwolff.com

My personal site. Built because a Google Doc with links isn't a portfolio.

## Stack

- **Next.js 16** (App Router, React 19, React Compiler)
- **TypeScript** — strict mode, no `any`, no excuses
- **CSS Modules** — no Tailwind, no runtime CSS-in-JS, just the platform
- **Stylelint + ESLint** — enforced via GitHub Actions
- **Vercel** — deployed automatically on push to `main`

## Features

- Fully static where possible, dynamic where it has to be
- Dynamic OG image generation (`/og`) — no pre-generated PNGs
- PWA manifest + theme color
- WCAG 2.1 AA target — accessibility is a design constraint, not a checkbox
- JSON-LD structured data (Person + Article schemas)
- `llms.txt` — because AI crawlers deserve good data too
- A console game. You'll find it.

## Local Dev

```bash
npm install
npm run dev        # starts on :3001
```

Lint:

```bash
npm run lint       # ESLint
npx stylelint "**/*.css"
```

Build:

```bash
npm run build
```

## Structure

```
src/app/
├── (routes)/          # Page routes — about, work, writing, contact, accessibility
│   ├── work/[slug]/   # Case studies — Meridian, OneChat, Dodgers
│   └── writing/[slug] # Essays
├── components/        # Shared UI — Header, Footer, PageLayout, JsonLd, etc.
├── lib/               # siteConfig and other shared constants
├── og/                # Edge runtime OG image generator
├── sitemap.ts         # Sitemap covering all static + dynamic routes
├── robots.ts          # robots.txt
└── manifest.ts        # PWA manifest
```

## Writing

Three essays live on the site:

- **[I have no CS degree. Here's what I learned anyway.](https://jdwolff.com/writing/self-taught)** — on being self-taught and why the English major background wasn't a bug
- **[Accessibility isn't a checklist. It's a disposition.](https://jdwolff.com/writing/accessibility)** — fifteen years of building for everyone
- **[Design systems are a trust problem, not a component problem.](https://jdwolff.com/writing/design-systems)** — the hard part is human

## Work

- **[Meridian](https://jdwolff.com/work/meridian)** — Amazon's enterprise design system. Founding team.
- **[OneChat](https://jdwolff.com/work/onechat)** — Airbnb's internal AI chat, rebuilt from scratch.
- **[Digital Trading Room](https://jdwolff.com/work/dodgers)** — LA Dodgers. CLIO Award, 2015.

## Find Me

[jdwolff.com](https://jdwolff.com) · [LinkedIn](https://www.linkedin.com/in/josephdwolff/) · [Bluesky](https://bsky.app/profile/thewolff-frontend.bsky.social) · [X](https://x.com/thewolff_FEE) · [Substack](https://substack.com/@thewolfffrontend)
