import PageLayout from "@/app/components/PageLayout/PageLayout";
import { notFound } from "next/navigation";

const projects: Record<string, { title: string; client: string }> = {
  meridian: { title: "Meridian", client: "Amazon" },
  dodgers: { title: "Digital Trading Room", client: "LA Dodgers" },
};

export default async function WorkPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects[slug];
  if (!project) notFound();

  return (
    <PageLayout eyebrow={project.client} title={project.title}>
      {/* Case study content coming soon */}
    </PageLayout>
  );
}
