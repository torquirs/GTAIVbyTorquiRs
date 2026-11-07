"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useState } from "react";
import { GamesNavigationDock } from "@/components/common/games-navigation-dock";
import { GamesPlayerProfile } from "@/components/features/games/games-player-profile";
import { GamesStartupAudio } from "@/components/features/games/games-startup-audio";

export function GamesExperience() {
  const [hasProfile, setHasProfile] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const handleProfileReady = useCallback(() => {
    setHasProfile(true);
  }, []);
  const handleProfileDeleted = useCallback(() => {
    setHasProfile(false);
  }, []);

  return (
    <>
      <GamesStartupAudio />
      <GamesPlayerProfile
        onProfileDeleted={handleProfileDeleted}
        onProfileReady={handleProfileReady}
      />
      <AnimatePresence initial={false} mode="sync">
        {hasProfile && (
          <motion.div
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            className="pointer-events-none fixed inset-0 z-50"
            exit={{
              opacity: 0,
              scale: 0.985,
              y: 8,
              filter: "blur(8px)",
            }}
            initial={{
              opacity: 0,
              scale: 0.985,
              y: 8,
              filter: "blur(8px)",
            }}
            key="games-showcase"
            transition={{
              duration: shouldReduceMotion ? 0 : 0.48,
              ease: "easeInOut",
            }}
          >
            <GamesNavigationDock />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
