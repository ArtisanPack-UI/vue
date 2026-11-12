/**
 * @module form
 *
 * Form components for the ArtisanPack UI Vue component library.
 * Provides a comprehensive set of form inputs and controls built on DaisyUI
 * with consistent styling, accessibility, and error handling patterns.
 *
 * @example
 * ```vue
 * import { Button, Input, Select, Toggle } from '@artisanpack-ui/vue';
 * ```
 */

// Form components
export { default as Button } from './Button/Button.vue';
export type {
  ButtonColor,
  ButtonPart,
  ButtonProps,
  ButtonSize,
  ButtonVariant,
} from './Button/types';

export { default as Checkbox } from './Checkbox/Checkbox.vue';
export type { CheckboxPart, CheckboxProps } from './Checkbox/types';

export { default as CheckboxGroup } from './CheckboxGroup/CheckboxGroup.vue';
export type {
  CheckboxGroupOption,
  CheckboxGroupPart,
  CheckboxGroupProps,
} from './CheckboxGroup/types';

export { default as Combobox } from './Combobox/Combobox.vue';
export type {
  ComboboxColor,
  ComboboxOption,
  ComboboxOptionObject,
  ComboboxPart,
  ComboboxProps,
  ComboboxSize,
  ComboboxSlotOption,
  ComboboxValue,
} from './Combobox/types';

export { default as ColorPicker } from './ColorPicker/ColorPicker.vue';
export type {
  ColorPickerEmits,
  ColorPickerPart,
  ColorPickerProps,
  ColorPickerSize,
  ColorTextFormat,
} from './ColorPicker/types';

export { default as DatePicker } from './DatePicker/DatePicker.vue';
export type {
  DatePickerEmits,
  DatePickerMode,
  DatePickerPart,
  DatePickerProps,
  DatePickerSize,
  DatePickerValue,
} from './DatePicker/types';

export { default as CodeEditor } from './CodeEditor/CodeEditor.vue';
export type {
  CodeDiagnostic,
  CodeEditorEmits,
  CodeEditorOption,
  CodeEditorPart,
  CodeEditorProps,
  CodeEditorTranslations,
} from './CodeEditor/types';

/** @deprecated Use `CodeEditor` (#53). `Editor` is removed in a later major release. */
export { default as Editor } from './Editor/Editor.vue';
export type { EditorProps } from './Editor/types';

export { default as File } from './File/File.vue';
/**
 * @deprecated Use `File` (vocabulary decision 5). `FileUpload` is an alias of
 * the new `File` and takes its API: the 2.x `filesSelected` event and the
 * `withDragDrop`, `dragDropText`, `dragDropClass`, `progress` and
 * `hideProgress` props are gone (bind `v-model`, and pass progress per file
 * in the entries). The alias is removed in a later major release.
 */
export { default as FileUpload } from './File/File.vue';
export type { FileEntry, FileItem, FilePart, FileProps } from './File/types';

export { default as Input } from './Input/Input.vue';
export type { InputEmits, InputPart, InputProps, InputSize } from './Input/types';

export { default as Password } from './Password/Password.vue';
export type {
  PasswordEmits,
  PasswordLabels,
  PasswordPart,
  PasswordProps,
  PasswordRequirement,
  PasswordSize,
} from './Password/types';

export { default as Pin } from './Pin/Pin.vue';
export type { PinEmits, PinPart, PinProps, PinSize, PinType } from './Pin/types';

/** @deprecated Use `RadioGroup`. `Radio` is removed in a later major release. */
export { default as Radio } from './Radio/Radio.vue';
export type { RadioProps, RadioOption } from './Radio/types';

export { default as RadioGroup } from './RadioGroup/RadioGroup.vue';
export type {
  RadioGroupOption,
  RadioGroupOrientation,
  RadioGroupPart,
  RadioGroupProps,
  RadioGroupVariant,
} from './RadioGroup/types';

export { default as Range } from './Range/Range.vue';
export type {
  RangeColor,
  RangeEmits,
  RangeMark,
  RangePart,
  RangeProps,
  RangeShowValue,
  RangeSize,
  RangeValue,
} from './Range/types';

export { default as Rating } from './Rating/Rating.vue';
export type { RatingPart, RatingProps, RatingSize } from './Rating/types';

export { default as RichTextEditor } from './RichTextEditor/RichTextEditor.vue';
export type {
  RichTextEditorEmits,
  RichTextEditorPart,
  RichTextEditorProps,
  RichTextOutput,
  RichTextToolbarItem,
  RichTextTranslations,
} from './RichTextEditor/types';

export { default as Select } from './Select/Select.vue';
export type {
  SelectOption,
  SelectOptionObject,
  SelectOptionGroup,
  SelectPart,
  SelectProps,
  SelectSize,
} from './Select/types';

export { default as Signature } from './Signature/Signature.vue';
export type {
  SignatureEmits,
  SignatureMode,
  SignaturePart,
  SignaturePenColor,
  SignatureProps,
  SignatureTranslations,
} from './Signature/types';

export { default as Textarea } from './Textarea/Textarea.vue';
export type { TextareaEmits, TextareaPart, TextareaProps } from './Textarea/types';

export { default as Toggle } from './Toggle/Toggle.vue';
export type { ToggleColor, ToggleEmits, TogglePart, ToggleProps, ToggleSize } from './Toggle/types';

export { default as Fieldset } from './Fieldset/Fieldset.vue';
export type { FieldsetPart, FieldsetProps, FieldsetVariant } from './Fieldset/types';

export { default as Form } from './Form/Form.vue';
export type { FormPart, FormProps } from './Form/types';

export { default as ValidationSummary } from './ValidationSummary/ValidationSummary.vue';
export type {
  ValidationSummaryColor,
  ValidationSummaryError,
  ValidationSummaryErrors,
  ValidationSummaryPart,
  ValidationSummaryProps,
} from './ValidationSummary/types';
