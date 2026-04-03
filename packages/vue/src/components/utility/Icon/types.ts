import type { DaisyColor, Size } from '@artisanpack-ui/tokens';

/**
 * Props for the Icon component.
 *
 * Renders an SVG icon with configurable size and color. Pass SVG content
 * via the default slot.
 */
export interface IconProps {
  /** The size of the icon. Maps to DaisyUI size classes. @defaultValue `'md'` */
  size?: Size;
  /** The DaisyUI color variant applied to the icon. */
  color?: DaisyColor;
  /** Accessible label for the icon. When omitted, the icon is treated as decorative (aria-hidden). */
  ariaLabel?: string;
  /** Additional CSS classes. */
  className?: string;
}
