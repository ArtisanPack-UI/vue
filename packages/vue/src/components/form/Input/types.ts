/**
 * Props for the Input component.
 *
 * Provides a comprehensive text input with label, icons, prefix/suffix adornments,
 * clearable action, and inline label mode.
 */
export interface InputProps {
  /** Text label displayed above the input. Hidden when `inline` is true (shown as floating label instead). */
  label?: string;
  /** Helper text displayed below the input. Hidden when `error` is present. */
  hint?: string;
  /** Error message displayed below the input. Replaces `hint` when present and adds `aria-invalid`. */
  error?: string;
  /** When true, shows a clear (X) button inside the input. @defaultValue `false` */
  clearable?: boolean;
  /** When true, renders the label as a floating/inline label inside the input wrapper. @defaultValue `false` */
  inline?: boolean;
  /** Custom id for the input element. Auto-generated if not provided. */
  id?: string;
  /** Whether the input is required. */
  required?: boolean;
  /** Input type. @defaultValue `'text'` */
  type?: 'text' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'url' | 'hidden';
  /** Placeholder text. */
  placeholder?: string;
  /** Whether the input is disabled. */
  disabled?: boolean;
  /** Whether the input is read-only. */
  readonly?: boolean;
}
