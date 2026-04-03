import type { DaisyColor, Size } from '@artisanpack-ui/tokens';

/**
 * Props for the Avatar component.
 *
 * Displays a user avatar with image, initials, or placeholder fallback.
 */
export interface AvatarProps {
  /** Image URL for the avatar. */
  src?: string;
  /** Alt text for the avatar image. */
  alt?: string;
  /** Initials to display when no image is provided. */
  initials?: string;
  /** Size of the avatar. @defaultValue `'md'` */
  size?: Size;
  /** Shape of the avatar. @defaultValue `'circle'` */
  shape?: 'circle' | 'squircle' | 'hexagon' | 'triangle';
  /** Whether the avatar has an online indicator. @defaultValue `false` */
  online?: boolean;
  /** Whether the avatar has an offline indicator. @defaultValue `false` */
  offline?: boolean;
  /** Ring color around the avatar. */
  ring?: DaisyColor;
  /** Placeholder background color when no image is provided. */
  color?: DaisyColor;
  /** Additional CSS classes. */
  className?: string;
}
