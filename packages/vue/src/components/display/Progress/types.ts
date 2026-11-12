/** The colors a Progress or ProgressRadial bar takes. */
export type ProgressColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/** The parts of a Progress that accept extra classes. */
export type ProgressPart = 'root' | 'head' | 'label' | 'value' | 'track' | 'bar';

/**
 * Props for the Progress component (design-system manifest `Progress`, #60).
 *
 * Linear progress: determinate, indeterminate or segmented. The root is the
 * `role="progressbar"`; without a `label`, name it with `aria-label`.
 * `class` and every other attribute go to the root.
 */
export interface ProgressProps {
  /** The progress, from 0 to `max`. Clamped. @defaultValue `0` */
  value?: number;
  /**
   * The design system's Vue spelling of `value` (`v-model`), used when
   * `value` isn't set. Prefer `value`.
   */
  modelValue?: number;
  /** The value at completion; with `segmented`, the number of segments. @defaultValue `100` */
  max?: number;
  /** The amount isn't known: a short bar slides along the track, and `aria-valuenow` is left out. @defaultValue `false` */
  indeterminate?: boolean;
  /** Splits the track into `max` segments, `value` of them done. @defaultValue `false` */
  segmented?: boolean;
  /** The track's height. @defaultValue `'md'` */
  size?: 'sm' | 'md' | 'lg';
  /** The bar's color. @defaultValue `'primary'` */
  color?: ProgressColor;
  /** What's progressing, shown above the track and naming the progressbar. */
  label?: string;
  /** The value in words, such as `8 of 12`, shown and read as `aria-valuetext`. */
  valueText?: string;
  /** Extra classes per part, such as `{ label: '…', bar: '…' }`. */
  classes?: Partial<Record<ProgressPart, string>>;
}

/** Clamps `value` into `[0, max]`, treating a `max` of 0 or less as 100. @internal */
export function progressRange(
  value: number,
  max: number,
): { value: number; max: number; pct: number } {
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100;
  const safeValue = Math.min(safeMax, Math.max(0, Number.isFinite(value) ? value : 0));
  return { value: safeValue, max: safeMax, pct: Math.round((safeValue / safeMax) * 100) };
}
