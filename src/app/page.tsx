import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <p className={`mono muted ${styles.eyebrow}`}>
          Jo Wolff — Frontend Engineer
        </p>
        <h1 className={styles.headline}>
          I build interfaces
          <br />
          <em>that get out of the way.</em>
        </h1>
        <p className={styles.subhead}>
          Fifteen years in the craft. Formerly Amazon. English major first,
          engineer second — it shows in the work.
        </p>
      </section>

      <section className={styles.section}>
        <p className={`mono muted ${styles.sectionLabel}`}>Selecte d Work</p>
        <div className={styles.workGrid}>
          <Link href="/work/meridian" className={styles.workItem}>
            <span className={`mono muted ${styles.workMeta}`}>
              Amazon · Design Systems
            </span>
            <h2 className={styles.workTitle}>Meridian</h2>
            <p className={styles.workDesc}>
              Founding team member of Amazon's enterprise design system. Built
              for scale, designed for humans.
            </p>
            <span className={`mono ${styles.workLink}`}>Read the story →</span>
          </Link>
          <Link href="/work/dodgers" className={styles.workItem}>
            <span className={`mono muted ${styles.workMeta}`}>
              LA Dodgers · 2015 · CLIO Award
            </span>
            <h2 className={styles.workTitle}>Dig ital Trading Room</h2>
            <p className={styles.workDesc}>
              Award-winning real-time interface for one of baseball's most
              storied franchises.
            </p>
            <span className={`mono ${styles.workLink}`}>Read the story →</span>
          </Link>
        </div>
      </section>

      <section className={styles.section}>
        <p className={`mono muted ${styles.sectionLabel}`}>
          Writing & Thinking
        </p>
        <div className={styles.writingList}>
          <Link href="/writing/self-taught" className={styles.writingItem}>
            <h3 className={styles.writingTitle}>
              I have no CS degree. Here's what I learned anyway.
            </h3>
            <p className={`muted ${styles.writingDesc}`}>
              On being self-taught, imposter syndrome, and why the English major
              thing ended up being an advantage.
            </p>
          </Link>
          <Link href="/writing/accessibility" className={styles.writingItem}>
            <h3 className={styles.writingTitle}>
              Accessibility isn't a checklist. It's a disposition.
            </h3>
            <p className={`muted ${styles.writingDesc}`}>
              What fifteen years of building for everyone taught me about what
              software is actually for.
            </p>
          </Link>
          <Link href="/writing/design-systems" className={styles.writingItem}>
            <h3 className={styles.writingTitle}>
              Design systems are a trust problem, not a component problem.
            </h3>
            <p className={`muted ${styles.writingDesc}`}>
              The technical part is the easy part. The hard part is getting
              fifty teams to believe in the same foundation.
            </p>
          </Link>
        </div>
        <Link href="/writing" className={`mono ${styles.allLink}`}>
          All writing →
        </Link>
      </section>
    </main>
  );
}
