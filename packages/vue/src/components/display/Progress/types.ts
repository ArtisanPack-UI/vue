import type { DaisyColor } from '@artisanpack-ui/tokens';

/**
 * Props for the Progress component.
 *
 * A progress bar with percentage display and color variants.
 */
export interface ProgressProps {
  /** Current value of the progress bar (0 to max). */
  value?: number;
  /** Maximum value. @defaultValue `100` */
  max?: number;
  /** Color variant of the progress bar. */
  color?: DaisyColor;
  /** When true, shows the percentage text. @defaultValue `false` */
  showValue?: boolean;
  /** Additional CSS classes. */
  className?: string;
}
