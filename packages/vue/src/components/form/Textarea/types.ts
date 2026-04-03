/**
 * Props for the Textarea component.
 *
 * Provides a multi-line text input with label, hint/error, inline label mode,
 * and read-only styling.
 */
export interface TextareaProps {
  /** Text label displayed above the textarea. Hidden when `inline` is true. */
  label?: string;
  /** Helper text displayed below the textarea. Hidden when `error` is present. */
  hint?: string;
  /** Error message displayed below the textarea. Replaces `hint` when present. */
  error?: string;
  /** When true, moves the label below the textarea as a smaller fieldset label instead of displaying it as a legend above. @defaultValue `false` */
  inline?: boolean;
  /** Custom id for the textarea element. */
  id?: string;
  /** Whether the textarea is required. */
  required?: boolean;
  /** Whether the textarea is read-only. */
  readonly?: boolean;
  /** Placeholder text. */
  placeholder?: string;
  /** Number of visible text rows. */
  rows?: number;
  /** Whether the textarea is disabled. */
  disabled?: boolean;
}
