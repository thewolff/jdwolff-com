import PageLayout from "@/app/components/PageLayout/PageLayout";
import styles from "./page.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Jo Wolff — frontend engineer.",
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
        <a href="mailto:thewolff@jdwolff.co m" className={styles.contactLink}>
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
      </div>
    </PageLayout>
  );
}
