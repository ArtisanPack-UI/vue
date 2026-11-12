/** A heading level or visual size, 1 (largest) to 6. */
export type HeadingStep = 1 | 2 | 3 | 4 | 5 | 6 | '1' | '2' | '3' | '4' | '5' | '6';

/** The parts of a Heading that accept extra classes. */
export type HeadingPart = 'root' | 'eyebrow';

/**
 * Props for the Heading component (design-system manifest `Heading`, #58).
 *
 * The default slot is the title; the `eyebrow` slot overrides `eyebrow`.
 * `class` and every other attribute go to the h1–h6.
 */
export interface HeadingProps {
  /** The semantic level: renders h1–h6. Emitted as `data-level`. @defaultValue `2` */
  level?: HeadingStep;
  /** The visual size, 1–6. Defaults to `level`. Emitted as `data-size`. */
  size?: HeadingStep;
  /** A short uppercase section label, rendered just before the heading. */
  eyebrow?: string;
  /** Extra classes per part, such as `{ eyebrow: '…' }`. */
  classes?: Partial<Record<HeadingPart, string>>;
}
