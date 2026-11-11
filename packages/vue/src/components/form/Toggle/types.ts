/** Track size of a Toggle. Emitted as `data-size`. */
export type ToggleSize = 'sm' | 'md' | 'lg';

/** The color of an on Toggle. Emitted as `data-color`. */
export type ToggleColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/** The parts of a Toggle that accept extra classes. */
export type TogglePart = 'root' | 'track' | 'control' | 'thumb' | 'label' | 'description' | 'error';

/**
 * Props for the Toggle component (design-system manifest `Toggle`, #53).
 *
 * A switch for settings that take effect immediately: a native checkbox
 * with `role="switch"`. Bind it with `v-model:checked`. `class` goes to the
 * root; every other attribute goes to the native checkbox.
 */
export interface ToggleProps {
  /** Whether it's on, bound with `v-model:checked`. @defaultValue `false` */
  checked?: boolean;
  /** Track size. @defaultValue `'md'` */
  size?: ToggleSize;
  /** The track color when on. @defaultValue `'primary'` */
  color?: ToggleColor;
  /** The visible label. Name the setting, not the state. */
  label?: string;
  /** Supporting text under the label, linked with `aria-describedby`. */
  description?: string;
  /** Validation message. Marks it invalid and is linked with `aria-describedby`. */
  error?: string;
  /** Marks it invalid without a message. @defaultValue `false` */
  invalid?: boolean;
  /** Disables the control. @defaultValue `false` */
  disabled?: boolean;
  /** Sets `required` on the control. @defaultValue `false` */
  required?: boolean;
  /** Extra classes per part, such as `{ track: '…', label: '…' }`. */
  classes?: Partial<Record<TogglePart, string>>;
}

/** The events of the Toggle component. */
export interface ToggleEmits {
  /** It turned on or off. */
  'update:checked': [checked: boolean];
}
