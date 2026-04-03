/**
 * Props for the Skeleton component.
 *
 * A placeholder loading animation used to indicate that content is being loaded.
 */
export interface SkeletonProps {
  /** Width of the skeleton as a CSS value (e.g. `"200px"`, `"100%"`). */
  width?: string;
  /** Height of the skeleton as a CSS value (e.g. `"1rem"`, `"40px"`). */
  height?: string;
  /** When `true`, renders the skeleton as a circle. @defaultValue `false` */
  circle?: boolean;
  /** Additional CSS classes. */
  className?: string;
}
