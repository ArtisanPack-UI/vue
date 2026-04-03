/**
 * Props for the Editor component.
 *
 * Provides a monospace-styled textarea suitable for code or structured text editing.
 */
export interface EditorProps {
  /** Text label displayed above the editor. */
  label?: string;
  /** Helper text displayed below the editor. Hidden when `error` is present. */
  hint?: string;
  /** Error message displayed below the editor. Replaces `hint` when present. */
  error?: string;
  /** Custom id for the textarea element. */
  id?: string;
  /** Whether the field is required. */
  required?: boolean;
  /** Placeholder text. */
  placeholder?: string;
  /** Number of visible text rows. @defaultValue `12` */
  rows?: number;
  /** Whether the field is disabled. */
  disabled?: boolean;
  /** Whether the field is read-only. */
  readonly?: boolean;
}
