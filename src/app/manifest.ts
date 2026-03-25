import type { MetadataRoute } from "next";
import { siteConfig } from "@/app/lib/siteConfig";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.title,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0f0e0d",
    theme_color: "#0f0e0d",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "256x256",
        type: "image/x-icon",
      },
    ],
  };
}
