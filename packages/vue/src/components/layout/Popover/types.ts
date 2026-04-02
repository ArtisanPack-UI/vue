/**
 * Props for the Popover component.
 *
 * A positioned floating content panel activated by hover or click on a trigger element.
 */
export interface PopoverProps {
  /** Trigger activation mode. @defaultValue `'hover'` */
  triggerMode?: 'hover' | 'click';
  /** Position of the popover relative to the trigger. @defaultValue `'bottom'` */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Delay in milliseconds before showing in hover mode. @defaultValue `0` */
  showDelay?: number;
  /** Delay in milliseconds before hiding in hover mode. @defaultValue `300` */
  hideDelay?: number;
  /** Whether the popover is open. Use with `v-model:open`. */
  open?: boolean;
  /** When true, prevents closing via Escape or click-outside. @defaultValue `false` */
  persistent?: boolean;
}
