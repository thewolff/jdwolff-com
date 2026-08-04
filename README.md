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

## Talks / decks

Standalone reveal.js decks are authored outside this repo (in `~/decks/<slug>`) and synced
into `public/<slug>` as static files. The deck is not a Next route — it takes over the whole
page, exactly as built.

```bash
npm run sync:decks                       # all decks
node scripts/sync-deck.mjs <slug>        # just one
```

The synced output **is committed**. Do not wire the sync into `prebuild`: it reads from
`~/decks`, which does not exist on the Vercel build machine, so a build hook would fail
every deploy. Run it locally when the deck changes, then commit the result.

`scripts/sync-deck.mjs` copies `assets/`, vendors the four reveal.js files the deck
references into `vendor/reveal/`, rewrites the `node_modules/reveal.js/dist/` paths, and
injects the hosting-only bits (a `<base href>`, OG tags, a `noindex` tag, and a back link to
the site root). The source deck never carries any of that.

Each deck also needs its slug in `DECK_SLUGS` in `next.config.ts`. Next does not resolve a
directory to its `index.html` under `public/` — verified: `/writing-was-the-job` 404s while
`/writing-was-the-job/index.html` returns 200 — so the rewrite is what makes the clean URL
work, and the injected `<base>` is what keeps relative asset paths resolving from it.

### Current decks

| URL | Source | Indexed |
| --- | --- | --- |
| `/writing-was-the-job` | `~/decks/writing-was-the-job` | No — `noindex`, not in `sitemap.ts`, unlinked |

To make a deck indexable: set `indexable: true` for it in `scripts/sync-deck.mjs`, re-sync,
and add an entry to `src/app/sitemap.ts`.
