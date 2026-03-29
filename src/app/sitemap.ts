import { siteConfig } from "./lib/siteConfig";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date("2026-03-26"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/work`,
      lastModified: new Date("2026-03-25"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/work/meridian`,
      lastModified: new Date("2026-03-25"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/work/dodgers`,
      lastModified: new Date("2026-03-25"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/work/onechat`,
      lastModified: new Date("2026-03-25"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/writing`,
      lastModified: new Date("2026-03-25"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/writing/self-taught`,
      lastModified: new Date("2026-03-25"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/writing/accessibility`,
      lastModified: new Date("2026-03-25"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/writing/design-systems`,
      lastModified: new Date("2026-03-25"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: new Date("2026-03-25"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/contact`,
      lastModified: new Date("2026-03-25"),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.url}/accessibility`,
      lastModified: new Date("2026-03-25"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
