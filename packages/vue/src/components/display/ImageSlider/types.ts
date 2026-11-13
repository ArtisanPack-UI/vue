/** One slide in an ImageSlider. */
export interface ImageSliderImage {
  /** The image's URL. */
  src: string;
  /** Describes the image. Every image needs it. */
  alt?: string;
  /** The glass caption's title. */
  caption?: string;
  /** The caption's supporting text. */
  description?: string;
}

/** The parts of an ImageSlider that accept extra classes. */
export type ImageSliderPart =
  | 'root'
  | 'viewport'
  | 'itemGroup'
  | 'item'
  | 'image'
  | 'caption'
  | 'title'
  | 'description'
  | 'progressText'
  | 'prevTrigger'
  | 'nextTrigger'
  | 'indicatorGroup'
  | 'indicator'
  | 'autoplayTrigger'
  | 'thumbs'
  | 'thumb';

/**
 * Props for the ImageSlider component (design-system manifest `ImageSlider`, #61).
 *
 * One large image per view on the carousel machine. `class` and every other
 * attribute go to the root.
 */
export interface ImageSliderProps {
  /** The slides, in order. */
  images: ImageSliderImage[];
  /** The frame's aspect ratio, as CSS takes it. @defaultValue `'21 / 9'` */
  aspectRatio?: string;
  /** The slide shown, 0-based. Passed, it's controlled; changes emit `index-change`. @defaultValue `0` */
  index?: number;
  /** Wraps from the last slide to the first. @defaultValue `true` */
  loop?: boolean;
  /** Advances every `interval` ms, with a pause button. @defaultValue `false` */
  autoplay?: boolean;
  /** Milliseconds between slides while autoplay runs. @defaultValue `5000` */
  interval?: number;
  /** Shows a strip of thumbnails under the frame. @defaultValue `false` */
  thumbnails?: boolean;
  /** Names the slider region. @defaultValue `'Photos'` */
  label?: string;
  /** The previous button's accessible name. @defaultValue `'Previous photo'` */
  previousLabel?: string;
  /** The next button's accessible name. @defaultValue `'Next photo'` */
  nextLabel?: string;
  /** A dot's accessible name; `{index}` is replaced. @defaultValue `'Photo {index}'` */
  indicatorLabel?: string;
  /** A slide's accessible name. @defaultValue `'{index} of {count}'` */
  slideLabel?: string;
  /** The counter text. @defaultValue `'{index} / {count}'` */
  counterLabel?: string;
  /** The autoplay button's name while paused. @defaultValue `'Start slide rotation'` */
  playLabel?: string;
  /** The autoplay button's name while playing. @defaultValue `'Stop slide rotation'` */
  pauseLabel?: string;
  /** Extra classes per part. */
  classes?: Partial<Record<ImageSliderPart, string>>;
}
