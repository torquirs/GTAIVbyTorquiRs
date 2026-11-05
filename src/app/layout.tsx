import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { BackgroundMusic } from "@/components/common/background-music";
import { ParticlesBackground } from "@/components/common/particles-background";
import { IntroLoader } from "@/components/features/intro/intro-loader";
import { siteMetadata } from "@/config/metadata";
import { siteConfig } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = siteMetadata;

/**
 * Root document layout shared by every App Router page.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={siteConfig.language} className="min-h-full antialiased">
      <body className="flex min-h-screen flex-col">
        <ParticlesBackground />
        <div className="relative z-10 flex min-h-screen flex-col">
          {children}
        </div>
        <BackgroundMusic />
        <IntroLoader />
        <Analytics />
      </body>
    </html>
  );
}
