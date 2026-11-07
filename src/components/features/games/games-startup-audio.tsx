"use client";

import { useEffect, useRef } from "react";

const STARTUP_SOUND =
  "/audio/PlayStation%205%20_PS5%20Startup%20Sound%20(1080p)(MP3_160K).mp3";

/**
 * Plays the Games route startup sound once per visit.
 */
export function GamesStartupAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume = 0.35;
    audio.currentTime = 0;
    void audio.play().catch(() => {});

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return <audio loop={false} preload="auto" ref={audioRef} src={STARTUP_SOUND} />;
}
