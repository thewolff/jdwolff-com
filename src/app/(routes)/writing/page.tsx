import PageLayout from "@/app/components/PageLayout/PageLayout";
import styles from "./page.module.css";
import TransitionLink from "@/app/components/TransitionLink/TransitionLink";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "On frontend engineering, accessibility, design systems, and the strange experience of being an English major who writes code.",
  alternates: {
    canonical: "https://jdwolff.com/writing",
  },
  openGraph: {
    images: [{ url: "/og?eyebrow=Writing&title=Thinking+out+loud." }],
  },
};

const posts = [
  {
    slug: "self-taught",
    title: "I have no CS degree. Here's what I learned anyway.",
    desc: "On being self-taught, imposter syndrome, and why the English major thing ended up being an advantage.",
    date: "2026-03-10",
    readTime: "5 min"
  },
  {
    slug: "accessibility",
    title: "Accessibility isn't a checklist. It's a disposition.",
    desc: "What fifteen years of building for everyone taught me about what software is actually for.",
    date: "2026-02-15",
    readTime: "7 min"
  },
  {
    slug: "design-systems",
    title: "Design systems are a trust problem, not a component problem.",
    desc: "The technical part is the easy part. The hard part is getting fifty teams to believe in the same foundation.",
    date: "2026-01-05",
    readTime: "9 min"
  },
];

export default function Writing() {
  return (
    <PageLayout
      eyebrow="Writing"
      title="Thinking out loud."
      intro="On frontend engineering, accessibility, design systems, and the strange experience of being an English major who writes code for a living."
    >
<ul className={styles.list} role="list">
        {posts.map((p) => (
          <li key={p.slug}>
            <article className={styles.post}>
              <header>
                <div className="mono-label">PUB: {p.date} • {p.readTime} READ</div>
                <h2
                  className={styles.title}
                  style={{ viewTransitionName: `writing-title-${p.slug}` }}
                >
                  <TransitionLink href={`/writing/${p.slug}`}>{p.title}</TransitionLink>
                </h2>
              </header>
              <p className={`muted ${styles.desc}`}>{p.desc}</p>
            </article>
          </li>
        ))}
      </ul>
    </PageLayout>
  );
}
