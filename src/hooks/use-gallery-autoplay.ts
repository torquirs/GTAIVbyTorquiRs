"use client";

import { useEffect, useRef } from "react";

export interface GalleryAutoplayOptions {
  readonly enabled: boolean;
  readonly delayMs: number;
  readonly onAdvance: () => void;
}

/**
 * Advances a gallery on an interval and clears the timer when paused or unmounted.
 */
export function useGalleryAutoplay({
  enabled,
  delayMs,
  onAdvance,
}: GalleryAutoplayOptions): void {
  const onAdvanceRef = useRef(onAdvance);

  useEffect(() => {
    onAdvanceRef.current = onAdvance;
  }, [onAdvance]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const intervalId = window.setInterval(() => {
      onAdvanceRef.current();
    }, delayMs);

    return () => window.clearInterval(intervalId);
  }, [delayMs, enabled]);
}
