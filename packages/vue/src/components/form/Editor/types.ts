/**
 * Props for the deprecated Editor component.
 *
 * @deprecated Use `CodeEditor` (#53). Editor renders a CodeEditor with the
 * same props; CodeEditor's own props pass through.
 */
export interface EditorProps {
  /** Text label displayed above the editor. */
  label?: string;
  /** Help text under the editor. */
  hint?: string;
  /** Validation message. Marks the field invalid. */
  error?: string;
  /** Custom id for the textarea element. */
  id?: string;
  /** Whether the field is required. */
  required?: boolean;
  /** Placeholder text. */
  placeholder?: string;
  /** The fewest lines shown; the editor grows with its content. @defaultValue `12` */
  rows?: number;
  /** Whether the field is disabled. */
  disabled?: boolean;
  /** Whether the field is read-only. */
  readonly?: boolean;
}
