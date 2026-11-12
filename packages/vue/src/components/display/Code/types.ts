/** The parts of a Code block that accept extra classes. */
export type CodePart = 'root' | 'header' | 'file' | 'language' | 'copy' | 'status' | 'pre' | 'line';

/**
 * Props for the Code component (design-system manifest `Code`, #65).
 *
 * `class` and every other attribute go to the root.
 */
export interface CodeProps {
  /** The code, shown as text. */
  code?: string;
  /** The language, shown as a badge in the header. Only a label: nothing is highlighted. */
  language?: string;
  /** The file name or a title, at the start of the header. */
  fileName?: string;
  /** Shows line numbers, which copying leaves out. @defaultValue `false` */
  numbered?: boolean;
  /** Line numbers to emphasize (1-based). */
  highlight?: number[];
  /** Inline code in running text: no header, numbers or copy. @defaultValue `false` */
  inline?: boolean;
  /** Shows the copy button. @defaultValue `true` */
  copyable?: boolean;
  /** Names the scroll region. Defaults to the file name, then the language, then "Code". */
  label?: string;
  /** The copy button's label; translate it. @defaultValue `'Copy'` */
  copyLabel?: string;
  /** The label after a copy; translate it. @defaultValue `'Copied'` */
  copiedLabel?: string;
  /** Announced after a copy; translate it. @defaultValue `'Copied to clipboard'` */
  copiedMessage?: string;
  /** Announced when the copy fails; translate it. */
  errorMessage?: string;
  /** Extra classes per part. */
  classes?: Partial<Record<CodePart, string>>;
}
