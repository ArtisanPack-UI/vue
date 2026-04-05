/**
 * Represents a single option in a Select dropdown.
 */
export interface SelectOption {
  [key: string]: unknown;
  /** When true, this option is rendered in a disabled state. */
  disabled?: boolean;
}

/**
 * Props for the Select component.
 *
 * Supports option mapping from data arrays, placeholder option, icons,
 * and inline label display.
 */
export interface SelectProps {
  /** Text label displayed above the select. Hidden when `inline` is true. */
  label?: string;
  /** Helper text displayed below the select. Hidden when `error` is present. */
  hint?: string;
  /** Error message displayed below the select. Replaces `hint` when present. */
  error?: string;
  /** Text for a disabled placeholder option rendered as the first option. */
  placeholder?: string;
  /** Value attribute for the placeholder option. @defaultValue `''` */
  placeholderValue?: string;
  /** When true, renders the label as an inline fieldset label below the select. @defaultValue `false` */
  inline?: boolean;
  /** Property key on each option object to use as the option value. @defaultValue `'id'` */
  optionValue?: string;
  /** Property key on each option object to use as the displayed option text. @defaultValue `'name'` */
  optionLabel?: string;
  /** Array of option objects to render as options. */
  options?: SelectOption[];
  /** Custom id for the select element. */
  id?: string;
  /** Whether the field is required. */
  required?: boolean;
  /** Whether the field is disabled. */
  disabled?: boolean;
  /** Current value of the select (for v-model). */
  modelValue?: string | number;
}
