/** Control height of a ColorPicker. */
export type ColorPickerSize = 'sm' | 'md' | 'lg';

/** The text formats a ColorPicker writes and reads. */
export type ColorTextFormat = 'hex' | 'rgb' | 'hsl' | 'oklch';

/** The parts of a ColorPicker that accept extra classes. */
export type ColorPickerPart =
  | 'root'
  | 'label'
  | 'required'
  | 'box'
  | 'trigger'
  | 'swatch'
  | 'control'
  | 'hint'
  | 'error'
  | 'positioner'
  | 'content'
  | 'area'
  | 'areaBackground'
  | 'areaThumb'
  | 'channelSlider'
  | 'channelSliderTrack'
  | 'channelSliderThumb'
  | 'transparencyGrid'
  | 'row'
  | 'formatSelect'
  | 'eyeDropperTrigger'
  | 'swatchGroup'
  | 'swatchTrigger';

/**
 * Props for the ColorPicker component (design-system manifest `ColorPicker`, #53).
 *
 * Bind the color with `v-model` (text in the current format) and the popover
 * with `v-model:open`. `class` goes to the root; every other attribute
 * (`name`, `id`, `aria-*`, listeners) goes to the text value.
 */
export interface ColorPickerProps {
  /** The color as text in any format, bound with `v-model`; reported in the current format. */
  modelValue?: string;
  /** The text format. The format select switches it. @defaultValue `'hex'` */
  format?: ColorTextFormat;
  /** Offers opacity. Off keeps every value opaque. @defaultValue `true` */
  alpha?: boolean;
  /** Preset colors as text, shown in the popover. */
  swatches?: string[];
  /** Control height, matching Input. @defaultValue `'md'` */
  size?: ColorPickerSize;
  /** The visible label, linked to the text value. */
  label?: string;
  /** Help text under the field, linked with `aria-describedby`. */
  hint?: string;
  /** Validation message. Marks the field invalid and is linked with `aria-describedby`. */
  error?: string;
  /** Marks the field invalid without a message. @defaultValue `false` */
  invalid?: boolean;
  /** Disables the field and the popover's controls. @defaultValue `false` */
  disabled?: boolean;
  /** Marks the field required and shows the required mark. @defaultValue `false` */
  required?: boolean;
  /** Whether the popover is open, bound with `v-model:open`. @defaultValue `false` */
  open?: boolean;
  /** Renders the popover at the end of the body (Teleport). @defaultValue `true` */
  portal?: boolean;
  /** The swatch button's and the popover's name. @defaultValue `'Choose a color'` */
  triggerLabel?: string;
  /** The area's name. @defaultValue `'Saturation and brightness'` */
  areaLabel?: string;
  /** The hue slider's name. @defaultValue `'Hue'` */
  hueLabel?: string;
  /** The opacity slider's name. @defaultValue `'Opacity'` */
  alphaLabel?: string;
  /** The format select's name. @defaultValue `'Format'` */
  formatLabel?: string;
  /** The eyedropper's name. @defaultValue `'Pick a color from the screen'` */
  eyeDropperLabel?: string;
  /** The preset group's name. @defaultValue `'Swatches'` */
  swatchesLabel?: string;
  /** Extra classes per part, such as `{ trigger: '…' }`. */
  classes?: Partial<Record<ColorPickerPart, string>>;
}

/** The ColorPicker's events. */
export interface ColorPickerEmits {
  /** The color changed (`v-model`), as text in the current format. */
  'update:modelValue': [value: string];
  /** The popover opened or closed itself (`v-model:open`). */
  'update:open': [open: boolean];
  /** The format select changed the format. */
  'format-change': [format: ColorTextFormat];
}
