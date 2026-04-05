/**
 * Props for the Password component.
 *
 * Provides a password input with built-in visibility toggle, clearable action,
 * and customizable toggle icons.
 */
export interface PasswordProps {
  /** Text label displayed above the password input. Hidden when `inline` is true. */
  label?: string;
  /** Helper text displayed below the input. Hidden when `error` is present. */
  hint?: string;
  /** Error message displayed below the input. Replaces `hint` when present. */
  error?: string;
  /** When true, renders the label as a floating/inline label inside the input wrapper. @defaultValue `false` */
  inline?: boolean;
  /** When true, shows a clear (X) button inside the input. @defaultValue `false` */
  clearable?: boolean;
  /** When true, hides the password visibility toggle button. @defaultValue `false` */
  hideToggle?: boolean;
  /** Custom id for the input element. */
  id?: string;
  /** Whether the input is required. */
  required?: boolean;
  /** Placeholder text. */
  placeholder?: string;
  /** Whether the input is disabled. */
  disabled?: boolean;
}
