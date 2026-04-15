import PageLayout from "@/app/components/PageLayout/PageLayout";
import styles from "./page.module.css";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import JsonLd from "@/app/components/JsonLd/JsonLd";
import SelfTaught from "./content/SelfTaught";
import AccessibilityTheatre from "./content/AccessibilityTheatre";
import DesignSystemsTension from "./content/DesignSystemsTension";

const posts: Record<
  string,
  {
    title: string;
    desc: string;
    eyebrow?: string;
    datePublished: string;
    component: React.ComponentType;
  }
> = {
  "self-taught": {
    title: "I have no CS degree. Here's what I learned anyway.",
    desc: "On being self-taught, imposter syndrome, and why the English major thing ended up being an advantage.",
    eyebrow: "Writing",
    datePublished: "2026-03-25",
    component: SelfTaught,
  },
  accessibility: {
    title: "Accessibility isn't a checklist. It's a disposition.",
    desc: "What fifteen years of building for everyone taught me about what software is actually for.",
    eyebrow: "Writing",
    datePublished: "2026-03-25",
    component: AccessibilityTheatre,
  },
  "design-systems": {
    title: "Design systems are a trust problem, not a component problem.",
    desc: "The technical part is the easy part. The hard part is getting fifty teams to believe in the same foundation.",
    eyebrow: "Writing",
    datePublished: "2026-03-25",
    component: DesignSystemsTension,
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) return {};
  return {
    title: post.title,
    description: post.desc,
    authors: [{ name: "Jo Wolff", url: "https://jdwolff.com" }],
    alternates: {
      canonical: `https://jdwolff.com/writing/${slug}`,
    },
    openGraph: {
      type: "article",
      publishedTime: post.datePublished,
      authors: ["Jo Wolff"],
      images: [
        {
          url: `/og?eyebrow=Writing&title=${encodeURIComponent(post.title)}`,
        },
      ],
    },
  };
}

export default async function WritingPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) notFound();

  const Content = post.component;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.desc,
    datePublished: post.datePublished,
    author: {
      "@type": "Person",
      name: "Jo Wolff",
      url: "https://jdwolff.com",
    },
    publisher: {
      "@type": "Person",
      name: "Jo Wolff",
      url: "https://jdwolff.com",
    },
    url: `https://jdwolff.com/writing/${slug}`,
  };

  return (
    <PageLayout eyebrow={post.eyebrow} title={post.title} intro={post.desc}>
      <JsonLd data={articleSchema} />
      <article className={styles.article}>
        <Content />
      </article>
    </PageLayout>
  );
}
