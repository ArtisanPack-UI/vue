import type { ProgressColor } from '../Progress/types';

/** The parts of a ProgressRadial that accept extra classes. */
export type ProgressRadialPart = 'root' | 'svg' | 'track' | 'bar' | 'value' | 'label';

/**
 * Props for the ProgressRadial component (design-system manifest
 * `ProgressRadial`, #60).
 *
 * Circular progress with the value in the center. The root is the
 * `role="progressbar"`; without a `label`, name it with `aria-label`.
 * `class` and every other attribute go to the root.
 */
export interface ProgressRadialProps {
  /** The progress, from 0 to `max`. Clamped. @defaultValue `0` */
  value?: number;
  /**
   * The design system's Vue spelling of `value` (`v-model`), used when
   * `value` isn't set. Prefer `value`.
   */
  modelValue?: number;
  /** The value at completion. @defaultValue `100` */
  max?: number;
  /** The amount isn't known: a quarter arc spins, and `aria-valuenow` is left out. @defaultValue `false` */
  indeterminate?: boolean;
  /** The ring's diameter in px. @defaultValue `64` */
  size?: number;
  /** The ring's stroke width in px. @defaultValue `6` */
  thickness?: number;
  /** The bar's color. @defaultValue `'primary'` */
  color?: ProgressColor;
  /** A caption under the value that also names the progressbar. */
  label?: string;
  /** The value in words, shown in the center and read as `aria-valuetext`. */
  valueText?: string;
  /** Leaves the center empty, for small rings. @defaultValue `false` */
  hideValue?: boolean;
  /** Extra classes per part, such as `{ value: '…', bar: '…' }`. */
  classes?: Partial<Record<ProgressRadialPart, string>>;
}
