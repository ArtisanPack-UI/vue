import type { DaisyColor } from '@artisanpack-ui/tokens';

/**
 * Props for the Navbar component.
 *
 * A top navigation bar with start, center, and end slots for flexible layout.
 * Built on DaisyUI's navbar class.
 */
export interface NavbarProps {
  /** DaisyUI background color for the navbar. */
  color?: DaisyColor;
  /** When true, applies glass morphism styling. @defaultValue `false` */
  glass?: boolean;
  /** Additional CSS classes for the navbar container. */
  className?: string;
}
