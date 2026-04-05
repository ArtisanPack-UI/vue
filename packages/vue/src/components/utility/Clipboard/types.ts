import type { DaisyColor, Size } from '@artisanpack-ui/tokens';

/**
 * Props for the Clipboard component.
 *
 * A button that copies the provided text to the clipboard and displays
 * success feedback briefly after copying.
 */
export interface ClipboardProps {
  /** The text to copy to the clipboard. */
  text: string;
  /** Label text for the button. @defaultValue `'Copy'` */
  label?: string;
  /** Label text shown after a successful copy. @defaultValue `'Copied!'` */
  successLabel?: string;
  /** Duration in milliseconds to show the success state. @defaultValue `2000` */
  successDuration?: number;
  /** The DaisyUI color variant applied to the button. */
  color?: DaisyColor;
  /** The size of the button. @defaultValue `'md'` */
  size?: Size;
  /** Additional CSS classes. */
  className?: string;
}
