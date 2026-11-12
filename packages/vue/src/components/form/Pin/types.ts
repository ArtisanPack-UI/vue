/** Cell size of a Pin. Emitted as `data-size`. */
export type PinSize = 'sm' | 'md';

/** The characters a Pin allows. */
export type PinType = 'numeric' | 'alphanumeric';

/** The parts of a Pin that accept extra classes. */
export type PinPart =
  | 'root'
  | 'label'
  | 'required'
  | 'cells'
  | 'control'
  | 'cell'
  | 'separator'
  | 'hint'
  | 'error';

/**
 * Props for the Pin component (design-system manifest `Pin`, #53).
 *
 * One native input (`autocomplete="one-time-code"`) drives the cells, so SMS
 * autofill and paste fill the whole code. Bind it with `v-model`; listen for
 * `complete` to submit. `class` goes to the root; every other attribute goes
 * to the input.
 */
export interface PinProps {
  /** The number of cells. @defaultValue `6` */
  length?: number;
  /** The characters allowed; others are dropped as people type or paste. @defaultValue `'numeric'` */
  type?: PinType;
  /** Shows a dot for each character and makes the control a password input. @defaultValue `false` */
  mask?: boolean;
  /** Draws a separator after every `groupSize` cells, such as 3 for a 3 + 3 code. */
  groupSize?: number;
  /** Cell size. @defaultValue `'md'` */
  size?: PinSize;
  /** The visible label, linked to the control. Without it, pass an `aria-label`. */
  label?: string;
  /** Help text under the cells, linked with `aria-describedby`. */
  hint?: string;
  /** Validation message. Marks the code invalid and is linked with `aria-describedby`. */
  error?: string;
  /** Marks the code invalid without a message. @defaultValue `false` */
  invalid?: boolean;
  /** Disables the control. @defaultValue `false` */
  disabled?: boolean;
  /** Marks the code required and shows the required mark. @defaultValue `false` */
  required?: boolean;
  /** The code, bound with `v-model`. */
  modelValue?: string;
  /** Extra classes per part, such as `{ cell: '…', label: '…' }`. */
  classes?: Partial<Record<PinPart, string>>;
}

/** The events of the Pin component. */
export interface PinEmits {
  /** The code changed. */
  'update:modelValue': [value: string];
  /** Every cell is filled. */
  complete: [value: string];
}
