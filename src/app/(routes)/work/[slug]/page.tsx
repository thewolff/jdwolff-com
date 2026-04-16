import PageLayout from "@/app/components/PageLayout/PageLayout";
import styles from "./page.module.css";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Meridian from "./content/Meridian";
import Dodgers from "./content/Dodgers";
import OneChat from "./content/OneChat";

const projects: Record<
  string,
  { title: string; client: string; desc: string; component: React.ComponentType }
> = {
  meridian: {
    title: "Meridian",
    client: "Amazon",
    desc: "Founding team member of Amazon's enterprise design system. Built for scale across hundreds of product teams.",
    component: Meridian,
  },
  dodgers: {
    title: "Digital Trading Room",
    client: "LA Dodgers",
    desc: "Award-winning real-time interface for the LA Dodgers. CLIO Award winner, 2015.",
    component: Dodgers,
  },
  onechat: {
    title: "OneChat",
    client: "Airbnb",
    desc: "Full frontend rebuild of Airbnb's internal AI chat — new architecture, design system migration, and an agents workflow from scratch.",
    component: OneChat,
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects[slug];
  if (!project) return {};
  return {
    title: `${project.title} — ${project.client}`,
    description: project.desc,
    alternates: {
      canonical: `/work/${slug}`,
    },
    openGraph: {
      images: [
        {
          url: `/og?eyebrow=${encodeURIComponent(project.client)}&title=${encodeURIComponent(project.title)}`,
        },
      ],
    },
  };
}

export default async function WorkPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects[slug];
  if (!project) notFound();

  const Content = project.component;

  return (
    <PageLayout
      eyebrow={project.client}
      title={project.title}
      viewTransitionName={`work-title-${slug}`}
    >
      <article className={styles.article}>
        <Content />
      </article>
    </PageLayout>
  );
}
