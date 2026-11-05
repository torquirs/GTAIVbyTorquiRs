"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const INTRO_DURATION_MS = 2000;
const FLASH_DURATION_MS = 300;
const FADE_DURATION_MS = 500;
const REDUCED_MOTION_FADE_MS = 100;

/**
 * Displays a brief branded intro, then fades away to reveal the page.
 */
export function IntroLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const fadeDuration = prefersReducedMotion
      ? REDUCED_MOTION_FADE_MS
      : FADE_DURATION_MS;

    const flashTimer = prefersReducedMotion
      ? undefined
      : window.setTimeout(() => {
          setIsFlashing(true);
        }, INTRO_DURATION_MS - FLASH_DURATION_MS);
    const exitTimer = window.setTimeout(() => {
      setIsExiting(true);
    }, INTRO_DURATION_MS);
    const removeTimer = window.setTimeout(() => {
      setIsVisible(false);
    }, INTRO_DURATION_MS + fadeDuration);

    return () => {
      if (flashTimer !== undefined) {
        window.clearTimeout(flashTimer);
      }
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={`intro-screen fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-intro-midnight transition-opacity duration-500 ease-out ${
        isExiting ? "pointer-events-none opacity-0" : "opacity-100"
      } ${isFlashing ? "intro-screen-flashing" : ""}`}
    >
      <div className="intro-logo-glow relative size-20 sm:size-24">
        <Image
          alt=""
          className="relative z-10 size-full object-contain"
          height={60}
          priority
          src="/images/rockstar-mark.png"
          unoptimized
          width={60}
        />
        <span className="intro-logo-sweep pointer-events-none absolute inset-0 z-20" />
      </div>
      <span className="intro-screen-flash pointer-events-none absolute inset-0" />
    </div>
  );
}
