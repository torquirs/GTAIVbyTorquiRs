"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import type { TimeLeft } from "@/types/countdown";

const releaseTimestamp = new Date(siteConfig.releaseDate).getTime();

const units: { readonly key: keyof TimeLeft; readonly label: string }[] = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
];

/**
 * Calculates the time remaining until the configured release date.
 */
function getTimeLeft(): TimeLeft {
  const distance = Math.max(0, releaseTimestamp - Date.now());
  const days = Math.floor(distance / 86_400_000);
  const hours = Math.floor((distance % 86_400_000) / 3_600_000);
  const minutes = Math.floor((distance % 3_600_000) / 60_000);
  const seconds = Math.floor((distance % 60_000) / 1_000);

  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

/**
 * Displays a client-updated countdown to the configured release date.
 */
export function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const update = () => setTimeLeft(getTimeLeft());

    update();
    const intervalId = window.setInterval(update, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div
      aria-label={`${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes and ${timeLeft.seconds} seconds until release`}
      className="mt-7 grid max-w-[470px] grid-cols-4 gap-3 sm:gap-5"
      role="timer"
    >
      {units.map(({ key, label }) => (
        <div className="min-w-0" key={key}>
          <span
            aria-hidden="true"
            className="display-type block text-[clamp(2.2rem,5.2vw,4rem)] leading-[0.9] tracking-[-0.04em] tabular-nums text-paper"
          >
            {timeLeft[key]}
          </span>
          <span className="mt-2 block text-[8px] uppercase tracking-[0.3em] text-white/45 sm:text-[9px]">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
