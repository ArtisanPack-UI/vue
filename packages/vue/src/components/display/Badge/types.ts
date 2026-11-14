/** A Badge's visual treatment. Emitted as `data-variant`. */
export type BadgeVariant = 'solid' | 'soft' | 'outline' | 'ghost';

/** A Badge's semantic color. Emitted as `data-color`. */
export type BadgeColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/** A Badge's height: 18, 20 or 24px. Emitted as `data-size`. */
export type BadgeSize = 'sm' | 'md' | 'lg';

/** The parts of a Badge that accept extra classes. */
export type BadgePart = 'root' | 'dot' | 'icon' | 'label';

/**
 * Props for the Badge component (design-system manifest `Badge`, #61).
 *
 * The default slot is the label; the `icon` slot overrides `leadingIcon`.
 * `class` and every other attribute go to the root.
 */
export interface BadgeProps {
  /** Visual treatment. @defaultValue `'soft'` */
  variant?: BadgeVariant;
  /** Semantic color; use the same one for the same status everywhere. @defaultValue `'neutral'` */
  color?: BadgeColor;
  /** Height. @defaultValue `'md'` */
  size?: BadgeSize;
  /** A decorative dot before the label. @defaultValue `false` */
  dot?: boolean;
  /** Icon name before the label. Arrows mirror in RTL. The `icon` slot overrides it. */
  leadingIcon?: string;
  /** Extra classes per part, such as `{ label: '…' }`. */
  classes?: Partial<Record<BadgePart, string>>;
}
