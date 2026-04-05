/**
 * A single slide in the Carousel.
 */
export interface CarouselSlide {
  /** Unique identifier. */
  id: string | number;
  /** Image URL for the slide. */
  src?: string;
  /** Alt text for the image. */
  alt?: string;
  /** Caption text. */
  caption?: string;
}

/**
 * Props for the Carousel component.
 *
 * An image/content slideshow with navigation controls.
 */
export interface CarouselProps {
  /** Array of slides to display. */
  slides: CarouselSlide[];
  /** When true, shows navigation arrows. @defaultValue `true` */
  showArrows?: boolean;
  /** When true, shows dot indicators. @defaultValue `true` */
  showIndicators?: boolean;
  /** Starting slide index. @defaultValue `0` */
  modelValue?: number;
  /** Additional CSS classes. */
  className?: string;
}
