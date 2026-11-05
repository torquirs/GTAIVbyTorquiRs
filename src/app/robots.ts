import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/**
 * Allows public crawling and points search engines to the generated sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("/sitemap.xml", siteConfig.url).toString(),
  };
}
