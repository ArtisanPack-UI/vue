/** The look of an Icon: the bare glyph, or on a soft tile. */
export type IconVariant = 'plain' | 'tile';

/** The glyph size of an Icon: 14, 16, 20 or 24px. */
export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

/** The tone of an Icon. */
export type IconColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/** The parts an Icon accepts extra classes for. */
export type IconPart = 'root' | 'svg';

/**
 * Props for the Icon component (#65): one glyph from the icon registry, or
 * your own `<svg>` in the default slot.
 */
export interface IconProps {
  /** A registered icon name, Lucide's kebab-case (`house`). The default slot overrides it. */
  name?: string;
  /** `plain`, or `tile` for a soft-colored square. @defaultValue `'plain'` */
  variant?: IconVariant;
  /** The glyph size. @defaultValue `'md'` */
  size?: IconSize;
  /** A plain icon's text tone, or a tile's soft fill. Unset: currentColor, and a neutral tile. */
  color?: IconColor;
  /** The accessible name. With it the icon is `role="img"`; without it, decorative. */
  label?: string;
  /** Flips it under RTL. Unset, directional names (arrows, chevrons) mirror. */
  mirror?: boolean;
  /** Extra classes per part. */
  classes?: Partial<Record<IconPart, string>>;
}
