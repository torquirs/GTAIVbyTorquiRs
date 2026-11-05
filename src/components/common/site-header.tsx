import Image from "next/image";
import Link from "next/link";

/**
 * Site-wide brand header.
 */
export function SiteHeader() {
  return (
    <header className="relative z-10 mx-auto flex w-full max-w-site items-center justify-between px-gutter py-5 sm:px-8 lg:px-14 lg:py-8">
      <Link
        aria-label="Grand Theft Auto VI countdown home"
        className="group flex items-center gap-3"
        href="#top"
      >
        <span className="grid size-10 place-items-center border border-white/55 text-sm font-black tracking-[-0.15em] transition-colors group-hover:border-neon-pink group-hover:text-neon-pink sm:size-11">
          VI
        </span>
      </Link>

      <Image
        alt="TorquiRS"
        className="h-auto w-24 sm:w-28"
        height={175}
        src="/images/torquirs-logo-header.png"
        unoptimized
        width={306}
      />
    </header>
  );
}
