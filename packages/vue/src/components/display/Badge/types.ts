import type { DaisyColor, Size } from '@artisanpack-ui/tokens';

/**
 * Props for the Badge component.
 *
 * A small status indicator with color variants and optional outline style.
 */
export interface BadgeProps {
  /** Text content of the badge. */
  value?: string | number;
  /** Color variant of the badge. */
  color?: DaisyColor;
  /** Size of the badge. @defaultValue `'md'` */
  size?: Size;
  /** When true, renders as an outline badge. @defaultValue `false` */
  outline?: boolean;
  /** When true, renders as a ghost badge. @defaultValue `false` */
  ghost?: boolean;
  /** Additional CSS classes. */
  className?: string;
}
