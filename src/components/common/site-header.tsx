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

      <div className="font-mono text-[10px] tracking-[0.35em] text-white/55 sm:text-xs">
        R<span className="text-neon-pink">*</span>
        <span className="mx-3 text-white/20">/</span>
        2026
      </div>
    </header>
  );
}
