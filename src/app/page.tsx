import styles from "./page.module.css";
import Link from "next/link";
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

      <section className={styles.section} aria-labelledby="work-heading">
        <h2 id="work-heading" className={`mono muted ${styles.sectionLabel}`}>
          Selected Work
        </h2>
        <div className={styles.workGrid}>
          <article className={styles.workItem}>
            <span className={`mono muted ${styles.workMeta}`}>
              Airbnb · AI Chat
            </span>
            <h3 className={styles.workTitle}>OneChat</h3>
            <p className={styles.workDesc}>
              Rebuilding Airbnb&apos;s employee-facing AI chat from the ground
              up - new architecture, new features, and a design system migration
              that finally made the app feel like it belonged.
            </p>
            <Link href="/work/onechat" className={`mono ${styles.workLink}`}>
              Read the story <span aria-hidden="true">→</span>
              <span className="visually-hidden">
                {" "}
                about Airbnb&apos;s OneChat
              </span>
            </Link>
          </article>

          <article className={styles.workItem}>
            <span className={`mono muted ${styles.workMeta}`}>
              Amazon · Design Systems
            </span>
            <h3 className={styles.workTitle}>Meridian</h3>
            <p className={styles.workDesc}>
              Founding team member of Amazon&apos;s enterprise design system.
              Built for scale, designed for humans.
            </p>
            <Link href="/work/meridian" className={`mono ${styles.workLink}`}>
              Read the story <span aria-hidden="true">→</span>
              <span className="visually-hidden">
                {" "}
                about Meridian design system
              </span>
            </Link>
          </article>

          <article className={styles.workItem}>
            <span className={`mono muted ${styles.workMeta}`}>
              LA Dodgers · 2015 · CLIO Award
            </span>
            <h3 className={styles.workTitle}>Digital Trading Room</h3>
            <p className={styles.workDesc}>
              Award-winning real-time interface for one of baseball&apos;s most
              storied franchises.
            </p>
            <Link href="/work/dodgers" className={`mono ${styles.workLink}`}>
              Read the story <span aria-hidden="true">→</span>
              <span className="visually-hidden">
                {" "}
                about the Dodgers Digital Trading Room.
              </span>
            </Link>
          </article>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="writing-heading">
        <h2
          id="writing-heading"
          className={`mono muted ${styles.sectionLabel}`}
        >
          Writing & Thinking
        </h2>
        <ol className={styles.writingList} role="list">
          <li>
            <article className={styles.writingItem}>
              <h3 className={styles.writingTitle}>
                <Link href="/writing/self-taught">
                  I have no CS degree. Here&apos;s what I learned anyway.
                </Link>
              </h3>
              <p className={`muted ${styles.writingDesc}`}>
                On being self-taught, imposter syndrome, and why the English
                major thing ended up being an advantage.
              </p>
            </article>
          </li>

          <li>
            <article className={styles.writingItem}>
              <h3 className={styles.writingTitle}>
                <Link href="/writing/accessibility">
                  Accessibility isn&apos;t a checklist. It&apos;s a disposition.
                </Link>
              </h3>
              <p className={`muted ${styles.writingDesc}`}>
                What fifteen years of building for everyone taught me about what
                software is actually for.
              </p>
            </article>
          </li>

          <li>
            <article className={styles.writingItem}>
              <h3 className={styles.writingTitle}>
                <Link href="/writing/design-systems">
                  Design systems are a trust problem, not a component problem.
                </Link>
              </h3>
              <p className={`muted ${styles.writingDesc}`}>
                The technical part is the easy part. The hard part is getting
                fifty teams to believe in the same foundation.
              </p>
            </article>
          </li>
        </ol>
        <Link href="/writing" className={`mono ${styles.allLink}`}>
          All writing <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
