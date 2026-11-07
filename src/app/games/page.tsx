import type { Metadata } from "next";
import { GamesExperience } from "@/components/features/games/games-experience";

export const metadata: Metadata = {
  title: "Games | GTA 6 Torquirs",
  description:
    "Explore the world and characters of Grand Theft Auto VI in the GTA 6 Torquirs games showcase.",
};

/**
 * Dedicated home for the upcoming games showcase.
 */
export default function GamesPage() {
  return (
    <main
      aria-label="Games"
      className="relative isolate flex min-h-svh flex-1 overflow-hidden"
    >
      <GamesExperience />
    </main>
  );
}
