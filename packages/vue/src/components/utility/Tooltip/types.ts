import type { DaisyColor } from '@artisanpack-ui/tokens';

/**
 * Position of the tooltip relative to the trigger element.
 */
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Props for the Tooltip component.
 *
 * Wraps a trigger element with a positioned tooltip that appears on hover
 * and focus. Uses DaisyUI's tooltip classes with proper ARIA describedby
 * for accessibility.
 */
export interface TooltipProps {
  /** The tooltip text content. */
  text: string;
  /** Position of the tooltip relative to the trigger. @defaultValue `'top'` */
  position?: TooltipPosition;
  /** The DaisyUI color variant applied to the tooltip. */
  color?: DaisyColor;
  /** When true, forces the tooltip to remain open. @defaultValue `false` */
  forceOpen?: boolean;
  /** Additional CSS classes. */
  className?: string;
}
