import type { GalleryImageGroup, GallerySlide } from "@/types/gallery";

const imageGroups: readonly GalleryImageGroup[] = [
  { filePrefix: "Brian_Heder", name: "Brian Heder", count: 4 },
  { filePrefix: "Jason_and_Lucia", name: "Jason & Lucia", count: 13 },
  { filePrefix: "Jason_Duval", name: "Jason Duval", count: 10 },
];

/**
 * Builds the ordered gallery manifest for the local images in public/images.
 */
function createGallerySlides(
  groups: readonly GalleryImageGroup[],
): readonly GallerySlide[] {
  return groups.flatMap(({ filePrefix, name, count }) =>
    Array.from({ length: count }, (_, index) => {
      const number = String(index + 1).padStart(2, "0");

      return {
        name,
        image: `/images/${filePrefix}_${number}.jpg`,
      };
    }),
  );
}

export const gallerySlides = createGallerySlides(imageGroups);
