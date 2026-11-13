/** The parts of a Textarea that accept extra classes. */
export type TextareaPart =
  | 'root'
  | 'label'
  | 'required'
  | 'box'
  | 'control'
  | 'count'
  | 'hint'
  | 'error';

/**
 * Props for the Textarea component (design-system manifest `Textarea`, #53).
 *
 * Bind the value with `v-model`. `class` goes to the root; every other
 * attribute (`name`, `id`, `aria-*`, listeners) goes to the native
 * `<textarea>`.
 */
export interface TextareaProps {
  /** Visible lines of text. With `autoResize`, the minimum. @defaultValue `4` */
  rows?: number;
  /** The most characters allowed. Sets `maxlength` and shows the counter. */
  maxLength?: number;
  /** Grows the box with its content (CSS `field-sizing`). @defaultValue `false` */
  autoResize?: boolean;
  /** The visible label, linked to the control. Without it, pass an `aria-label`. */
  label?: string;
  /** Help text under the box, linked with `aria-describedby`. */
  hint?: string;
  /** Validation message. Marks the field invalid and is linked with `aria-describedby`. */
  error?: string;
  /** Marks the field invalid without a message. @defaultValue `false` */
  invalid?: boolean;
  /** Disables the control. @defaultValue `false` */
  disabled?: boolean;
  /** Makes the control read-only. It stays focusable. @defaultValue `false` */
  readonly?: boolean;
  /** Marks the field required and shows the required mark. @defaultValue `false` */
  required?: boolean;
  /** Placeholder text. Never a replacement for the label. */
  placeholder?: string;
  /** The value, bound with `v-model`. */
  modelValue?: string;
  /**
   * The counter's announcement near the limit; `{count}` is replaced with the
   * characters left. Pass a translated string. @defaultValue `'Characters left: {count}'`
   */
  remainingLabel?: string;
  /** Extra classes per part, such as `{ label: '…', control: '…' }`. */
  classes?: Partial<Record<TextareaPart, string>>;
}

/** The events of the Textarea component. */
export interface TextareaEmits {
  /** The value changed. */
  'update:modelValue': [value: string];
}
