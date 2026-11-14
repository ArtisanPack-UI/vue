/**
 * A 2.x option of the deprecated Radio: any object, read through
 * `optionValue`, `optionLabel` and `optionHint`.
 *
 * @deprecated Use RadioGroup's `{ value, label, description, disabled }` options.
 */
export interface RadioOption {
  [key: string]: unknown;
  /** When true, this option is rendered in a disabled state. */
  disabled?: boolean;
}

/**
 * Props for the deprecated Radio component.
 *
 * @deprecated Use `RadioGroup` (#53). Radio renders a RadioGroup: `inline`
 * is its horizontal `orientation`, `card` its `cards` variant and the
 * option keys are mapped to `{ value, label, description }`.
 */
export interface RadioProps {
  /** Group label rendered as a `<legend>` element. */
  label?: string;
  /** Help text under the options. */
  hint?: string;
  /** Validation message. Marks every radio invalid. */
  error?: string;
  /** Ignored: radios use the primary color. */
  color?: string;
  /** Property key on each option object to use as the radio input value. @defaultValue `'id'` */
  optionValue?: string;
  /** Property key on each option object to use as the displayed label text. @defaultValue `'name'` */
  optionLabel?: string;
  /** Property key on each option object to use as optional hint text. @defaultValue `'hint'` */
  optionHint?: string;
  /** Array of option objects to render as radio buttons. */
  options?: RadioOption[];
  /** Lays the options in a row. RadioGroup's `orientation="horizontal"`. @defaultValue `false` */
  inline?: boolean;
  /** Renders each option as a card. RadioGroup's `variant="cards"`. @defaultValue `false` */
  card?: boolean;
  /** Additional CSS classes for each option. RadioGroup's `classes.item`. */
  cardClass?: string;
  /** Custom id for the fieldset. */
  id?: string;
  /** Name attribute for the radio group. */
  name?: string;
  /** Whether the field is required. */
  required?: boolean;
}
