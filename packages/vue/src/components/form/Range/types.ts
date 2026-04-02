import type { DaisyColor } from '@artisanpack-ui/tokens';

/**
 * Props for the Range component.
 *
 * Renders a styled range slider with DaisyUI color variants.
 */
export interface RangeProps {
  /** Text label displayed above the range slider. */
  label?: string;
  /** Helper text displayed below the slider. Hidden when `error` is present. */
  hint?: string;
  /** Error message displayed below the slider. Replaces `hint` when present. */
  error?: string;
  /** DaisyUI color variant for the range track and thumb. */
  color?: DaisyColor;
  /** Custom id for the input element. */
  id?: string;
  /** Minimum value. @defaultValue `0` */
  min?: number;
  /** Maximum value. @defaultValue `100` */
  max?: number;
  /** Step increment. */
  step?: number;
  /** Whether the field is required. */
  required?: boolean;
  /** Whether the field is disabled. */
  disabled?: boolean;
}
