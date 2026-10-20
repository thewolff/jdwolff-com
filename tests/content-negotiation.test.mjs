// Content negotiation: every page answers browsers with HTML and agents with
// Markdown at the same URL. Runs against the built site (`next build` first;
// `npm test` does both).

import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer as createHttpServer, request as httpRequest } from "node:http";
import { createServer } from "node:net";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const PRODUCTION_ORIGIN = "https://jdwolff.com";
const DECK = "/writing-was-the-job";

const CHROME_ACCEPT =
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8";
const MARKDOWN_ACCEPTS = ["text/markdown", "text/markdown, text/html;q=0.9"];

let server;
let serverLog = "";
let origin;
let pages;

// ---------------------------------------------------------------------------
// Server lifecycle

function freePort() {
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.once("error", reject);
    probe.listen(0, () => {
      const { port } = probe.address();
      probe.close(() => resolve(port));
    });
  });
}

async function waitUntilServing(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`next start exited early:\n${serverLog}`);
    }
    try {
      await fetch(url);
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
  throw new Error(`next start did not answer within ${timeoutMs} ms:\n${serverLog}`);
}

before(async () => {
  if (!existsSync(new URL("../.next/BUILD_ID", import.meta.url))) {
    throw new Error("No production build found: run `next build` first (or `npm test`).");
  }
  const port = await freePort();
  // localhost, not 127.0.0.1: Next reports loopback request URLs as localhost,
  // so that is the origin the Markdown's links are resolved against.
  origin = `http://localhost:${port}`;
  server = spawn(`${ROOT}node_modules/.bin/next`, ["start", "--port", String(port)], {
    cwd: ROOT,
    detached: true,
    stdio: ["ignore", "pipe", "pipe"],
  });
  server.stdout.on("data", (chunk) => (serverLog += chunk));
  server.stderr.on("data", (chunk) => (serverLog += chunk));
  await waitUntilServing(origin, 30_000);

  const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text();
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.ok(locs.length > 0, "the sitemap lists no pages");
  const paths = locs.map((loc) => {
    assert.ok(loc.startsWith(PRODUCTION_ORIGIN), `unexpected sitemap URL ${loc}`);
    return new URL(loc.replace(PRODUCTION_ORIGIN, origin)).pathname;
  });
  pages = [...new Set([...paths, DECK])];
});

after(async () => {
  if (!server || server.exitCode !== null) return;
  const exited = new Promise((resolve) => server.once("exit", resolve));
  // Detached, so the server is a process group leader: stop it and any children.
  process.kill(-server.pid, "SIGTERM");
  await exited;
});

// ---------------------------------------------------------------------------
// Helpers

/** GET a path with the given headers; returns status, content type, Vary and body. */
async function get(path, headers = {}) {
  const response = await fetch(`${origin}${path}`, { headers });
  return {
    status: response.status,
    type: response.headers.get("content-type") ?? "",
    vary: response.headers.get("vary") ?? "",
    body: await response.text(),
  };
}

/**
 * GET a path with no Accept header at all. fetch() always sends `Accept: *\/*`
 * when none is given, so this case needs node:http.
 */
function getWithoutAccept(path) {
  return new Promise((resolve, reject) => {
    const req = httpRequest(`${origin}${path}`, (response) => {
      let body = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => (body += chunk));
      response.on("end", () =>
        resolve({
          status: response.statusCode,
          type: response.headers["content-type"] ?? "",
          vary: response.headers.vary ?? "",
          body,
        }),
      );
    });
    req.on("error", reject);
    req.end();
  });
}

const NAMED_ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

function decodeEntities(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, name) => {
    if (name[0] === "#") {
      const hex = name[1] === "x" || name[1] === "X";
      return String.fromCodePoint(parseInt(name.slice(hex ? 2 : 1), hex ? 16 : 10));
    }
    return NAMED_ENTITIES[name.toLowerCase()] ?? entity;
  });
}

