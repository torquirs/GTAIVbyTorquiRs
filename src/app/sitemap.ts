import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/**
 * Publishes the canonical landing page for search engine discovery.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url.toString(),
      changeFrequency: "weekly",
      priority: 1,
      images: [new URL(siteConfig.socialImage, siteConfig.url).toString()],
    },
  ];
}
