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
        className="absolute left-1/2 mt-4 h-auto w-20 -translate-x-1/2 sm:mt-5 sm:w-24 md:static md:ml-auto md:mt-0 md:w-28 md:translate-x-0"
        height={368}
        src="/images/torquirs-logo-header.png"
        unoptimized
        width={438}
      />
    </header>
  );
}
