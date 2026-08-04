#!/usr/bin/env node
/**
 * Sync a reveal.js deck from ~/decks/<slug> into public/<slug> so Next serves it
 * as a full-bleed static takeover at /<slug>.
 *
 * The deck stays authored in ~/decks/<slug>. Nothing here edits the source.
 * Everything this script adds to the copy (the noindex tag, the back link) is
 * injected at sync time, so the source deck stays a clean standalone artifact.
 *
 *   node scripts/sync-deck.mjs            # sync every deck in DECKS
 *   node scripts/sync-deck.mjs <slug>     # sync one
 */

import { cp, mkdir, readFile, writeFile, rm, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

const DECKS = [
  {
    slug: "writing-was-the-job",
    source: path.join(homedir(), "decks", "writing-was-the-job"),
    // Flip to true when you want search engines to index it. Until then the copy
    // carries <meta name="robots" content="noindex, nofollow">.
    indexable: false,
    backLinkLabel: "jdwolff.com",
  },
];

// reveal.js ships in the deck's own node_modules; vendor just the four files the
// deck actually references so public/ doesn't carry a whole package.
const REVEAL_FILES = [
  "dist/reset.css",
  "dist/reveal.css",
  "dist/reveal.js",
  "dist/plugin/notes.js",
];

const ROOT = path.resolve(import.meta.dirname, "..");

async function syncDeck(deck) {
  const { slug, source, indexable, backLinkLabel } = deck;
  const dest = path.join(ROOT, "public", slug);

  if (!existsSync(source)) {
    throw new Error(`Deck source not found: ${source}`);
  }
  const indexPath = path.join(source, "index.html");
  if (!existsSync(indexPath)) {
    throw new Error(`No index.html in ${source}`);
  }

  await rm(dest, { recursive: true, force: true });
  await mkdir(dest, { recursive: true });

  // 1. assets/ verbatim (theme.css, local woff2 fonts)
  await cp(path.join(source, "assets"), path.join(dest, "assets"), {
    recursive: true,
  });

  // 2. vendor the reveal.js files the deck references
  const revealRoot = path.join(source, "node_modules", "reveal.js");
  if (!existsSync(revealRoot)) {
    throw new Error(
      `reveal.js not installed in ${source}. Run \`npm install\` there first.`,
    );
  }
  for (const rel of REVEAL_FILES) {
    const from = path.join(revealRoot, rel);
    const to = path.join(dest, "vendor", "reveal", rel.replace(/^dist\//, ""));
    await mkdir(path.dirname(to), { recursive: true });
    await cp(from, to);
  }

  // 3. index.html, with paths rewritten and the hosted-only bits injected
  let html = await readFile(indexPath, "utf8");

  const before = html;
  html = html.replaceAll("node_modules/reveal.js/dist/", "vendor/reveal/");
  if (html === before) {
    throw new Error(
      "Expected to rewrite node_modules/reveal.js/dist/ paths but found none. " +
        "Did the deck's asset paths change?",
    );
  }

  // The deck is reached at /<slug> (no trailing slash) via a next.config rewrite,
  // so every relative asset path would otherwise resolve against the site root.
  // <base> pins them to the deck directory regardless of how the URL is written.
  const injected = [`<base href="/${slug}/" />`];
  if (!indexable) {
    injected.push(`<meta name="robots" content="noindex, nofollow" />`);
  }
  injected.push(
    `<meta property="og:title" content="How I Became a Developer Who Doesn't Write Code" />`,
    `<meta property="og:description" content="A 45-minute talk on using agentic AI in the development process. Press S for the full script." />`,
    `<meta property="og:type" content="article" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  );
  html = html.replace(
    /(<title>.*?<\/title>)/,
    `$1\n    ${injected.join("\n    ")}`,
  );

  // Back link, top-left, mirroring the .notes-hint chip in the bottom-right.
  const backLink =
    `\n    <a class="site-backlink" href="/">${backLinkLabel}</a>\n`;
  html = html.replace(/(\n\s*<button\s+class="notes-hint")/, backLink + "$1");

  await writeFile(path.join(dest, "index.html"), html, "utf8");

  // 4. the back link's styles, appended to the copied theme so the source
  //    theme.css never carries hosting-only CSS
  const themePath = path.join(dest, "assets", "theme.css");
  const theme = await readFile(themePath, "utf8");
  await writeFile(
    themePath,
    theme +
      `
/* ── Injected by jdwolff-com/scripts/sync-deck.mjs (hosted copy only) ────── */

.site-backlink {
  position: fixed;
  left: 18px;
  top: 16px;
  z-index: 40;
  font-family: var(--r-code-font);
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: var(--ink);
  color: var(--aged-print);
  border: 2px solid var(--ink);
  padding: 5px 10px;
  text-decoration: none;
  opacity: 0.5;
  transition: opacity 0.12s ease;
}
.site-backlink:hover,
.site-backlink:focus-visible { opacity: 1; }
.site-backlink:focus-visible {
  outline: 3px solid var(--henchman-gold);
  outline-offset: 3px;
}
`,
    "utf8",
  );

  const { size } = await stat(path.join(dest, "index.html"));
  return { slug, dest, indexable, htmlBytes: size };
}

const only = process.argv[2];
const targets = only ? DECKS.filter((d) => d.slug === only) : DECKS;

if (targets.length === 0) {
  console.error(
    `No deck matching "${only}". Known: ${DECKS.map((d) => d.slug).join(", ")}`,
  );
  process.exit(1);
}

for (const deck of targets) {
  const r = await syncDeck(deck);
  console.log(
    `synced /${r.slug}  →  public/${r.slug}  ` +
      `(${r.indexable ? "indexable" : "noindex"}, index.html ${r.htmlBytes} bytes)`,
  );
}
