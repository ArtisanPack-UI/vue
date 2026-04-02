import type { DaisyColor } from '@artisanpack-ui/tokens';

/**
 * Props for the Checkbox component.
 *
 * Supports both standard and card layout variants.
 */
export interface CheckboxProps {
  /** Text label displayed next to the checkbox. */
  label?: string;
  /** When true, positions the label to the right of the checkbox (reverses flex order). @defaultValue `false` */
  right?: boolean;
  /** Helper text displayed below the checkbox. Hidden when `error` is present. */
  hint?: string;
  /** Error message displayed below the checkbox. Replaces `hint` when present. */
  error?: string;
  /** DaisyUI color variant for the checkbox indicator. */
  color?: DaisyColor;
  /** When true, renders the checkbox inside a bordered card layout. @defaultValue `false` */
  card?: boolean;
  /** Additional CSS classes applied to the card container when `card` is true. */
  cardClass?: string;
  /** Custom id for the input element. */
  id?: string;
  /** Whether the checkbox is required. */
  required?: boolean;
  /** Whether the checkbox is disabled. */
  disabled?: boolean;
}
