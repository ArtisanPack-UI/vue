import type { SparklineVariant } from '@artisanpack-ui/behavior';

export type { SparklineVariant };

/** The parts of a Sparkline that accept extra classes. */
export type SparklinePart = 'root' | 'area' | 'line' | 'dot' | 'bar' | 'baseline';

/**
 * Props for the Sparkline component (design-system manifest `Sparkline`,
 * #61). `class` and every other attribute go to the `<svg>`.
 */
export interface SparklineProps {
  /** The values, oldest first. Anything that isn't a finite number is skipped. */
  data: readonly number[];
  /** A line with a dot on the latest value, the same with a fill, or bars. @defaultValue `'line'` */
  variant?: SparklineVariant;
  /** The width in px. @defaultValue `96` */
  width?: number;
  /** The height in px. @defaultValue `28` */
  height?: number;
  /**
   * The accessible label; `{first}`, `{latest}`, `{min}`, `{max}` and
   * `{count}` are filled in. Translate it.
   * @defaultValue `'Trend from {first} to {latest}'`
   */
  label?: string;
  /** Extra classes per part. */
  classes?: Partial<Record<SparklinePart, string>>;
}
