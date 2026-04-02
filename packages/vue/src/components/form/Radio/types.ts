import type { DaisyColor } from '@artisanpack-ui/tokens';

/**
 * Represents a single option in a Radio group.
 */
export interface RadioOption {
  [key: string]: unknown;
  /** When true, this option is rendered in a disabled state. */
  disabled?: boolean;
}

/**
 * Props for the Radio component.
 *
 * Renders a group of radio buttons from an `options` array with support for
 * card layout, horizontal/vertical orientation, and DaisyUI color variants.
 */
export interface RadioProps {
  /** Group label rendered as a `<legend>` element. */
  label?: string;
  /** Helper text displayed below the radio group. Hidden when `error` is present. */
  hint?: string;
  /** Error message displayed below the group. Replaces `hint` when present. */
  error?: string;
  /** DaisyUI color variant applied to each radio input. */
  color?: DaisyColor;
  /** Property key on each option object to use as the radio input value. @defaultValue `'id'` */
  optionValue?: string;
  /** Property key on each option object to use as the displayed label text. @defaultValue `'name'` */
  optionLabel?: string;
  /** Property key on each option object to use as optional hint text. @defaultValue `'hint'` */
  optionHint?: string;
  /** Array of option objects to render as radio buttons. */
  options?: RadioOption[];
  /** When true, displays options horizontally. Only applies when `card` is false. @defaultValue `false` */
  inline?: boolean;
  /** When true, renders each option inside a bordered card. @defaultValue `false` */
  card?: boolean;
  /** Additional CSS classes applied to each card container. */
  cardClass?: string;
  /** Custom id for the fieldset. */
  id?: string;
  /** Name attribute for the radio group. */
  name?: string;
  /** Whether the field is required. */
  required?: boolean;
}
