import { createMarkdownHandler } from "next-markdown-mirror/nextjs";

// Converts the page's own rendered HTML to Markdown. src/proxy.ts rewrites
// Markdown requests here.
export function GET(
  request: Request,
  context: RouteContext<"/md-mirror/[...path]">,
) {
  const handler = createMarkdownHandler({
    // Fetch the HTML from the deployment serving this request (a preview converts
    // its own pages), not from production.
    baseUrl: new URL(request.url).origin,
    // PageLayout puts each page's h1 and intro in a <header> inside <main>; the
    // package drops <header> elements unless told to keep them.
    includeSelectors: ["main header"],
  });
  return handler(request, context);
}
