/** Control height of a Combobox. Emitted as `data-size`. */
export type ComboboxSize = 'sm' | 'md' | 'lg';

/** A semantic color for an option's chip. */
export type ComboboxColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/** An option object. Values are compared as strings. */
export interface ComboboxOptionObject {
  /** The option's value. */
  value: string | number;
  /** The option's text, which filtering matches. Defaults to the value. */
  label?: string;
  /** A second line under the label. */
  description?: string;
  /** An icon name, resolved through the icon registry. */
  icon?: string;
  /** Tints the option's chip with `multiple`. */
  color?: ComboboxColor;
  /** When true, the option can't be chosen. */
  disabled?: boolean;
}

/** An option: a string (value and label) or an option object. */
export type ComboboxOption = string | ComboboxOptionObject;

/**
 * A Combobox value: a string (or null), or an array with `multiple`. An
 * option's number value comes back as the number it was given; created
 * values are strings.
 */
export type ComboboxValue = string | number | (string | number)[] | null;

/** The parts of a Combobox that accept extra classes. */
export type ComboboxPart =
  | 'root'
  | 'label'
  | 'required'
  | 'box'
  | 'icon'
  | 'chip'
  | 'chipRemove'
  | 'control'
  | 'spinner'
  | 'clearTrigger'
  | 'trigger'
  | 'hint'
  | 'error'
  | 'positioner'
  | 'content'
  | 'item'
  | 'itemText'
  | 'mark'
  | 'itemDescription'
  | 'itemIndicator'
  | 'empty'
  | 'status';

/**
 * Props for the Combobox component (design-system manifest `Combobox`, #54).
 *
 * A text input that filters a listbox. Bind the value with `v-model` (a
 * string, or an array with `multiple`) and the listbox with `v-model:open`.
 * `multiple` + `allowCreate` is the tags input. `class` and every other
 * attribute go to the root.
 */
export interface ComboboxProps {
  /** Control height. @defaultValue `'md'` */
  size?: ComboboxSize;
  /** The options: strings, or `{ value, label, description, icon, color, disabled }` objects. */
  options?: ComboboxOption[];
  /** The visible label, linked to the input. Without it, pass an `aria-label`. */
  label?: string;
  /** Help text under the control, linked with `aria-describedby`. */
  hint?: string;
  /** Validation message. Marks the field invalid and is linked with `aria-describedby`. */
  error?: string;
  /** Marks the field invalid without a message. @defaultValue `false` */
  invalid?: boolean;
  /** Disables the input, the buttons and the chips. @defaultValue `false` */
  disabled?: boolean;
  /** Marks the field required and shows the required mark. @defaultValue `false` */
  required?: boolean;
  /** Shown in the empty input. @defaultValue `'Search…'` */
  placeholder?: string;
  /**
   * Submits the value with a native form: a hidden input carrying the value,
   * or one per value with `multiple` (use a name such as `tags[]` if the
   * server expects an array). None while the value is empty.
   */
  name?: string;
  /** The value, bound with `v-model`: a string or null, or an array with `multiple`. */
  modelValue?: ComboboxValue;
  /** Selects several values, shown as removable chips. @defaultValue `false` */
  multiple?: boolean;
  /** With `multiple`, the most values that can be chosen. */
  max?: number;
  /** Offers “Create …” for typed text that matches no option; emits `create`. @defaultValue `false` */
  allowCreate?: boolean;
  /** The app filters the options: listen to `search-change`. @defaultValue `false` */
  remote?: boolean;
  /** The text in the input when it renders: it filters and marks the options. */
  search?: string;
  /** Shows the spinner and the loading text. @defaultValue `false` */
  loading?: boolean;
  /** Adds a button that clears the value. @defaultValue `false` */
  clearable?: boolean;
  /** Whether the listbox is open, bound with `v-model:open`. @defaultValue `false` */
  open?: boolean;
  /** Teleports the listbox to the body. @defaultValue `true` */
  portal?: boolean;
  /** Icon name before the input. The `icon` slot overrides it. */
  leadingIcon?: string;
  /** Shown when nothing matches; `{search}` is the typed text. @defaultValue `'No matches for “{search}”.'` */
  emptyLabel?: string;
  /** Shown in the listbox while loading. @defaultValue `'Loading…'` */
  loadingLabel?: string;
  /** The create option's text; `{value}` is the typed text. @defaultValue `'Create “{value}”'` */
  createLabel?: string;
  /** A chip's remove button's name; `{label}` is the chip. @defaultValue `'Remove {label}'` */
  removeLabel?: string;
  /** Announced when a chip is removed. @defaultValue `'Removed {label}.'` */
  removedLabel?: string;
  /** The clear button's name. @defaultValue `'Clear'` */
  clearLabel?: string;
  /** The chevron button's name. @defaultValue `'Show options'` */
  triggerLabel?: string;
  /** Extra classes per part, such as `{ label: '…', content: '…', chip: '…' }`. */
  classes?: Partial<Record<ComboboxPart, string>>;
}

/** An option as the Combobox renders it, given to the `item` slot. */
export interface ComboboxSlotOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
  color?: string;
  disabled?: boolean;
  /** The create option: its value is the typed text. */
  create?: boolean;
}
