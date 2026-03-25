import type { ComponentType } from "react";
import PageLayout from "@/app/components/PageLayout/PageLayout";
import styles from "./page.module.css";
import { notFound } from "next/navigation";
import Meridian from "./content/Meridian";
import Dodgers from "./content/Dodgers";

const projects: Record<
  string,
  { title: string; client: string; component: React.ComponentType }
> = {
  meridian: { title: "Meridian", client: "Amazon", component: Meridian },
  dodgers: {
    title: "Digital Trading Room",
    client: "LA Dodgers",
    component: Dodgers,
  },
};

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
    <PageLayout eyebrow={project.client} title={project.title}>
      <article className={styles.article}>
        <Content />
      </article>
    </PageLayout>
  );
}
