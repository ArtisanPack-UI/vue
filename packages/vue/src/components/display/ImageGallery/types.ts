/** One image in an ImageGallery. */
export interface ImageGalleryImage {
  /** The image's URL. */
  src: string;
  /** Describes the image. Every image needs it; a caption doesn't replace it. */
  alt?: string;
  /** Visible text under the image and in the lightbox's title. */
  caption?: string;
}

/** The parts of an ImageGallery that accept extra classes. */
export type ImageGalleryPart =
  | 'root'
  | 'grid'
  | 'item'
  | 'trigger'
  | 'image'
  | 'caption'
  | 'backdrop'
  | 'positioner'
  | 'content'
  | 'bar'
  | 'title'
  | 'download'
  | 'closeTrigger'
  | 'stage'
  | 'prevTrigger'
  | 'nextTrigger'
  | 'thumbs'
  | 'thumb';

/**
 * Props for the ImageGallery component (design-system manifest `ImageGallery`, #61).
 *
 * A grid of images that opens a lightbox. `class` and every other attribute
 * go to the root.
 */
export interface ImageGalleryProps {
  /** The images, in order. */
  images: ImageGalleryImage[];
  /** How many columns the grid has. @defaultValue `4` */
  columns?: number;
  /** The first image spans two columns and two rows. @defaultValue `false` */
  featured?: boolean;
  /** Each image is a button that opens the lightbox. Off renders plain figures. @defaultValue `true` */
  lightbox?: boolean;
  /**
   * Whether the lightbox is open. Passed (`v-model:open` or `:open`), it's
   * controlled and reports changes through `update:open`. @defaultValue `false`
   */
  open?: boolean;
  /**
   * The image the lightbox shows, 0-based. Passed, it's controlled and
   * reports changes through `index-change`. @defaultValue `0`
   */
  index?: number;
  /** Adds a download link for the image shown to the lightbox's bar. @defaultValue `false` */
  downloadable?: boolean;
  /** Traps focus, locks scroll and hides the rest of the page. @defaultValue `true` */
  modal?: boolean;
  /** Renders the lightbox at the end of the body (Teleport). @defaultValue `true` */
  portal?: boolean;
  /** The close button's accessible name. @defaultValue `'Close'` */
  closeLabel?: string;
  /** The previous button's accessible name. @defaultValue `'Previous photo'` */
  previousLabel?: string;
  /** The next button's accessible name. @defaultValue `'Next photo'` */
  nextLabel?: string;
  /** The download link's accessible name. @defaultValue `'Download'` */
  downloadLabel?: string;
  /** The counter; `{index}` and `{count}` are replaced. @defaultValue `'{index} / {count}'` */
  counterLabel?: string;
  /** Names the thumbnail strip. @defaultValue `'Photos'` */
  thumbsLabel?: string;
  /** Extra classes per part. */
  classes?: Partial<Record<ImageGalleryPart, string>>;
}
