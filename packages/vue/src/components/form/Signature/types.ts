import type { SignatureMode, SignatureTranslations } from '@artisanpack-ui/behavior';

export type { SignatureMode, SignatureTranslations };

/** The ink color of a Signature. Emitted as `data-pen-color`. */
export type SignaturePenColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/** The parts of a Signature that accept extra classes. */
export type SignaturePart =
  | 'root'
  | 'label'
  | 'required'
  | 'modes'
  | 'mode'
  | 'pad'
  | 'line'
  | 'mark'
  | 'ink'
  | 'typed'
  | 'upload'
  | 'tools'
  | 'undo'
  | 'clear'
  | 'placeholder'
  | 'hint'
  | 'error';

/**
 * Props for the Signature component (design-system manifest `Signature`, #53).
 *
 * Bind the value, a PNG data URL, with `v-model`. `class` and other
 * attributes go to the root; `name` goes to a hidden input so plain forms
 * submit the value.
 */
export interface SignatureProps {
  /** The mode shown first. @defaultValue `'draw'` */
  mode?: SignatureMode;
  /** The modes offered. `type` is always added: it's the keyboard path. */
  modes?: SignatureMode[];
  /** The ink color. @defaultValue `'default'` */
  penColor?: SignaturePenColor;
  /** The visible label. It names the group. */
  label?: string;
  /** Help text under the pad, such as who is signing and the date. */
  hint?: string;
  /** Validation message. Marks the field invalid. */
  error?: string;
  /** Marks the field invalid without a message. @defaultValue `false` */
  invalid?: boolean;
  /** Disables drawing, typing, uploading and the tools. @defaultValue `false` */
  disabled?: boolean;
  /** Marks the field required and shows the required mark. @defaultValue `false` */
  required?: boolean;
  /** The text under the signing line. @defaultValue `'Sign above the line'` */
  placeholder?: string;
  /** The signature as a PNG data URL, or `''`. Bound with `v-model`. */
  modelValue?: string;
  /** The mode switch group's accessible name. @defaultValue `'Signature method'` */
  modesLabel?: string;
  /** The draw mode button. @defaultValue `'Draw'` */
  drawLabel?: string;
  /** The type mode button. @defaultValue `'Type'` */
  typeLabel?: string;
  /** The upload mode button. @defaultValue `'Upload'` */
  uploadLabel?: string;
  /** The canvas's accessible name. @defaultValue `'Signature pad. Draw with a mouse, finger or stylus, or choose Type.'` */
  padLabel?: string;
  /** The typed-name input's accessible name. @defaultValue `'Type your full name'` */
  typedLabel?: string;
  /** The upload trigger's text. @defaultValue `'Choose an image'` */
  uploadTriggerLabel?: string;
  /** The icon-only undo button's accessible name. @defaultValue `'Undo stroke'` */
  undoLabel?: string;
  /** The clear button's text. @defaultValue `'Clear'` */
  clearLabel?: string;
  /** Announced in the live region after clearing. @defaultValue `'Signature cleared.'` */
  clearedLabel?: string;
  /** Extra classes per part. */
  classes?: Partial<Record<SignaturePart, string>>;
}

/** The events of the Signature component. */
export interface SignatureEmits {
  /** The signature changed: a PNG data URL, or `''` once cleared. */
  'update:modelValue': [value: string];
}
