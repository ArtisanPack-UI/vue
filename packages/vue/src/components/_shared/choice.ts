/**
 * @module choice
 *
 * Option lists for the design-system choice groups (RadioGroup and
 * CheckboxGroup, #53), and the label templates the form-choice components
 * fill (`:value out of :max`, `Remove :name`).
 *
 * @internal
 */

/** A value an option can carry. */
export type ChoiceValue = string | number;

/** An option object. Values are compared as strings. */
export interface ChoiceOptionObject {
  /** The option's value; events receive it as given. */
  value: ChoiceValue;
  /** The text shown. Defaults to the value. */
  label?: string;
  /** Supporting text under the label, linked with `aria-describedby`. */
  description?: string;
  /** A price or other figure (RadioGroup cards). */
  meta?: string;
  /** Makes the option unselectable. */
  disabled?: boolean;
}

/** An option: a string (value and label) or an option object. */
export type ChoiceOption = string | ChoiceOptionObject;

/** A normalized option. */
export interface NormalizedChoice {
  key: string;
  value: ChoiceValue;
  label: string;
  description?: string;
  meta?: string;
  disabled: boolean;
}

/** Normalizes options: string keys, original values. */
export function normalizeChoices(options: readonly ChoiceOption[]): NormalizedChoice[] {
  return options.map((option) =>
    typeof option === 'object' && option !== null
      ? {
          key: String(option.value),
          value: option.value,
          label: option.label ?? String(option.value),
          description: option.description || undefined,
          meta: option.meta || undefined,
          disabled: !!option.disabled,
        }
      : { key: String(option), value: option, label: String(option), disabled: false },
  );
}

/** Replaces `:name` placeholders in a label template. */
export function fillTemplate(template: string, values: Record<string, string | number>): string {
  return template.replace(/:([a-z]+)/gi, (match, name: string) =>
    name in values ? String(values[name]) : match,
  );
}
