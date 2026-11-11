/** Control height of an Input. Emitted as `data-size`. */
export type InputSize = 'sm' | 'md' | 'lg';

/** The parts of an Input that accept extra classes. */
export type InputPart =
  | 'root'
  | 'label'
  | 'required'
  | 'box'
  | 'icon'
  | 'prefix'
  | 'control'
  | 'suffix'
  | 'iconEnd'
  | 'hint'
  | 'error';

/**
 * Props for the Input component (design-system manifest `Input`, #45).
 *
 * Bind the value with `v-model`. `class` goes to the root; every other
 * attribute (`name`, `autocomplete`, `id`, `aria-*`, listeners) goes to the
 * native `<input>`. The `icon`, `iconEnd`, `prefix` and `suffix` slots
 * override the same-named props.
 */
export interface InputProps {
  /** Control height. @defaultValue `'md'` */
  size?: InputSize;
  /** The native input type, such as `email`, `url`, `search` or `number`. @defaultValue `'text'` */
  type?: string;
  /** The visible label, linked to the control. Without it, pass an `aria-label`. */
  label?: string;
  /** Help text under the control, linked with `aria-describedby`. */
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
  /**
   * The value, bound with `v-model`. A number is accepted for display, but
   * `update:modelValue` always emits the input's string value (even for
   * `type="number"`), like the manifest's `value-change` and React. Convert
   * it yourself, such as `@update:model-value="(v) => (count = Number(v))"`.
   */
  modelValue?: string | number;
  /** Text inside the box before the value, such as a currency or `https://`. */
  prefix?: string;
  /** Text inside the box after the value, such as a unit. */
  suffix?: string;
  /** Icon name before the value, resolved through the icon registry. The `icon` slot overrides it. */
  leadingIcon?: string;
  /** Icon name after the value, resolved through the icon registry. The `iconEnd` slot overrides it. */
  trailingIcon?: string;
  /** Extra classes per part, such as `{ label: '…', control: '…' }`. */
  classes?: Partial<Record<InputPart, string>>;
}

/**
 * The events of the Input component. `update:modelValue` carries the native
 * input's string value, so a `v-model` bound to a number ref is a type error
 * rather than silently turning the number into a string.
 */
export interface InputEmits {
  /** The value changed. Always a string, also for `type="number"`. */
  'update:modelValue': [value: string];
}
