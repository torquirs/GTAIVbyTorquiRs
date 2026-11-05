export interface GallerySlide {
  readonly name: string;
  readonly image: string;
}

export interface GalleryImageGroup {
  readonly filePrefix: string;
  readonly name: string;
  readonly count: number;
}
