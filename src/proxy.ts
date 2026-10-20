import { withMarkdownMirror } from "next-markdown-mirror/nextjs";

// Requests whose Accept header contains text/markdown (or that carry ?v=md) are
// rewritten to /md-mirror/<path>, which answers with Markdown of the same page.
// Everything else, whatever its User-Agent, gets the normal HTML.
export const proxy = withMarkdownMirror();
