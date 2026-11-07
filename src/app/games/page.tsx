import type { Metadata } from "next";
import { GamesNavigationDock } from "@/components/common/games-navigation-dock";
import { GamesStartupAudio } from "@/components/features/games/games-startup-audio";

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
      <GamesStartupAudio />
      <GamesNavigationDock />
    </main>
  );
}
