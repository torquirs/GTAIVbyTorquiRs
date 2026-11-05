import type { Metadata } from "next";
import { Footer } from "@/components/common/footer";
import { SiteHeader } from "@/components/common/site-header";
import { Hero } from "@/components/features/landing/hero";
import { homeMetadata } from "@/config/metadata";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = homeMetadata;

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: siteConfig.title,
  description: siteConfig.description,
  url: new URL("/", siteConfig.url).toString(),
  inLanguage: siteConfig.language,
  isPartOf: {
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url.toString(),
  },
};

/**
 * Fan-made countdown landing page and its JSON-LD WebPage schema.
 */
export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <SiteHeader />
      <main>
        <Hero />
      </main>
      <Footer />
    </>
  );
}
