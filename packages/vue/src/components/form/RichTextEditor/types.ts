/**
 * Props for the RichTextEditor component.
 *
 * Provides a `contentEditable` wrapper with toolbar support, controlled HTML value,
 * and consistent form field styling.
 *
 * **Security warning:** Always sanitize the `modelValue` (e.g., with DOMPurify)
 * before passing user-generated content to prevent XSS attacks.
 */
export interface RichTextEditorProps {
  /** Text label displayed above the editor. */
  label?: string;
  /** Helper text displayed below the editor. Hidden when `error` is present. */
  hint?: string;
  /** Error message displayed below the editor. Replaces `hint` when present. */
  error?: string;
  /** CSS min-height for the editable content area. @defaultValue `'200px'` */
  minHeight?: string;
  /** Custom id for the editable element. */
  id?: string;
  /** Whether the field is required. */
  required?: boolean;
  /** Whether the editor is disabled. */
  disabled?: boolean;
}
