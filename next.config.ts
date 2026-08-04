import type { NextConfig } from "next";

// Static reveal.js decks living in public/<slug>, synced by scripts/sync-deck.mjs.
// Next does not resolve a directory to its index.html for files under public/
// (verified: /writing-was-the-job 404s, /writing-was-the-job/index.html 200s),
// so each deck needs an explicit rewrite to be reachable at a clean URL.
const DECK_SLUGS = ["writing-was-the-job"];

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return DECK_SLUGS.map((slug) => ({
      source: `/${slug}`,
      destination: `/${slug}/index.html`,
    }));
  },
};

export default nextConfig;
