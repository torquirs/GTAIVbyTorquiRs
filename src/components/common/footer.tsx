import { siteConfig } from "@/config/site";

const details = [
  "Vice City",
  "Leonida",
  siteConfig.releaseLabel,
  "The wait is almost over",
];

/**
 * Site-wide footer with the animated location marquee.
 */
export function Footer() {
  return (
    <footer
      className="relative mt-auto border-t border-white/10 pb-20 sm:pb-24"
      id="footer"
    >
      <div
        aria-hidden="true"
        className="overflow-hidden border-b border-white/10 py-3"
      >
        <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap text-[8px] font-semibold uppercase tracking-[0.32em] text-white/35 sm:gap-12 sm:text-[9px]">
          {[...details, ...details].map((item, index) => (
            <span className="flex items-center gap-8 sm:gap-12" key={`${item}-${index}`}>
              {item}
              <span className="size-1 bg-neon-pink" />
            </span>
          ))}
        </div>
      </div>
      <div className="mx-auto flex max-w-site flex-col gap-3 px-gutter py-5 text-[8px] uppercase tracking-[0.22em] text-white/35 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-14">
        <span>Grand Theft Auto VI · Release countdown</span>
        <span>Fan-made design concept · 2026</span>
      </div>
    </footer>
  );
}
