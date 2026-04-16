import PageLayout from "@/app/components/PageLayout/PageLayout";
import styles from "./page.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Jo Wolff — frontend engineer.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    images: [{ url: "/og?eyebrow=Contact&title=Say+hello." }],
  },
};

const links = [
  {
    label: "Email",
    handle: "thewolff@jdwolff.com",
    href: "mailto:thewolff@jdwolff.com",
    external: false,
  },
  {
    label: "LinkedIn",
    handle: "josephdwolff",
    href: "https://www.linkedin.com/in/josephdwolff/",
    external: true,
  },
  {
    label: "GitHub",
    handle: "thewolff",
    href: "https://github.com/thewolff",
    external: true,
  },
  {
    label: "Bluesky",
    handle: "@thewolff-frontend.bsky.social",
    href: "https://bsky.app/profile/thewolff-frontend.bsky.social",
    external: true,
  },
  {
    label: "X / Twitter",
    handle: "@thewolff_FEE",
    href: "https://x.com/thewolff_FEE",
    external: true,
  },
  {
    label: "Substack",
    handle: "@thewolfffrontend",
    href: "https://substack.com/@thewolfffrontend",
    external: true,
  },
];

export default function Contact() {
  return (
    <PageLayout
      eyebrow="Contact"
      title="Say hello."
      intro="I'm always up for a conversation about frontend, accessibility, design systems, or whatever you're building."
    >
      <div className={styles.links}>
        {links.map(({ label, handle, href, external }) => (
          <a
            key={label}
            href={href}
            className={styles.contactLink}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            <span className="mono muted">{label}</span>
            <span className={styles.handle}>{handle}</span>
            {external && (
              <span className="visuallyHidden"> (opens in new tab)</span>
            )}
          </a>
        ))}
      </div>
    </PageLayout>
  );
}
