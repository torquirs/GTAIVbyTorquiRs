"use client";

import { useEffect, useRef, useState } from "react";

const STARTUP_SOUND =
  "/audio/PlayStation%205%20_PS5%20Startup%20Sound%20(1080p)(MP3_160K).mp3";

/**
 * Plays the Games route startup sound once per visit.
 */
export function GamesStartupAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playbackBlocked, setPlaybackBlocked] = useState(false);
  const [playbackFailed, setPlaybackFailed] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    let isMounted = true;
    audio.volume = 0.35;
    audio.currentTime = 0;

    void audio.play().then(
      () => {
        if (isMounted) {
          setPlaybackBlocked(false);
        }
      },
      (error: unknown) => {
        if (!isMounted) {
          return;
        }

        if (error instanceof DOMException && error.name === "NotAllowedError") {
          setPlaybackBlocked(true);
          return;
        }

        setPlaybackFailed(true);
        console.error("Could not play the Games startup sound.", error);
      },
    );

    return () => {
      isMounted = false;
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const playAfterUserGesture = async () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.currentTime = 0;

    try {
      await audio.play();
      setPlaybackBlocked(false);
      setPlaybackFailed(false);
    } catch (error) {
      setPlaybackBlocked(false);
      setPlaybackFailed(true);
      console.error("Could not play the Games startup sound.", error);
    }
  };

  return (
    <>
      <audio
        onError={() => setPlaybackFailed(true)}
        preload="auto"
        ref={audioRef}
        src={STARTUP_SOUND}
      />
      {playbackBlocked && (
        <button
          className="fixed bottom-[calc(env(safe-area-inset-bottom)+7rem)] left-1/2 z-40 -translate-x-1/2 rounded-full border border-white/15 bg-[#11131b]/85 px-4 py-2 text-xs font-medium text-white/80 shadow-lg backdrop-blur-md transition-colors hover:border-white/30 hover:text-white"
          onClick={() => void playAfterUserGesture()}
          type="button"
        >
          Tap to play startup sound
        </button>
      )}
      {playbackFailed && (
        <p
          aria-live="polite"
          className="fixed bottom-[calc(env(safe-area-inset-bottom)+7rem)] left-1/2 z-40 -translate-x-1/2 rounded-full border border-white/10 bg-[#11131b]/85 px-4 py-2 text-xs text-white/65 shadow-lg backdrop-blur-md"
          role="status"
        >
          Startup sound is unavailable.
        </p>
      )}
    </>
  );
}
