import type { DaisyColor, Size } from '@artisanpack-ui/tokens';

/**
 * Props for the Button component.
 *
 * When the `link` prop is provided, the component renders as an `<a>` element
 * styled as a button.
 */
export interface ButtonProps {
  /** Text label displayed inside the button. Hidden on small screens when `responsive` is true. */
  label?: string;
  /** DaisyUI color variant applied to the button. Accepts standard theme colors plus `'ghost'` and `'outline'`. */
  color?: DaisyColor | 'ghost' | 'outline';
  /** Controls the button size using DaisyUI size modifiers. */
  size?: Size;
  /** When true, shows a loading spinner in place of the left icon. */
  loading?: boolean;
  /** When provided, renders the button as an `<a>` element pointing to this URL. */
  link?: string;
  /** When true and `link` is set, opens the link in a new tab with `rel="noopener noreferrer"`. */
  external?: boolean;
  /** Text content for an inline badge rendered after the button label. */
  badge?: string;
  /** DaisyUI color variant applied to the badge element. */
  badgeColor?: DaisyColor | 'ghost' | 'outline';
  /** Additional CSS classes applied to the badge element. */
  badgeClasses?: string;
  /** When true, hides the label on small screens and only shows it on `sm` breakpoint and above. */
  responsive?: boolean;
  /** Tooltip text displayed on hover. Wraps the button in a DaisyUI tooltip container. */
  tooltip?: string;
  /** Position of the tooltip relative to the button. @defaultValue `'top'` */
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  /** Whether the button is disabled. */
  disabled?: boolean;
  /** HTML button type attribute. @defaultValue `'button'` */
  type?: 'button' | 'submit' | 'reset';
}
