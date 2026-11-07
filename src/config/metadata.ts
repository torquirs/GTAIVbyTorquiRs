import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/**
 * Shared metadata defaults for the site's App Router segments.
 */
export const siteMetadata: Metadata = {
  metadataBase: siteConfig.url,
  title: {
    default: siteConfig.title,
    template: "%s | GTA 6 Torquirs",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [...siteConfig.keywords],
  category: "entertainment",
  alternates: {
    languages: {
      [siteConfig.language]: "/",
    },
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    url: "/",
    images: [
      {
        url: siteConfig.socialImage,
        alt: "GTA 6 Torquirs fan-made countdown featuring Jason and Lucia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.socialImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

/**
 * Metadata specific to the landing page, including its canonical URL.
 */
export const homeMetadata: Metadata = {
  title: {
    absolute: siteConfig.title,
  },
  alternates: {
    canonical: "/",
    languages: {
      [siteConfig.language]: "/",
    },
  },
};
