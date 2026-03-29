import PageLayout from "@/app/components/PageLayout/PageLayout";
import styles from "./page.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Jo Wolff — frontend engineer.",
  alternates: {
    canonical: "https://jdwolff.com/contact",
  },
  openGraph: {
    images: [{ url: "/og?eyebrow=Contact&title=Say+hello." }],
  },
};

export default function Contact() {
  return (
    <PageLayout
      eyebrow="Contact"
      title="Say hello."
      intro="I'm always up for a conversation about frontend, accessibility, design systems, or whatever you're building."
    >
      <div className={styles.links}>
        <a href="mailto:thewolff@jdwolff.com" className={styles.contactLink}>
          <span className="mono muted">Email</span>
          <span>thewolff@jdwolff.com</span>
        </a>
        <a
          href="https://www.linkedin.com/in/josephdwolff/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.contactLink}
        >
          <span className="mono muted">LinkedIn</span>
          <span>josephdwolff</span>
        </a>
        <a
          href="https://github.com/thewolff"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.contactLink}
        >
          <span className="mono muted">GitHub</span>
          <span>thewolff</span>
        </a>
        <a
          href="https://bsky.app/profile/thewolff-frontend.bsky.social"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.contactLink}
        >
          <span className="mono muted">Bluesky</span>
          <span>@thewolff-frontend.bsky.social</span>
        </a>
        <a
          href="https://x.com/thewolff_FEE"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.contactLink}
        >
          <span className="mono muted">X / Twitter</span>
          <span>@thewolff_FEE</span>
        </a>
        <a
          href="https://substack.com/@thewolfffrontend"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.contactLink}
        >
          <span className="mono muted">Substack</span>
          <span>@thewolfffrontend</span>
        </a>
      </div>
    </PageLayout>
  );
}
