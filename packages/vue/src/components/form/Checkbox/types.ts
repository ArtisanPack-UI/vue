/** The parts of a Checkbox that accept extra classes. */
export type CheckboxPart =
  | 'root'
  | 'box'
  | 'control'
  | 'indicator'
  | 'label'
  | 'description'
  | 'error';

/**
 * Props for the Checkbox component (design-system manifest `Checkbox`, #47).
 *
 * Bind the state with `v-model:checked`. `class` goes to the root; every
 * other attribute (`name`, `value`, `id`, `aria-*`, listeners) goes to the
 * native `<input type="checkbox">`.
 */
export interface CheckboxProps {
  /** Whether it's checked, bound with `v-model:checked`. Emitted as `data-state`. @defaultValue `false` */
  checked?: boolean;
  /** Shows the mixed state and sets the native `indeterminate` property. Wins over `checked`. @defaultValue `false` */
  indeterminate?: boolean;
  /** The visible label, linked to the control. Without it, pass an `aria-label`. */
  label?: string;
  /** Supporting text under the label, linked with `aria-describedby`. */
  description?: string;
  /** Validation message. Marks it invalid and is linked with `aria-describedby`. */
  error?: string;
  /** Marks it invalid without a message. @defaultValue `false` */
  invalid?: boolean;
  /** Disables the control. @defaultValue `false` */
  disabled?: boolean;
  /** Sets `required` on the control, such as consent to terms. No visual mark. @defaultValue `false` */
  required?: boolean;
  /** Extra classes per part, such as `{ box: '…', label: '…' }`. */
  classes?: Partial<Record<CheckboxPart, string>>;
}
