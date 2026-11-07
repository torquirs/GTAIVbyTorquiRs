"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
  type TransitionEvent,
} from "react";
import { gallerySlides } from "@/config/gallery";
import { useGalleryAutoplay } from "@/hooks/use-gallery-autoplay";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface GalleryState {
  readonly activeIndex: number;
  readonly previousIndex: number | null;
}

/**
 * Renders the local image gallery with autoplay, pause-on-hover, and controls.
 */
export function Gallery() {
  const [{ activeIndex, previousIndex }, setGalleryState] =
    useState<GalleryState>({ activeIndex: 0, previousIndex: null });
  const [isHovered, setIsHovered] = useState(false);
  const [isImageVisible, setIsImageVisible] = useState(true);
  const activeSlide = gallerySlides[activeIndex];

  useEffect(() => {
    if (previousIndex === null) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      setIsImageVisible(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [activeIndex, previousIndex]);

  const changeSlide = useCallback(
    (getNextIndex: (currentIndex: number) => number) => {
      setIsImageVisible(false);
      setGalleryState((current) => {
        const nextIndex = getNextIndex(current.activeIndex);

        return nextIndex === current.activeIndex
          ? current
          : {
              activeIndex: nextIndex,
              previousIndex: current.activeIndex,
            };
      });
    },
    [],
  );

  const advanceSlide = useCallback(() => {
    changeSlide((currentIndex) => (currentIndex + 1) % gallerySlides.length);
  }, [changeSlide]);

  useGalleryAutoplay({
    enabled: !isHovered,
    delayMs: 4500,
    onAdvance: advanceSlide,
  });

  const move = (offset: number) => {
    changeSlide(
      (currentIndex) =>
        (currentIndex + offset + gallerySlides.length) % gallerySlides.length,
    );
  };

  const goTo = (nextIndex: number) => {
    changeSlide(() => nextIndex);
  };

  const finishTransition = (event: TransitionEvent<HTMLImageElement>) => {
    if (event.propertyName !== "opacity") {
      return;
    }

    setGalleryState((current) =>
      current.activeIndex === activeIndex
        ? { ...current, previousIndex: null }
        : current,
    );
  };

  return (
    <div
      aria-label="Vice City scenes"
      className="relative mx-auto w-full max-w-[650px]"
      id="gallery"
    >
      <div className="absolute -bottom-3 -right-3 h-full w-full bg-neon-coral sm:-bottom-4 sm:-right-4" />
      <Card
        className="group aspect-[1.42/1]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {previousIndex !== null && (
          <Image
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
            height={720}
            sizes="(max-width: 1024px) 100vw, 55vw"
            src={gallerySlides[previousIndex].image}
            width={1080}
          />
        )}
        <Image
          key={activeSlide.image}
          alt={`GTA 6 scene featuring ${activeSlide.name}`}
          className={`absolute inset-0 z-10 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
            previousIndex === null || isImageVisible
              ? "opacity-100"
              : "opacity-0"
          }`}
          height={720}
          onTransitionEnd={finishTransition}
          priority={activeIndex === 0}
          sizes="(max-width: 1024px) 100vw, 55vw"
          src={activeSlide.image}
          width={1080}
        />
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#08070c]/90 via-transparent to-black/10" />

        <div className="absolute inset-x-0 top-1/2 z-20 flex -translate-y-1/2 justify-between px-4 sm:px-5">
          <Button
            aria-label="Previous image"
            className="size-11 sm:size-14"
            onClick={() => move(-1)}
          >
            <ArrowLeft aria-hidden="true" size={19} strokeWidth={1.5} />
          </Button>
          <Button
            aria-label="Next image"
            className="size-11 sm:size-14"
            onClick={() => move(1)}
          >
            <ArrowRight aria-hidden="true" size={19} strokeWidth={1.5} />
          </Button>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-4 px-4 pb-4 sm:px-6 sm:pb-5">
          <div className="min-w-0">
            <p
              aria-live="polite"
              className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white sm:text-xs"
            >
              {activeSlide.name}
            </p>
          </div>
        </div>

        <div
          aria-label="Choose a gallery image"
          className="absolute bottom-[4.85rem] left-1/2 z-20 flex max-w-[60%] -translate-x-1/2 gap-1.5 sm:bottom-[5.5rem] sm:gap-2"
        >
          {gallerySlides.map((slide, index) => (
            <button
              aria-current={index === activeIndex}
              aria-label={`Show ${slide.name}`}
              className={`h-1 transition-all duration-300 ${
                index === activeIndex
                  ? "w-7 bg-paper"
                  : "w-1.5 bg-white/40 hover:bg-white/80"
              }`}
              key={slide.image}
              onClick={() => goTo(index)}
              type="button"
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
