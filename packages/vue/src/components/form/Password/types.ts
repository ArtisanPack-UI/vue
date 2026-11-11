/** Control height of a Password. Emitted as `data-size`. */
export type PasswordSize = 'sm' | 'md' | 'lg';

/** The parts of a Password that accept extra classes. */
export type PasswordPart =
  | 'root'
  | 'label'
  | 'required'
  | 'box'
  | 'icon'
  | 'control'
  | 'reveal'
  | 'strength'
  | 'segment'
  | 'strengthLabel'
  | 'requirements'
  | 'requirement'
  | 'hint'
  | 'error';

/** One requirement: a label, and a regular expression source the value must match. */
export interface PasswordRequirement {
  /** What people read, such as "At least 12 characters". */
  label: string;
  /** A regular expression source, such as `.{12,}` or `\d`. */
  pattern: string;
}

/** Built-in text for the strength meter and the requirement states. */
export interface PasswordLabels {
  strength: string;
  weak: string;
  fair: string;
  good: string;
  strong: string;
  met: string;
  unmet: string;
}

/**
 * Props for the Password component (design-system manifest `Password`, #53).
 *
 * Bind the value with `v-model`. `class` goes to the root; every other
 * attribute (`name`, `id`, `aria-*`, listeners) goes to the native `<input>`.
 * The `icon` slot overrides `leadingIcon`.
 */
export interface PasswordProps {
  /** Control height. @defaultValue `'md'` */
  size?: PasswordSize;
  /** The autocomplete hint. Use `new-password` on sign-up and reset forms. @defaultValue `'current-password'` */
  autocomplete?: 'current-password' | 'new-password';
  /** The visible label, linked to the control. Without it, pass an `aria-label`. */
  label?: string;
  /** Help text under the box, linked with `aria-describedby`. */
  hint?: string;
  /** Validation message. Marks the field invalid and is linked with `aria-describedby`. */
  error?: string;
  /** Marks the field invalid without a message. @defaultValue `false` */
  invalid?: boolean;
  /** Disables the control and the reveal button. @defaultValue `false` */
  disabled?: boolean;
  /** Makes the control read-only. It stays focusable. @defaultValue `false` */
  readonly?: boolean;
  /** Marks the field required and shows the required mark. @defaultValue `false` */
  required?: boolean;
  /** Placeholder text. Never a replacement for the label. */
  placeholder?: string;
  /** The value, bound with `v-model`. */
  modelValue?: string;
  /** Icon name before the value, such as `lock`. The `icon` slot overrides it. */
  leadingIcon?: string;
  /** Shows the strength meter and its level name. @defaultValue `false` */
  strengthMeter?: boolean;
  /** Rules shown under the box and checked as people type. */
  requirements?: PasswordRequirement[];
  /** The reveal button's accessible name; aria-pressed carries the state. @defaultValue `'Show password'` */
  revealLabel?: string;
  /** Built-in text; keys you leave out keep their English defaults. */
  labels?: Partial<PasswordLabels>;
  /** Extra classes per part, such as `{ box: '…', reveal: '…' }`. */
  classes?: Partial<Record<PasswordPart, string>>;
}

/** The events of the Password component. */
export interface PasswordEmits {
  /** The value changed. */
  'update:modelValue': [value: string];
}
