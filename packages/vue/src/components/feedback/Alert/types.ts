import type { DaisyColor } from '@artisanpack-ui/tokens';

/**
 * Subset of DaisyUI colors applicable to alerts.
 */
export type AlertColor = Extract<DaisyColor, 'info' | 'success' | 'warning' | 'error'>;

/**
 * Props for the Alert component.
 *
 * Displays contextual feedback messages such as success confirmations,
 * warnings, informational notices, or error messages.
 */
export interface AlertProps {
  /** The color variant of the alert. Determines background and text styling. */
  color?: AlertColor;
  /** Whether the alert can be dismissed by the user via a close button. @defaultValue `false` */
  dismissible?: boolean;
  /**
   * Controlled visibility -- when provided, the parent manages show/hide.
   * When omitted the component manages its own internal visibility state.
   */
  visible?: boolean;
  /** Additional CSS classes. */
  className?: string;
}
