/**
 * Props for the Skeleton component (design-system manifest `Skeleton`, #60).
 *
 * A placeholder shape, hidden from assistive technology. The container that
 * is loading sets `aria-busy`. `class` and every other attribute go to the root.
 */
export interface SkeletonProps {
  /** A rounded block, a 10px text line or a circle. @defaultValue `'block'` */
  shape?: 'block' | 'text' | 'circle';
  /** A CSS length, or a number of px. */
  width?: string | number;
  /** A CSS length, or a number of px. A text line keeps its own height unless this is set. */
  height?: string | number;
}
