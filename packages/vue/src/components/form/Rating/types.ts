/** The parts of a Rating that accept extra classes. */
export type RatingPart = 'root' | 'item' | 'control' | 'star' | 'half' | 'value' | 'count';

/** The star size of a Rating. */
export type RatingSize = 'sm' | 'md' | 'lg';

/**
 * Props for the Rating component (design-system manifest `Rating`, #53).
 *
 * Bind the score with `v-model`. `class` goes to the root; a `name`
 * attribute names every radio (else a generated one).
 */
export interface RatingProps {
  /** The score, bound with `v-model`. Read-only, it rounds to the nearest half star. */
  modelValue?: number | null;
  /** The number of stars. @defaultValue `5` */
  max?: number;
  /** Shows the score instead of collecting it. @defaultValue `false` */
  readonly?: boolean;
  /** Disables the radios. @defaultValue `false` */
  disabled?: boolean;
  /** Star size. @defaultValue `'md'` */
  size?: RatingSize;
  /** The number of reviews, shown after the value. */
  count?: number;
  /** The input's accessible name, such as "Rate the viewing". */
  label?: string;
  /** The text alternative and each radio's name, with `:value` and `:max`. @defaultValue `':value out of :max'` */
  valueLabel?: string;
  /** The count text, with `:count`. Defaults to "(:count reviews)", singular for one. */
  countLabel?: string;
  /** Extra classes per part, such as `{ star: '…' }`. */
  classes?: Partial<Record<RatingPart, string>>;
}
