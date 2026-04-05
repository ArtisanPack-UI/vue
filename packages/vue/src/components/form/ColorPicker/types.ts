/**
 * Props for the ColorPicker component.
 *
 * Combines a native color input with a hex value display, optional icons,
 * and action buttons for clearing and generating random colors.
 */
export interface ColorPickerProps {
  /** Text label displayed above the color picker. */
  label?: string;
  /** Helper text displayed below the color picker. Hidden when `error` is present. */
  hint?: string;
  /** Error message displayed below the picker. Replaces `hint` when present. */
  error?: string;
  /** When true, shows a clear button that resets the color. @defaultValue `false` */
  clearable?: boolean;
  /** When true, shows a button to generate a random hex color. @defaultValue `false` */
  random?: boolean;
  /** Custom id for the input element. */
  id?: string;
  /** Whether the field is required. */
  required?: boolean;
  /** Default color value used when clearing. @defaultValue `'#000000'` */
  defaultValue?: string;
  /** Whether the field is disabled. */
  disabled?: boolean;
}
