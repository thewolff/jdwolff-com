import styles from "./page.module.css";
import Link from "next/link";
import TransitionLink from "./components/TransitionLink/TransitionLink";
import JsonLd from "./components/JsonLd/JsonLd";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jo Wolff",
  url: "https://jdwolff.com",
  jobTitle: "Frontend Engineer",
  description:
    "Frontend engineer with fifteen years in the craft. Specialist in design systems, accessibility, and React. Formerly Amazon and Airbnb. They/them.",
  sameAs: [
    "https://www.linkedin.com/in/josephdwolff/",
    "https://bsky.app/profile/thewolff-frontend.bsky.social",
    "https://x.com/thewolff_FEE",
    "https://github.com/thewolff",
    "https://substack.com/@thewolfffrontend",
  ],
  knowsAbout: [
    "Frontend Engineering",
    "Design Systems",
    "Web Accessibility",
    "React",
    "TypeScript",
    "WCAG",
  ],
  alumniOf: [
    { "@type": "Organization", name: "Amazon" },
    { "@type": "Organization", name: "Airbnb" },
  ],
};

const featuredWork = [
  {
    slug: "onechat",
    meta: "Airbnb · AI Chat",
    title: "OneChat",
    desc: "Rebuilding Airbnb's employee-facing AI chat from the ground up - new architecture, new features, and a design system migration that finally made the app feel like it belonged.",
  },
  {
    slug: "meridian",
    meta: "Amazon · Design Systems",
    title: "Meridian",
    desc: "Founding team member of Amazon's enterprise design system. Built for scale, designed for humans.",
  },
  {
    slug: "dodgers",
    meta: "LA Dodgers · 2015 · CLIO Award",
    title: "Digital Trading Room",
    desc: "Award-winning real-time interface for one of baseball's most storied franchises.",
  },
];

const featuredWriting = [
  {
    slug: "self-taught",
    title: "I have no CS degree. Here\u2019s what I learned anyway.",
    desc: "On being self-taught, imposter syndrome, and why the English major thing ended up being an advantage.",
  },
  {
    slug: "accessibility",
    title: "Accessibility isn\u2019t a checklist. It\u2019s a disposition.",
    desc: "What fifteen years of building for everyone taught me about what software is actually for.",
  },
  {
    slug: "design-systems",
    title: "Design systems are a trust problem, not a component problem.",
    desc: "The technical part is the easy part. The hard part is getting fifty teams to believe in the same foundation.",
  },
];

export default function Home() {
  return (
    <main id="main-content" className={styles.main}>
      <JsonLd data={personSchema} />
      <section className={styles.hero} aria-labelledby="hero-heading">
        <p className={`mono muted ${styles.eyebrow}`}>
          Jo Wolff - Frontend Engineer
        </p>
        <h1 id="hero-heading" className={styles.headline}>
          I build interfaces
          <br />
          <em>that get out of the way.</em>
        </h1>
        <p className={styles.subhead}>
          Fifteen years in the craft. Formerly Amazon. English major first,
          engineer second - it shows in the work.
        </p>
      </section>

      <section
        className={`${styles.section} ${styles.fadeIn}`}
        aria-labelledby="work-heading"
      >
        <h2 id="work-heading" className={`mono muted ${styles.sectionLabel}`}>
          Selected Work
        </h2>
        <div className={styles.workGrid}>
          {featuredWork.map((item) => (
            <article key={item.slug} className={styles.workItem}>
              <span className={`mono muted ${styles.workMeta}`}>
                {item.meta}
              </span>
              <h3
                className={styles.workTitle}
                style={{ viewTransitionName: `work-title-${item.slug}` }}
              >
                {item.title}
              </h3>
              <p className={styles.workDesc}>{item.desc}</p>
              <TransitionLink
                href={`/work/${item.slug}`}
                className={`mono ${styles.workLink}`}
              >
                Read the story <span aria-hidden="true">→</span>
                <span className="visuallyHidden"> about {item.title}</span>
              </TransitionLink>
            </article>
          ))}
        </div>
      </section>

      <section
        className={`${styles.section} ${styles.fadeIn}`}
        style={{ animationDelay: "200ms" }}
        aria-labelledby="writing-heading"
      >
        <h2
          id="writing-heading"
          className={`mono muted ${styles.sectionLabel}`}
        >
          Writing & Thinking
        </h2>
        <ul className={styles.writingList} role="list">
          {featuredWriting.map((item) => (
            <li key={item.slug}>
              <article className={styles.writingItem}>
                <h3
                  className={styles.writingTitle}
                  style={{
                    viewTransitionName: `writing-title-${item.slug}`,
                  }}
                >
                  <TransitionLink href={`/writing/${item.slug}`}>
                    {item.title}
                  </TransitionLink>
                </h3>
                <p className={`muted ${styles.writingDesc}`}>{item.desc}</p>
              </article>
            </li>
          ))}
        </ul>
        <Link href="/writing" className={`mono ${styles.allLink}`}>
          All writing <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
