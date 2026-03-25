import PageLayout from "@/app/components/PageLayout/PageLayout";
import styles from "./page.module.css";
import { notFound } from "next/navigation";

const posts: Record<string, { title: string; desc: string }> = {
  "self-taught": {
    title: "I have no CS degree. Here's what I learned anyway.",
    desc: "On being self-taught, imposter syndrome, and why the English major thing ended up being an advantage.",
  },
  accessibility: {
    title: "Accessibility isn't a checklist. It's a disposition.",
    desc: "What fifteen years of building for everyone taught me about what software is actually for.",
  },
  "design-systems": {
    title: "Design systems are a trust problem, not a component problem.",
    desc: "The technical part is the easy part. The hard part is getting fifty teams to believe in the same foundation.",
  },
};

export default async function WritingPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts[slug];
  if (!post) notFound();

  return (
    <PageLayout eyebrow="Writing" title={post.title} intro={post.desc}>
      <article className={styles.article}>
        {/* Post content coming soon */}
      </article>
    </PageLayout>
  );
}
