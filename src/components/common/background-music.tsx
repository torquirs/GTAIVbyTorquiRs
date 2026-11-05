"use client";

import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

const MUSIC_FILENAME = "GTA 6 - Official Main Theme Music(MP3_160K).mp3";
const MUSIC_SOURCE = `/audio/${MUSIC_FILENAME.replace(/ /g, "%20")}`;

/**
 * Fixed, user-controlled background music player for the entire application.
 */
export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const togglePlayback = async () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (!audio.paused) {
      audio.pause();
      return;
    }

    try {
      await audio.play();
      setStatusMessage("");
    } catch {
      setIsPlaying(false);
      setStatusMessage(
        "Playback could not start. Check the audio file and try again.",
      );
    }
  };

  return (
    <aside className="fixed bottom-5 right-5 z-50 flex max-w-[calc(100vw-2.5rem)] flex-col items-end gap-2 sm:bottom-7 sm:right-7">
      <audio
        ref={audioRef}
        loop
        preload="none"
        src={MUSIC_SOURCE}
        onError={() => {
          setIsPlaying(false);
          setStatusMessage(
            "The background audio could not be loaded. Check the file in public/audio.",
          );
        }}
        onCanPlay={() => setStatusMessage("")}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
      {statusMessage && (
        <p
          aria-live="polite"
          className="max-w-64 rounded-panel border border-white/10 bg-ink/90 px-3 py-2 text-right text-xs text-paper shadow-lg backdrop-blur-md"
          role="status"
        >
          {statusMessage}
        </p>
      )}
      <Button
        aria-label={isPlaying ? "Pause background music" : "Play background music"}
        aria-pressed={isPlaying}
        className="size-12 rounded-full border border-white/15 bg-ink/75 shadow-lg shadow-black/30 backdrop-blur-md sm:size-14"
        onClick={() => void togglePlayback()}
      >
        {isPlaying ? (
          <Volume2 aria-hidden="true" size={20} />
        ) : (
          <VolumeX aria-hidden="true" size={20} />
        )}
      </Button>
    </aside>
  );
}
