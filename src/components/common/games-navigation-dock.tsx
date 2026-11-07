"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { House } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type HoverSound = "home" | "home-select" | "brand" | "settings";

const HOVER_TONES = {
  home: { start: 520, end: 760, duration: 0.075, type: "sine" },
  "home-select": {
    start: 740,
    end: 520,
    duration: 0.09,
    type: "triangle",
  },
  brand: { start: 880, end: 1320, duration: 0.12, type: "sine" },
  settings: { start: 420, end: 320, duration: 0.055, type: "triangle" },
} as const;

interface AudioContextWindow extends Window {
  webkitAudioContext?: typeof AudioContext;
}

async function playHoverSound(
  contextRef: { current: AudioContext | null },
  sound: HoverSound,
) {
  if (typeof window === "undefined") {
    return;
  }

  const AudioContextConstructor =
    window.AudioContext ?? (window as AudioContextWindow).webkitAudioContext;

  if (!AudioContextConstructor) {
    return;
  }

  try {
    const context =
      contextRef.current ??
      (contextRef.current = new AudioContextConstructor());

    if (context.state === "suspended") {
      await context.resume();
    }

    if (context.state !== "running") {
      return;
    }

    const tone = HOVER_TONES[sound];
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;

    oscillator.type = tone.type;
    oscillator.frequency.setValueAtTime(tone.start, now);
    oscillator.frequency.exponentialRampToValueAtTime(
      tone.end,
      now + tone.duration,
    );
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.07, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + tone.duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.addEventListener(
      "ended",
      () => {
        oscillator.disconnect();
        gain.disconnect();
      },
      { once: true },
    );
    oscillator.start(now);
    oscillator.stop(now + tone.duration);
  } catch (error) {
    if (
      error instanceof DOMException &&
      ["InvalidStateError", "NotAllowedError"].includes(error.name)
    ) {
      return;
    }

    console.error("Could not play the navigation hover sound.", error);
  }
}

/**
 * Floating navigation for the immersive Games route.
 */
