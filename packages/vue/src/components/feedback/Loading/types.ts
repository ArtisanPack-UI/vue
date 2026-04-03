import type { DaisyColor, Size } from '@artisanpack-ui/tokens';

/**
 * Visual variant of the loading indicator animation.
 */
export type LoadingVariant = 'spinner' | 'dots' | 'ring' | 'ball' | 'bars' | 'infinity';

/**
 * Props for the Loading component.
 *
 * Renders an animated loading indicator using DaisyUI's loading component.
 */
export interface LoadingProps {
  /** The DaisyUI color variant applied to the loading indicator. */
  color?: DaisyColor;
  /** The size of the loading indicator. */
  size?: Size;
  /** The visual animation style of the loading indicator. @defaultValue `'spinner'` */
  variant?: LoadingVariant;
  /** Accessible label for the loading indicator. @defaultValue `'Loading'` */
  ariaLabel?: string;
  /** Additional CSS classes. */
  className?: string;
}
