"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

/**
 * Site-wide brand header.
 */
export function SiteHeader() {
  return (
    <header className="relative z-10 mx-auto flex w-full max-w-site items-center justify-between px-gutter py-5 sm:px-8 lg:px-14 lg:py-8">
      <motion.div
        animate={{ rotateY: [0, 360] }}
        className="grid size-10 shrink-0 place-items-center sm:size-11"
        style={{ perspective: 1000 }}
        transition={{
          rotateY: { repeat: Infinity, duration: 6, ease: "linear" },
        }}
      >
        <Image
          alt="Grand Theft Auto VI"
          className="h-auto w-8"
          height={381}
          src="/images/gta-vi-header-logo.png"
          unoptimized
          width={602}
        />
      </motion.div>

      <nav aria-label="Primary navigation" className="ml-auto md:ml-6">
        <Link
          className="group inline-flex items-center gap-2 py-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-white/65 transition-colors hover:text-white sm:text-[10px]"
          href="/games"
        >
          Games
          <span
            aria-hidden="true"
            className="h-px w-4 bg-sky-400 transition-all group-hover:w-7 group-hover:bg-sky-200"
          />
        </Link>
      </nav>

      <Image
        alt="TorquiRS"
        className="absolute left-1/2 mt-4 h-auto w-20 -translate-x-1/2 sm:mt-5 sm:w-24 md:static md:ml-auto md:mt-0 md:w-28 md:translate-x-0"
        height={368}
        src="/images/torquirs-logo-header.png"
        unoptimized
        width={438}
      />
    </header>
  );
}
