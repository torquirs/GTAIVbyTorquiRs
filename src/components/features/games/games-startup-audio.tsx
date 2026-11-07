"use client";

import { useEffect, useRef } from "react";

export const GAMES_WELCOME_START_EVENT = "games:welcome-start";

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

    let active = true;
    let playbackPending = false;
    let playbackStarted = false;

    const startPlayback = () => {
      if (!active || playbackPending || playbackStarted) {
        return;
      }

      playbackPending = true;
      audio.volume = 0.35;
      audio.currentTime = 0;

      void audio.play().then(
        () => {
          if (active) {
            playbackStarted = true;
            playbackPending = false;
          }
        },
        () => {
          playbackPending = false;
        },
      );
    };

    startPlayback();
    window.addEventListener(GAMES_WELCOME_START_EVENT, startPlayback);

    return () => {
      active = false;
      window.removeEventListener(GAMES_WELCOME_START_EVENT, startPlayback);
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return <audio loop={false} preload="auto" ref={audioRef} src={STARTUP_SOUND} />;
}
