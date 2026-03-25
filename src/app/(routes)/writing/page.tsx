import PageLayout from "@/app/components/PageLayout/PageLayout";
import styles from "./page.module.css";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing — Jo Wolff",
};

const posts = [
  {
    slug: "self-taught",
    title: "I have no CS degree. Here's what I learned anyway.",
    desc: "On being self-taught, imposter syndrome, and why the English major thing ended up being an advantage.",
  },
  {
    slug: "accessibility",
    title: "Accessibility isn't a checklist. It's a disposition.",
    desc: "What fifteen years of building for everyone taught me about what software is actually for.",
  },
  {
    slug: "design-systems",
    title: "Design systems are a trust problem, not a component problem.",
    desc: "The technical part is the easy part. The hard part is getting fifty teams to believe in the same foundation.",
  },
];

export default function Writing() {
  return (
    <PageLayout
      eyebrow="Writing"
      title="Thinking out loud."
      intro="On frontend engineering, accessibility, design systems, and the strange experience of being an English major who writes code for a living."
    >
      <ol className={styles.list} role="list">
        {posts.map((p) => (
          <li key={p.slug}>
            <article className={styles.post}>
              <h2 className={styles.title}>
                <Link href={`/writing/${p.slug}`}>{p.title}</Link>
              </h2>
              <p className={`muted ${styles.desc}`}>{p.desc}</p>
            </article>
          </li>
        ))}
      </ol>
    </PageLayout>
  );
}
