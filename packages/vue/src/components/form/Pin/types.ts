import type { DaisyColor } from '@artisanpack-ui/tokens';

/**
 * Props for the Pin component.
 *
 * Renders a row of individual single-character inputs for PIN/OTP entry
 * with auto-focus navigation, paste support, and completion callbacks.
 */
export interface PinProps {
  /** Number of individual PIN input fields to render. */
  length: number;
  /** When true, restricts input to digits only (0-9). @defaultValue `false` */
  numeric?: boolean;
  /** When true, masks the input characters using password type. @defaultValue `false` */
  hide?: boolean;
  /** Error message displayed below the PIN inputs. */
  error?: string;
  /** DaisyUI color variant applied to each individual PIN input field. */
  color?: DaisyColor;
  /** Custom id prefix for the input elements. */
  id?: string;
  /** Whether the fields are disabled. */
  disabled?: boolean;
}
