import type { ChoiceOption, ChoiceValue } from '../../_shared/choice';

/** One CheckboxGroup option: a string, or `{ value, label, description, disabled }`. */
export type CheckboxGroupOption = ChoiceOption;

/** The parts of a CheckboxGroup that accept extra classes. */
export type CheckboxGroupPart = 'root' | 'label' | 'selectAll' | 'items' | 'hint' | 'error';

/**
 * Props for the CheckboxGroup component (design-system manifest
 * `CheckboxGroup`, #53).
 *
 * Bind the checked values with `v-model`. `class` goes to the fieldset; a
 * `name` attribute (such as `topics[]`) lands on every checkbox; other
 * attributes go to the fieldset.
 */
export interface CheckboxGroupProps {
  /** The options: strings, or `{ value, label, description, disabled }` objects. */
  options?: CheckboxGroupOption[];
  /** The checked values, bound with `v-model`. */
  modelValue?: ChoiceValue[];
  /** The group label, rendered as the legend. */
  label?: string;
  /** Help text under the options, linked to the fieldset. */
  hint?: string;
  /** Validation message. Marks every option invalid and is linked with `aria-describedby`. */
  error?: string;
  /** Marks every option invalid without a message. @defaultValue `false` */
  invalid?: boolean;
  /** Disables every option and select all. @defaultValue `false` */
  disabled?: boolean;
  /** Stacks the options or wraps them in a row. @defaultValue `'vertical'` */
  orientation?: 'vertical' | 'horizontal';
  /** Plain checkboxes, or cards. @defaultValue `'default'` */
  variant?: 'default' | 'cards';
  /** 1, 2 or 3 columns. @defaultValue `1` */
  columns?: number;
  /** Adds a select-all checkbox with the mixed state. @defaultValue `false` */
  selectAll?: boolean;
  /** The select-all label. @defaultValue `'Select all'` */
  selectAllLabel?: string;
  /** Extra classes per part, such as `{ items: '…' }`. */
  classes?: Partial<Record<CheckboxGroupPart, string>>;
}
