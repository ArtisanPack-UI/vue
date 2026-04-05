import type { DaisyColor } from '@artisanpack-ui/tokens';

/**
 * Props for the Toggle component.
 *
 * Renders a switch/toggle using a styled checkbox with `role="switch"`.
 */
export interface ToggleProps {
  /** Text label displayed next to the toggle switch. */
  label?: string;
  /** When true, positions the label to the right of the toggle. @defaultValue `false` */
  right?: boolean;
  /** Helper text displayed below the toggle. Hidden when `error` is present. */
  hint?: string;
  /** Error message displayed below the toggle. Replaces `hint` when present. */
  error?: string;
  /** DaisyUI color variant for the toggle track and thumb. */
  color?: DaisyColor;
  /** Custom id for the input element. */
  id?: string;
  /** Whether the toggle is required. */
  required?: boolean;
  /** Whether the toggle is disabled. */
  disabled?: boolean;
}
