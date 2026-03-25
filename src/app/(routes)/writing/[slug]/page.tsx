import PageLayout from "@/app/components/PageLayout/PageLayout";
import styles from "./page.module.css";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SelfTaught from "./content/SelfTaught";

const posts: Record<
  string,
  {
    title: string;
    desc: string;
    eyebrow?: string;
    component: React.ComponentType;
  }
> = {
  "self-taught": {
    title: "I have no CS degree. Here's what I learned anyway.",
    desc: "On being self-taught, imposter syndrome, and why the English major thing ended up being an advantage.",
    eyebrow: "Writing",
    component: SelfTaught,
  },
  accessibility: {
    title: "Accessibility isn't a checklist. It's a disposition.",
    desc: "What fifteen years of building for everyone taught me about what software is actually for.",
    eyebrow: "Writing",
    component: () => null,
  },
  "design-systems": {
    title: "Design systems are a trust problem, not a component problem.",
    desc: "The technical part is the easy part. The hard part is getting fifty teams to believe in the same foundation.",
    eyebrow: "Writing",
    component: () => null,
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
    openGraph: {
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

  return (
    <PageLayout eyebrow={post.eyebrow} title={post.title} intro={post.desc}>
      <article className={styles.article}>
        <Content />
      </article>
    </PageLayout>
  );
}
