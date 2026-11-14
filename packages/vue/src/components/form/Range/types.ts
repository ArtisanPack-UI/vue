/** Thumb size of a Range. Emitted as `data-size`. */
export type RangeSize = 'sm' | 'md';

/** The fill color of a Range. Emitted as `data-color`. */
export type RangeColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/** When the value bubble shows. Emitted as `data-show-value`. */
export type RangeShowValue = 'never' | 'focus' | 'always';

/** A label under the track, placed at its value. */
export interface RangeMark {
  value: number;
  label: string;
}

/** A Range's value: one number, or `[from, to]` with `dual`. */
export type RangeValue = number | [number, number];

/** The parts of a Range that accept extra classes. */
export type RangePart =
  | 'root'
  | 'label'
  | 'track'
  | 'fill'
  | 'control'
  | 'thumb'
  | 'bubble'
  | 'marks'
  | 'mark'
  | 'hint'
  | 'error';

/**
 * Props for the Range component (design-system manifest `Range`, #53).
 *
 * Each thumb is a native `<input type="range">`. Bind the value with
 * `v-model`: a number, or `[from, to]` with `dual`. `class` goes to the root;
 * every other attribute goes to the native input (both with `dual`).
 */
export interface RangeProps {
  /** The lowest value. @defaultValue `0` */
  min?: number;
  /** The highest value. @defaultValue `100` */
  max?: number;
  /** The step between values. @defaultValue `1` */
  step?: number;
  /** The value, bound with `v-model`: a number, or `[from, to]` with `dual`. */
  modelValue?: RangeValue;
  /** Two thumbs for a from–to range; they can't cross. @defaultValue `false` */
  dual?: boolean;
  /** When the value bubble shows. @defaultValue `'focus'` */
  showValue?: RangeShowValue;
  /** How a value reads in the bubble and `aria-valuetext`: `{value}` is the number, such as `{value} km`. */
  format?: string;
  /** Labels under the track, placed at their values. */
  marks?: RangeMark[];
  /** The fill and thumb edge. @defaultValue `'primary'` */
  color?: RangeColor;
  /** Thumb size. @defaultValue `'md'` */
  size?: RangeSize;
  /** The visible label, linked to the (first) thumb. */
  label?: string;
  /** Help text under the track, linked with `aria-describedby`. */
  hint?: string;
  /** Validation message. Marks the field invalid and is linked with `aria-describedby`. */
  error?: string;
  /** Marks the field invalid without a message. @defaultValue `false` */
  invalid?: boolean;
  /** Disables the thumbs. @defaultValue `false` */
  disabled?: boolean;
  /** With `dual`, the names added to the label for each thumb. @defaultValue `{ start: 'Minimum', end: 'Maximum' }` */
  thumbLabels?: Partial<{ start: string; end: string }>;
  /** Extra classes per part, such as `{ track: '…', thumb: '…' }`. */
  classes?: Partial<Record<RangePart, string>>;
}

/** The events of the Range component. */
export interface RangeEmits {
  /** The value changed: a number, or `[from, to]` with `dual`. */
  'update:modelValue': [value: RangeValue];
}
