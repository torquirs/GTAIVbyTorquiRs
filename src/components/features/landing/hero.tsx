import Image from "next/image";
import { ArrowDownRight } from "lucide-react";
import { Connections } from "@/components/features/connections/connections";
import { Countdown } from "@/components/features/countdown/countdown";
import { Gallery } from "@/components/features/gallery/gallery";
import { siteConfig } from "@/config/site";

/**
 * Landing-page hero section composing the countdown and image gallery features.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative mx-auto flex w-full max-w-site flex-1 items-center px-gutter pb-20 pt-10 sm:px-8 sm:pb-24 sm:pt-12 lg:px-14 lg:py-16"
      id="top"
    >
      <div className="hero-glow pointer-events-none absolute -left-20 top-1/4 h-72 w-2/3 opacity-70" />
      <div className="relative grid w-full items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 xl:gap-20">
        <div className="relative z-[1] order-2 lg:order-1">
          <p className="tracking-label mb-5 text-[9px] font-semibold uppercase text-neon-pink sm:text-[10px]">
            The wait is almost over
          </p>
          <h1 className="mx-auto w-full max-w-[460px]" id="hero-title">
            <Image
              alt="Grand Theft Auto VI (GTA 6) logo for the TorquiRS countdown"
              className="h-auto w-full mix-blend-screen"
              height={225}
              priority
              src="/images/gta-vi-logo.png"
              unoptimized
              width={225}
            />
          </h1>

          <div className="mt-7 flex items-center gap-4 text-[9px] font-mono uppercase tracking-[0.32em] text-white/50 sm:mt-8">
            <span className="h-px w-8 bg-neon-pink" />
            <span>Vice City · Leonida</span>
          </div>

          <div className="mt-8 border-l border-neon-pink/70 pl-4 sm:mt-9">
            <p className="text-sm font-medium tracking-wide text-white/90 sm:text-base">
              Releasing {siteConfig.releaseLabel}
            </p>
            <Countdown />
          </div>

          <a
            className="mt-8 inline-flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.25em] text-white/60 transition-colors hover:text-neon-pink"
            href="https://www.rockstargames.com/VI"
            rel="noopener noreferrer"
            target="_blank"
          >
            Discover the city
            <ArrowDownRight aria-hidden="true" size={15} strokeWidth={1.5} />
          </a>
        </div>

        <div className="relative order-1 px-2 pb-3 pr-3 lg:order-2 lg:px-0 lg:pb-4 lg:pr-4">
          <div className="relative z-10">
            <Connections />
          </div>
          <div className="absolute -right-5 top-6 h-1/2 w-1/2 bg-[#282039]/70 blur-3xl" />
          <Gallery />
        </div>
      </div>
    </section>
  );
}
