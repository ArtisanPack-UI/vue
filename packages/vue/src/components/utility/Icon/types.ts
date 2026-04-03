import type { DaisyColor, Size } from '@artisanpack-ui/tokens';

/**
 * Props for the Icon component.
 *
 * Renders an SVG icon with configurable size and color. Supports passing
 * raw SVG content via the default slot or referencing a named icon from
 * a registered icon set.
 */
export interface IconProps {
  /** The name of the icon to render (e.g., 'home', 'user'). Used to look up the icon in registered sets. */
  name?: string;
  /** The size of the icon. Maps to DaisyUI size classes. @defaultValue `'md'` */
  size?: Size;
  /** The DaisyUI color variant applied to the icon. */
  color?: DaisyColor;
  /** Accessible label for the icon. When omitted, the icon is treated as decorative (aria-hidden). */
  ariaLabel?: string;
  /** Additional CSS classes. */
  className?: string;
}
