import { createMarkdownHandler } from "next-markdown-mirror/nextjs";

// Converts the page's own rendered HTML to Markdown. src/proxy.ts rewrites
// Markdown requests here.
export async function GET(
  request: Request,
  context: RouteContext<"/md-mirror/[...path]">,
) {
  const baseUrl = new URL(request.url).origin;
  const { path = ["index"] } = await context.params;
  // The adapter joins decoded segments and forwards Cookie to the resolved URL.
  // A decoded separator can turn that path into a different URL authority.
  if (path.some((segment) => /[/\\]/.test(segment))) {
    return new Response("Invalid Markdown path", { status: 400 });
  }
  const originalPath = "/" + path.join("/");
  let fetchUrl: URL;
  try {
    fetchUrl = new URL(originalPath === "/index" ? "/" : originalPath, baseUrl);
  } catch {
    return new Response("Invalid Markdown path", { status: 400 });
  }
  if (fetchUrl.origin !== baseUrl) {
    return new Response("Invalid Markdown path", { status: 400 });
  }

  const handler = createMarkdownHandler({
    // Fetch the HTML from the deployment serving this request (a preview converts
    // its own pages), not from production.
    baseUrl,
    // PageLayout puts each page's h1 and intro in a <header> inside <main>; the
    // package drops <header> elements unless told to keep them.
    includeSelectors: ["main header"],
  });
  return handler(request, context);
}