export function GamesNavigationDock() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<
    "home" | "games" | "controller" | null
  >(null);
  const shouldReduceMotion = useReducedMotion();
  const audioContextRef = useRef<AudioContext | null>(null);
  const pathname = usePathname();
  const isHomeActive = pathname === "/";
  const [selectedItem, setSelectedItem] = useState<"games" | "controller">(
    () => (pathname === "/games" ? "controller" : "games"),
  );
  const focusedItem = hoveredItem ?? selectedItem;
  const isGamesFocused = focusedItem === "games";
  const isControllerFocused = focusedItem === "controller";

  const tapAnimation = shouldReduceMotion ? undefined : { scale: 0.96 };
  const hoverAnimation = shouldReduceMotion
    ? undefined
    : { scale: 1.04, y: -2 };

  useEffect(
    () => () => {
      const context = audioContextRef.current;
      audioContextRef.current = null;

      if (context && context.state !== "closed") {
        void context.close().catch((error: unknown) => {
          if (error instanceof DOMException && error.name === "InvalidStateError") {
            return;
          }

          console.error("Could not close the navigation audio context.", error);
        });
      }
    },
    [],
  );

  return (
    <nav
      aria-label="Games navigation"
      className="pointer-events-auto fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+1.5rem)] z-50 mx-auto w-fit px-4"
    >
      <div className="relative flex items-end gap-4 sm:gap-5">
        <motion.div
          tabIndex={-1}
          whileHover={hoverAnimation}
          whileTap={tapAnimation}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <Link
            aria-current={isHomeActive ? "page" : undefined}
            aria-label="Home"
            className={`relative grid size-14 cursor-pointer place-items-center rounded-full border bg-[#11131b]/75 shadow-[0_8px_30px_rgba(0,0,0,0.38)] outline-none backdrop-blur-md transition-[color,border-color,background-color,filter,transform] duration-150 ease-out focus-visible:drop-shadow-[0_0_8px_rgba(255,255,255,0.7)] sm:size-16 ${
              isHomeActive
                ? "border-cyan-200/35 text-cyan-100 drop-shadow-[0_0_8px_rgba(103,232,249,0.35)]"
                : "border-white/15 text-white/65 hover:border-white/30 hover:bg-[#181b25]/85 hover:text-white"
            }`}
            href="/"
            onClick={() => {
              if (pathname !== "/") {
                void playHoverSound(audioContextRef, "home-select");
              }
            }}
            onMouseEnter={() => {
              setHoveredItem("home");
              void playHoverSound(audioContextRef, "home");
            }}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <House
              aria-hidden="true"
              className="relative z-10"
              size={22}
              strokeWidth={1.7}
            />
          </Link>
        </motion.div>

        <motion.div
          className="relative -translate-y-3 flex size-16 shrink-0 items-center justify-center sm:size-[4.5rem]"
          onMouseEnter={() => setHoveredItem("games")}
          onMouseLeave={() => setHoveredItem(null)}
          tabIndex={-1}
          whileHover={hoverAnimation}
          whileTap={tapAnimation}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <motion.span
            aria-hidden="true"
            animate={
              !isGamesFocused
                ? { opacity: 0, scale: 0.95 }
                : shouldReduceMotion
                  ? { opacity: 0.22, scale: 1 }
                  : { opacity: [0.14, 0.24, 0.14], scale: [0.98, 1.04, 0.98] }
            }
            className="pointer-events-none absolute -inset-4 rounded-full bg-[rgba(255,85,0,0.15)] blur-xl shadow-[0_0_24px_rgba(255,85,0,0.2)]"
            transition={{
              duration: shouldReduceMotion ? 0 : 2.4,
              ease: "easeInOut",
              repeat: isGamesFocused && !shouldReduceMotion ? Infinity : 0,
            }}
          />
          <button
            aria-current={pathname === "/games" ? "page" : undefined}
            aria-label="Games"
            aria-pressed={isGamesFocused}
            className={`relative grid size-16 cursor-pointer place-items-center rounded-full border bg-[#10141e]/85 shadow-[0_8px_34px_rgba(0,0,0,0.45)] outline-none backdrop-blur-md transition-[border-color,background-color,filter,transform] duration-150 ease-out focus-visible:drop-shadow-[0_0_10px_rgba(253,186,116,0.8)] sm:size-[4.5rem] ${
              isGamesFocused
                ? "scale-105 border-orange-200/35"
                : "scale-100 border-white/15"
            }`}
            onClick={() => {
              setSelectedItem("games");
              setSettingsOpen(false);
            }}
            onMouseEnter={() => void playHoverSound(audioContextRef, "brand")}
            type="button"
          >
            <motion.span
              animate={
                shouldReduceMotion ? undefined : { scale: [1, 1.08, 1] }
              }
              className="relative z-10 flex h-full w-full items-center justify-center"
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut",
              }}
            >
              <Image
                alt="TorquiRS"
                className="h-auto max-h-12 w-12 object-contain sm:w-14"
                height={368}
                src="/images/torquirs-logo-header.png"
                unoptimized
                width={438}
              />
            </motion.span>
          </button>
        </motion.div>

        <motion.div
          className="relative"
          onMouseEnter={() => setHoveredItem("controller")}
          onMouseLeave={() => setHoveredItem(null)}
          tabIndex={-1}
          whileHover={hoverAnimation}
          whileTap={tapAnimation}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <motion.span
            aria-hidden="true"
            animate={
              !isControllerFocused
                ? { opacity: 0, scale: 0.95 }
                : shouldReduceMotion
                  ? { opacity: 0.22, scale: 1 }
                  : { opacity: [0.14, 0.24, 0.14], scale: [0.98, 1.04, 0.98] }
            }
            className="pointer-events-none absolute -inset-4 rounded-full bg-cyan-400/15 blur-xl shadow-[0_0_24px_rgba(34,211,238,0.2)]"
            transition={{
              duration: shouldReduceMotion ? 0 : 2.4,
              ease: "easeInOut",
              repeat: isControllerFocused && !shouldReduceMotion ? Infinity : 0,
            }}
          />
          <button
            aria-label="PlayStation controller, settings coming soon"
            aria-pressed={isControllerFocused}
            className={`relative grid size-14 cursor-pointer place-items-center rounded-full border bg-[#11131b]/75 shadow-[0_8px_30px_rgba(0,0,0,0.38)] outline-none backdrop-blur-md transition-[color,border-color,background-color,filter,transform] duration-150 ease-out focus-visible:drop-shadow-[0_0_8px_rgba(255,255,255,0.7)] sm:size-16 ${
              isControllerFocused
                ? "scale-105 border-cyan-200/35 text-cyan-100 drop-shadow-[0_0_8px_rgba(103,232,249,0.35)]"
                : "border-white/15 text-white/65 hover:border-white/30 hover:bg-[#181b25]/85 hover:text-white"
            }`}
            onClick={() => {
              setSelectedItem("controller");
              setSettingsOpen((isOpen) => !isOpen);
            }}
            onMouseEnter={() =>
              void playHoverSound(audioContextRef, "settings")
            }
            type="button"
          >
            <motion.span
              animate={
                shouldReduceMotion ? undefined : { scale: [1, 1.08, 1] }
              }
              className="relative z-10 flex size-10 items-center justify-center sm:size-12"
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut",
              }}
            >
              <Image
                alt="PS5 controller"
                className="h-full w-full rotate-12 object-contain"
                height={384}
                src="/images/ps5.png"
                unoptimized
                width={624}
              />
            </motion.span>
          </button>
        </motion.div>

        <AnimatePresence>
          {settingsOpen && (
            <motion.span
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-full left-1/2 mb-3 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-[#11131b]/85 px-3 py-1.5 text-[10px] font-medium tracking-wide text-white/75 shadow-lg backdrop-blur-xl"
              exit={{ opacity: 0, y: 4 }}
              initial={{ opacity: 0, y: 4 }}
              role="status"
              transition={{
                duration: shouldReduceMotion ? 0 : 0.15,
                ease: "easeOut",
              }}
            >
              Settings coming soon
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