/** Visible text of an HTML fragment, whitespace collapsed. */
function textOf(html) {
  return decodeEntities(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

/** Lower-case words only, so Markdown escapes and punctuation do not matter. */
function words(text) {
  return (text.toLowerCase().match(/[a-z0-9]+/g) ?? []).join(" ");
}

function isHtml(response) {
  return /^text\/html/i.test(response.type);
}

function isMarkdown(response) {
  return /^text\/markdown/i.test(response.type);
}

const htmlFacts = new Map();

/**
 * What each page's HTML says it contains: the h1 text (up to its first <br>,
 * which Markdown renders as a line break), the first paragraph after the h1,
 * and the links in <main> (or the whole page when there is no <main>).
 */
async function factsFor(path) {
  if (htmlFacts.has(path)) return htmlFacts.get(path);
  const { status, body } = await get(path, { Accept: CHROME_ACCEPT });
  assert.equal(status, 200, `${path} HTML`);

  const h1 = body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  assert.ok(h1, `${path} has no <h1>`);
  const h1Text = textOf(h1[1].split(/<br\s*\/?>/i)[0]);
  assert.ok(h1Text, `${path} has an empty <h1>`);

  const afterH1 = body.slice(h1.index + h1[0].length);
  const paragraph = afterH1.match(/<p[\s>][\s\S]*?<\/p>/);
  assert.ok(paragraph, `${path} has no paragraph after its <h1>`);

  const main = body.match(/<main[\s>][\s\S]*?<\/main>/);
  const base = body.match(/<base\s[^>]*href="([^"]+)"/);
  const pageUrl = new URL(base ? decodeEntities(base[1]) : path, `${origin}${path}`);
  const links = [...(main ? main[0] : body).matchAll(/<a\s[^>]*href="([^"]+)"/g)]
    .map((m) => decodeEntities(m[1]))
    .filter((href) => !href.startsWith("#"))
    .map((href) => ({ href, resolved: new URL(href, pageUrl).href }));

  const facts = { h1Text, paragraph: textOf(paragraph[0]), links };
  htmlFacts.set(path, facts);
  return facts;
}

function headingLines(markdown) {
  return markdown
    .split("\n")
    .filter((line) => /^#{1,6} /.test(line))
    .map((line) => line.replace(/^#+/, "").replace(/\s+/g, " ").trim());
}

// ---------------------------------------------------------------------------
// R1: browsers get HTML

test("R1: every page answers browsers with its HTML page", async (t) => {
  const requests = {
    "no Accept header": (path) => getWithoutAccept(path),
    "Accept: */*": (path) => get(path, { Accept: "*/*" }),
    "Chrome's Accept": (path) => get(path, { Accept: CHROME_ACCEPT }),
  };
  for (const path of pages) {
    await t.test(path, async () => {
      const { h1Text } = await factsFor(path);
      for (const [label, send] of Object.entries(requests)) {
        const response = await send(path);
        assert.equal(response.status, 200, `${label}: status`);
        assert.ok(isHtml(response), `${label}: got ${response.type}`);
        const h1 = response.body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
        assert.ok(h1, `${label}: no <h1>`);
        assert.ok(textOf(h1[1]).includes(h1Text), `${label}: <h1> is not "${h1Text}"`);
      }
    });
  }
});

// ---------------------------------------------------------------------------
// R2: agents asking for Markdown get Markdown

test("R2: every page answers Accept: text/markdown with Markdown", async (t) => {
  for (const path of pages) {
    await t.test(path, async () => {
      for (const accept of MARKDOWN_ACCEPTS) {
        const response = await get(path, { Accept: accept });
        assert.equal(response.status, 200, `${accept}: status`);
        assert.ok(isMarkdown(response), `${accept}: got ${response.type}`);
        assert.ok(!/<html/i.test(response.body), `${accept}: body contains <html`);
      }
    });
  }
});

// ---------------------------------------------------------------------------
// R3: the Markdown keeps the page's substance

test("R3: the Markdown keeps each page's heading, intro and links", async (t) => {
  for (const path of pages) {
    await t.test(path, async () => {
      const { h1Text, paragraph, links } = await factsFor(path);
      const { body: markdown } = await get(path, { Accept: "text/markdown" });

      assert.ok(
        headingLines(markdown).some((heading) => heading.startsWith(h1Text)),
        `no "# ${h1Text}" heading`,
      );
      // Drop link targets so a link inside the paragraph does not split it.
      const prose = words(markdown.replace(/\]\([^)]*\)/g, "]"));
      assert.ok(prose.includes(words(paragraph)), `first paragraph missing: "${paragraph}"`);
      for (const { href, resolved } of links) {
        assert.ok(
          markdown.includes(`](${resolved})`) || markdown.includes(`](${href})`),
          `link missing: ${href}`,
        );
      }
    });
  }
});

test("R3: the deck's Markdown keeps slide titles and speaker notes", async () => {
  const { body: markdown } = await get(DECK, { Accept: "text/markdown" });
  assert.ok(
    headingLines(markdown).some((heading) => heading.startsWith("The day I was")),
    'no "The day I was" slide title',
  );
  assert.ok(markdown.includes("Good morning. I still write code"), "speaker note missing");
});

// ---------------------------------------------------------------------------
// R4: the Accept header (or ?v=md) decides, never the User-Agent

test("R4: a bot User-Agent with a browser Accept gets HTML", async () => {
  const response = await get("/about", { "User-Agent": "ClaudeBot", Accept: CHROME_ACCEPT });
  assert.equal(response.status, 200);
  assert.ok(isHtml(response), `got ${response.type}`);
});

test("R4: ?v=md gets Markdown", async () => {
  const response = await get("/about?v=md", { Accept: CHROME_ACCEPT });
  assert.equal(response.status, 200);
  assert.ok(isMarkdown(response), `got ${response.type}`);
  assert.ok(!/<html/i.test(response.body), "body contains <html");
});

// ---------------------------------------------------------------------------
// R5: caches can tell the two representations apart

test("R5: Markdown responses send Vary: Accept", async () => {
  const response = await get("/about", { Accept: "text/markdown" });
  assert.ok(isMarkdown(response), `got ${response.type}`);
  const varies = response.vary.split(",").map((name) => name.trim().toLowerCase());
  assert.ok(varies.includes("accept"), `Vary is "${response.vary}"`);
});

test("R5: alternating requests to one route each get their own type", async () => {
  const sequence = [CHROME_ACCEPT, "text/markdown", CHROME_ACCEPT, "text/markdown", CHROME_ACCEPT];
  for (const [i, accept] of sequence.entries()) {
    const response = await get("/work", { Accept: accept });
    const want = accept === "text/markdown" ? isMarkdown : isHtml;
    assert.ok(want(response), `request ${i + 1} (${accept}) got ${response.type}`);
  }
});

// ---------------------------------------------------------------------------
// R6: Markdown is converted from the deployment serving the request

test("R6: Markdown links point at the serving origin, not production", async () => {
  const { body: markdown } = await get("/", { Accept: "text/markdown" });
  const targets = [...markdown.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1]);
  assert.ok(
    targets.some((target) => target.startsWith(`${origin}/`)),
    `no link to ${origin}`,
  );
  assert.deepEqual(
    targets.filter((target) => target.startsWith(PRODUCTION_ORIGIN)),
    [],
    "links point at production",
  );
});

test("R6: direct Markdown handler still converts same-origin pages with queries", async () => {
  const { h1Text } = await factsFor("/about");
  const response = await get("/md-mirror/about?v=md&source=direct-handler-control", {
    Cookie: "mirror_security_control=local-only",
  });
  assert.equal(response.status, 200);
  assert.ok(isMarkdown(response), `got ${response.type}`);
  assert.ok(headingLines(response.body).some((heading) => heading.startsWith(h1Text)));
});

test("R6 security: decoded separators cannot leak cookies to another origin", async (t) => {
  const received = [];
  const sink = createHttpServer((request, response) => {
    received.push({ path: request.url, cookie: request.headers.cookie });
    response.writeHead(200, { "Content-Type": "text/html" });
    response.end("<main><h1>Local security sink</h1></main>");
  });
  await new Promise((resolve, reject) => {
    sink.once("error", reject);
    sink.listen(0, "127.0.0.1", resolve);
  });
  t.after(() => new Promise((resolve, reject) => {
    sink.close((error) => error ? reject(error) : resolve());
  }));
  const { port } = sink.address();
  const sentinel = "mirror_security_sentinel=local-only";
  for (const encoded of ["%2F", "%5C", "%2F%2F", "%5C%5C"]) {
    await t.test(encoded, async () => {
      const path = `/md-mirror/${encoded}127.0.0.1:${port}/`;
      const response = await get(path, { Cookie: sentinel });
      assert.deepEqual(
        received,
        [],
        `${path} reached the local sink: ${JSON.stringify(received)}`,
      );
      assert.equal(response.status, 400, `${path}: status`);
    });
  }
});

// ---------------------------------------------------------------------------
// R7: the static llms.txt is untouched

test("R7: /llms.txt is the static text file, even to Accept: text/markdown", async () => {
  const file = await readFile(new URL("../public/llms.txt", import.meta.url), "utf8");
  const response = await get("/llms.txt", { Accept: "text/markdown" });
  assert.equal(response.status, 200);
  assert.match(response.type, /^text\/plain/i);
  assert.equal(response.body, file);
});
