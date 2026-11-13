import type { ChoiceOption, ChoiceValue } from '../../_shared/choice';

/** One RadioGroup option: a string, or `{ value, label, description, meta, disabled }`. */
export type RadioGroupOption = ChoiceOption;

/** The layout of a RadioGroup. */
export type RadioGroupVariant = 'default' | 'cards' | 'segmented';

/** The direction of a RadioGroup's options. */
export type RadioGroupOrientation = 'vertical' | 'horizontal';

/** The parts of a RadioGroup that accept extra classes. */
export type RadioGroupPart =
  | 'root'
  | 'label'
  | 'required'
  | 'items'
  | 'item'
  | 'box'
  | 'control'
  | 'indicator'
  | 'itemText'
  | 'itemDescription'
  | 'itemMeta'
  | 'hint'
  | 'error';

/**
 * Props for the RadioGroup component (design-system manifest `RadioGroup`, #53).
 *
 * Bind the value with `v-model`. `class` goes to the fieldset; a `name`
 * attribute names every radio (else a generated one); other attributes go
 * to the fieldset.
 */
export interface RadioGroupProps {
  /** The options: strings, or `{ value, label, description, meta, disabled }` objects. */
  options?: RadioGroupOption[];
  /** The selected value, bound with `v-model`. */
  modelValue?: ChoiceValue | null;
  /** The group label, rendered as the legend. */
  label?: string;
  /** Help text under the options, linked to the fieldset. */
  hint?: string;
  /** Validation message. Marks every radio invalid and is linked with `aria-describedby`. */
  error?: string;
  /** Marks the group invalid without a message. @defaultValue `false` */
  invalid?: boolean;
  /** Disables every option. @defaultValue `false` */
  disabled?: boolean;
  /** Sets `required` on the radios and shows the required mark. @defaultValue `false` */
  required?: boolean;
  /** Stacks the options or lays them in a row. @defaultValue `'vertical'` */
  orientation?: RadioGroupOrientation;
  /** Plain radios, cards or joined segments. @defaultValue `'default'` */
  variant?: RadioGroupVariant;
  /** Extra classes per part, such as `{ item: '…', itemText: '…' }`. */
  classes?: Partial<Record<RadioGroupPart, string>>;
}
