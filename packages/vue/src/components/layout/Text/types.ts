/** The element a Text renders. */
export type TextElement = 'p' | 'span' | 'div';

/** A Text's size. Emitted as `data-size`. */
export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'lead';

/** A Text's color. Emitted as `data-tone`. */
export type TextTone = 'default' | 'muted' | 'success' | 'warning' | 'error';

/** A Text's weight. Emitted as `data-weight`. */
export type TextWeight = 'regular' | 'medium' | 'semibold';

/**
 * Props for the Text component (design-system manifest `Text`, #58).
 * `class` and every other attribute go to the root.
 */
export interface TextProps {
  /** The element. @defaultValue `'p'` */
  as?: TextElement;
  /** Size; lead is muted unless a tone is set. @defaultValue `'md'` */
  size?: TextSize;
  /** Color; status tones are never the only signal. @defaultValue `'default'` */
  tone?: TextTone;
  /** Weight. @defaultValue `'regular'` */
  weight?: TextWeight;
  /** Cuts to one line; plain-text content is copied to `title`. @defaultValue `false` */
  truncate?: boolean;
  /** Cuts after this many lines; plain-text content is copied to `title`. */
  clamp?: number;
  /** Extra classes: `{ root: '…' }`. */
  classes?: Partial<Record<'root', string>>;
}
