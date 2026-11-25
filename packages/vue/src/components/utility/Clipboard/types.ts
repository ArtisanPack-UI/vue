/** A copy button, an icon button with a tooltip, or a copy field. Emitted as `data-variant`. */
export type ClipboardVariant = 'button' | 'icon' | 'field';

/** The button's size and the field's height. Emitted as `data-size`. */
export type ClipboardSize = 'xs' | 'sm' | 'md';

/** The parts of a Clipboard that accept extra classes. */
export type ClipboardPart = 'root' | 'button' | 'field' | 'value' | 'tooltip';

/**
 * Props for the Clipboard component (design-system manifest `Clipboard`, #65).
 *
 * `class` and every other attribute go to the root.
 */
export interface ClipboardProps {
  /** What to copy. The field variant shows it. */
  value?: string;
  /** The same as `value`, under the design-system kit's Vue spelling; `value` wins. */
  modelValue?: string;
  /**
   * The 2.x name of `value`; `value` and `modelValue` win.
   *
   * @deprecated Use `value`. Removed in a later major release.
   */
  text?: string;
  /** How long "Copied" shows, in ms. @defaultValue `2000` */
  timeout?: number;
  /** @defaultValue `'button'` */
  variant?: ClipboardVariant;
  /** @defaultValue `'sm'` */
  size?: ClipboardSize;
  /** The button's label; the icon button's accessible name. @defaultValue `'Copy'`, translated */
  label?: string;
  /** The label after a copy. @defaultValue `'Copied'`, translated */
  copiedLabel?: string;
  /** Announced after a copy. @defaultValue `'Copied to clipboard'`, translated */
  copiedMessage?: string;
  /** Announced when the copy fails. @defaultValue `"Couldn't copy. Select the text and copy it yourself."`, translated */
  errorMessage?: string;
  /** Extra classes per part. */
  classes?: Partial<Record<ClipboardPart, string>>;
}
