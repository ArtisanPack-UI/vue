/**
 * One slide of a Carousel: the default Card's content, or anything the
 * `#slide` slot draws. The 2.x `src` and `caption` keys still work as
 * `image` and `title`.
 */
export interface CarouselSlide {
  /**
   * A stable id. When every slide has a distinct one it keys the slide, so a
   * reordered list keeps each `#slide` slot's own state; else slides are
   * keyed by position.
   */
  id?: string | number;
  /** The Card's image URL. */
  image?: string;
  /** Describes the image. */
  alt?: string;
  /** The Card's title. */
  title?: string;
  /** The Card's supporting text. */
  description?: string;
  /** Links the Card's title. */
  href?: string;
  [key: string]: unknown;
}

/** The parts a Carousel accepts extra classes for. */
export type CarouselPart =
  | 'root'
  | 'header'
  | 'title'
  | 'viewport'
  | 'itemGroup'
  | 'item'
  | 'prevTrigger'
  | 'nextTrigger'
  | 'indicatorGroup'
  | 'indicator'
  | 'autoplayTrigger';

/**
 * Props for the Carousel component (#65): scroll-snapped slides with
 * previous and next buttons and position dots, on the carousel machine.
 */
export interface CarouselProps {
  /** The slides, in order. */
  slides: CarouselSlide[];
  /** Slides in view at once, a whole number; above 1 the next one peeks. @defaultValue `1` */
  perView?: number;
  /** The position shown, 0-based. Pair it with `index-change` to control it. @defaultValue `0` */
  index?: number;
  /** Wraps from the last position to the first and back. @defaultValue `false` */
  loop?: boolean;
  /** Advances every `interval` ms, with a pause button. @defaultValue `false` */
  autoplay?: boolean;
  /** Milliseconds between slides while autoplay runs. @defaultValue `5000` */
  interval?: number;
  /** A heading in the header, with the buttons beside it. Without it they overlay the slides. */
  title?: string;
  /** The title's heading level, 2 to 6. @defaultValue `3` */
  headingLevel?: number;
  /** Names the region. Defaults to a passed `aria-label`, then the title, else `'Carousel'`. */
  label?: string;
  /** The previous button's accessible name. @defaultValue `'Previous slide'` */
  previousLabel?: string;
  /** The next button's accessible name. @defaultValue `'Next slide'` */
  nextLabel?: string;
  /** A dot's accessible name; `{index}` is replaced. @defaultValue `'Go to slide {index}'` */
  indicatorLabel?: string;
  /** A slide's accessible name. @defaultValue `'{index} of {count}'` */
  slideLabel?: string;
  /** The autoplay button's name while paused. @defaultValue `'Start slide rotation'` */
  playLabel?: string;
  /** The autoplay button's name while playing. @defaultValue `'Stop slide rotation'` */
  pauseLabel?: string;
  /** Extra classes per part. */
  classes?: Partial<Record<CarouselPart, string>>;
}
