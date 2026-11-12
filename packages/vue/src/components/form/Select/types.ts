/** Control height of a Select. Emitted as `data-size`. */
export type SelectSize = 'sm' | 'md' | 'lg';

/** An option object. Values are compared as strings. */
export interface SelectOptionObject {
  /** The option's value. */
  value: string | number;
  /** The option's text. Defaults to the value. */
  label?: string;
  /** When true, the option can't be chosen. */
  disabled?: boolean;
}

/** An option: a string (value and label) or an option object. */
export type SelectOption = string | SelectOptionObject;

/** A group of options, rendered as a native `<optgroup>` (#53; replaces Livewire's `select-group`). */
export interface SelectOptionGroup {
  /** The group's label. */
  label: string;
  /** The options in the group. */
  options: SelectOption[];
}

/** The parts of a Select that accept extra classes. */
export type SelectPart =
  | 'root'
  | 'label'
  | 'required'
  | 'box'
  | 'icon'
  | 'control'
  | 'indicator'
  | 'hint'
  | 'error';

/**
 * Props for the Select component (design-system manifest `Select`, #46).
 *
 * A native `<select>`. Bind the value with `v-model`. Option elements in the
 * default slot render after `options`. `class` goes to the root; every other
 * attribute (`name`, `id`, `aria-*`, listeners) goes to the `<select>`. The
 * `icon` slot overrides `leadingIcon`.
 */
export interface SelectProps {
  /** Control height. @defaultValue `'md'` */
  size?: SelectSize;
  /** The options: strings, `{ value, label, disabled }` objects, or `{ label, options }` groups. */
  options?: (SelectOption | SelectOptionGroup)[];
  /** The visible label, linked to the control. Without it, pass an `aria-label`. */
  label?: string;
  /** Help text under the control, linked with `aria-describedby`. */
  hint?: string;
  /** Validation message. Marks the field invalid and is linked with `aria-describedby`. */
  error?: string;
  /** Marks the field invalid without a message. @defaultValue `false` */
  invalid?: boolean;
  /** Disables the control. @defaultValue `false` */
  disabled?: boolean;
  /** Marks the field required, shows the required mark and makes the placeholder option unselectable. @defaultValue `false` */
  required?: boolean;
  /** The empty first option. An empty string renders no placeholder option. @defaultValue `'Select…'` */
  placeholder?: string;
  /** The selected value, bound with `v-model`. */
  modelValue?: string | number;
  /** Icon name before the value, resolved through the icon registry. The `icon` slot overrides it. */
  leadingIcon?: string;
  /** Extra classes per part, such as `{ label: '…', control: '…' }`. */
  classes?: Partial<Record<SelectPart, string>>;
}
