import PageLayout from "@/app/components/PageLayout/PageLayout";
import styles from "./page.module.css";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies from fifteen years in frontend — Amazon, AirBnB, LA Dodgers, and more.",
  alternates: {
    canonical: "/work",
  },
  openGraph: {
    images: [{ url: "/og?eyebrow=Work&title=Things+I've+built." }],
  },
};

const projects = [
  {
    slug: "onechat",
    client: "Airbnb",
    category: "AI Tooling",
    title: "OneChat",
    desc: "Full frontend rebuild of Airbnb's internal AI chat — new architecture, design system migration, and an agents workflow from scratch.",
  },
  {
    slug: "meridian",
    client: "Amazon",
    category: "Design Systems",
    title: "Meridian",
    desc: "Founding team member of Amazon's enterprise design system. Built for scale, designed for humans.",
  },
  {
    slug: "dodgers",
    client: "LA Dodgers",
    category: "Web Application · CLIO Award 2015",
    title: "Digital Trading Room",
    desc: "Award-winning real-time interface for one of baseball's most storied franchises.",
  },
];

export default function Work() {
  return (
    <PageLayout
      eyebrow="Work"
      title="Things I've built."
      intro="Most of my best work lives under NDA. What I can share, I've written up as stories — the problem, the approach, what shipped, what I learned."
    >
      <ol className={styles.list} role="list">
        {projects.map((p) => (
          <li key={p.slug}>
            <article className={styles.project}>
              <span className={`mono muted ${styles.meta}`}>
                {p.client} · {p.category}
              </span>
              <h2 className={styles.title}>{p.title}</h2>
              <p className={styles.desc}>{p.desc}</p>
              <Link href={`/work/${p.slug}`} className={`mono ${styles.link}`}>
                Read the story <span aria-hidden="true">→</span>
                <span className="visuallyHidden"> about {p.title}</span>
              </Link>
            </article>
          </li>
        ))}
      </ol>
    </PageLayout>
  );
}
