import type { Metadata } from "next";
import { Footer } from "@/components/common/footer";
import { SiteHeader } from "@/components/common/site-header";
import { Hero } from "@/components/features/landing/hero";
import { homeMetadata } from "@/config/metadata";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = homeMetadata;

const siteUrl = siteConfig.url.toString();
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}#organization`,
      name: siteConfig.name,
      url: siteUrl,
      logo: new URL("/images/torquirs-logo.png", siteConfig.url).toString(),
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}#website`,
      name: siteConfig.name,
      url: siteUrl,
      description: siteConfig.description,
      inLanguage: siteConfig.language,
      publisher: { "@id": `${siteUrl}#organization` },
    },
    {
      "@type": "WebPage",
      "@id": siteUrl,
      name: siteConfig.title,
      description: siteConfig.description,
      url: siteUrl,
      inLanguage: siteConfig.language,
      isPartOf: { "@id": `${siteUrl}#website` },
      publisher: { "@id": `${siteUrl}#organization` },
    },
  ],
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
