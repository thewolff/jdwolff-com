import PageLayout from "@/app/components/PageLayout/PageLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Jo Wolff",
};

export default function About() {
  return (
    <PageLayout
      eyebrow="About"
      title="English major. Self-taught engineer. Fifteen years in."
      intro="The longer version of the thing on my résumé."
    >
      {/* Content coming soon */}
    </PageLayout>
  );
}
