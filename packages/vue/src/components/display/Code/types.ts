/**
 * Props for the Code component.
 *
 * Displays a code block with optional language label and copy functionality.
 */
export interface CodeProps {
  /** The code content to display. */
  code: string;
  /** Programming language label (e.g., "javascript", "html"). */
  language?: string;
  /** When true, shows a copy button. @defaultValue `false` */
  copyable?: boolean;
  /** When true, renders inline instead of as a block. @defaultValue `false` */
  inline?: boolean;
  /** When true, shows line numbers. @defaultValue `false` */
  lineNumbers?: boolean;
  /** Additional CSS classes. */
  className?: string;
}
