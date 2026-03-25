import PageLayout from "@/app/components/PageLayout/PageLayout";
import styles from "./page.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility Statement — Jo Wolff",
};

export default function Accessibility() {
  return (
    <PageLayout
      eyebrow="Accessibility"
      title="This site is built to be usable by everyone."
      intro="That's not a disclaimer. It's a design constraint."
    >
      <article className={styles.article}>
        <p>
          I&apos;m a frontend engineer who specializes in accessibility. It
          would be embarrassing - and frankly inconsistent - if my own portfolio
          wasn&apos;t accessible. This page documents what I&apos;ve done, what
          I&apos;m still working on, and how to reach me if something isn&apos;t
          working for you.
        </p>

        <h2>Target standard</h2>
        <p>
          This site aims to conform to{" "}
          <a
            href="https://www.w3.org/TR/WCAG21/"
            target="_blank"
            rel="noopener noreferrer"
          >
            WCAG 2.1 Level AA
          </a>
          . Where it&apos;s practical and doesn&apos;t compromise design, I aim
          for AAA.
        </p>

        <h2>What&apos;s been done</h2>
        <ul>
          <li>
            <strong>Skip navigation:</strong> A skip link appears on focus,
            allowing keyboard users to bypass the header and jump to main
            content.
          </li>
          <li>
            <strong>Semantic HTML:</strong> Pages use appropriate landmark
            regions (<code>header</code>, <code>nav</code>, <code>main</code>,{" "}
            <code>footer</code>), heading hierarchies, and <code>article</code>{" "}
            elements for content.
          </li>
          <li>
            <strong>Keyboard navigation:</strong> All interactive elements are
            reachable and operable via keyboard. The mobile navigation menu
            traps focus while open and releases it on close.
          </li>
          <li>
            <strong>Escape key support:</strong> The mobile menu closes on
            Escape, following established interaction patterns.
          </li>
          <li>
            <strong>ARIA:</strong> Navigation landmarks are labelled, the mobile
            menu button uses <code>aria-expanded</code> and{" "}
            <code>aria-controls</code>, and menu state changes are announced via
            an <code>aria-live</code> region.
          </li>
          <li>
            <strong>Reduced motion:</strong> All animations and transitions are
            suppressed for users who have requested reduced motion via their
            operating system preferences.
          </li>
          <li>
            <strong>Colour contrast:</strong> All text and interactive elements
            meet or exceed WCAG AA contrast ratios against their backgrounds.
            Most meet AAA. And yes, I do prefer the british spelling of colour.
          </li>
          <li>
            <strong>Decorative elements:</strong> Decorative icons and
            typographic characters (like arrows) are marked{" "}
            <code>aria-hidden</code> so they&apos;re not announced by screen
            readers.
          </li>
        </ul>

        <h2>Known limitations</h2>
        <ul>
          <li>
            <strong>Content still in progress:</strong> Some pages are
            placeholders. As content is added, it will be held to the same
            accessibility standard.
          </li>
          <li>
            <strong>No automated testing yet:</strong> I&apos;m relying on
            manual testing and code review. Automated tooling (axe-core,
            Lighthouse) will be integrated before the site is considered
            complete.
          </li>
          <li>
            <strong>Screen reader testing:</strong> I&apos;ve tested with
            VoiceOver on macOS. NVDA and JAWS testing on Windows is planned.
          </li>
        </ul>

        <h2>Testing environment</h2>
        <p>This site has been tested with:</p>
        <ul>
          <li>VoiceOver + Safari on macOS</li>
          <li>Keyboard-only navigation in Chrome and Firefox</li>
          <li>Chrome DevTools accessibility panel</li>
          <li>Manual contrast ratio calculations against WCAG 2.1</li>
        </ul>

        <h2>Found something?</h2>
        <p>
          If you encounter an accessibility barrier on this site - something
          that doesn&apos;t work with your assistive technology, a contrast
          issue, anything - I want to know. Genuinely.
        </p>
        <p>
          Email me at{" "}
          <a href="mailto:thewolff@jdwolff.com">thewolff@jdwolff.com</a>.
          I&apos;ll respond, and I&apos;ll fix it.
        </p>

        <p className={`mono ${styles.updated}`}>Last updated: March 2026</p>
      </article>
    </PageLayout>
  );
}
