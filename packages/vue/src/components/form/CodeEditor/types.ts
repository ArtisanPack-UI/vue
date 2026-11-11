import type { CodeDiagnostic, CodeEditorTranslations } from '@artisanpack-ui/behavior';

export type { CodeDiagnostic, CodeEditorTranslations };

/** A tab or language option: a string, or `{ value, label }`. */
export type CodeEditorOption = string | { value: string; label?: string };

/** The parts of a CodeEditor that accept extra classes. */
export type CodeEditorPart =
  | 'root'
  | 'label'
  | 'required'
  | 'box'
  | 'header'
  | 'tabs'
  | 'tab'
  | 'languageSelect'
  | 'body'
  | 'gutter'
  | 'line'
  | 'control'
  | 'diagnostics'
  | 'diagnostic'
  | 'status'
  | 'hint'
  | 'error';

/**
 * Props for the CodeEditor component (design-system manifest `CodeEditor`, #53).
 *
 * Bind the code with `v-model`. `class` goes to the root; every other
 * attribute (`name`, `aria-*`, listeners) goes to the native `<textarea>`.
 */
export interface CodeEditorProps {
  /** The language, shown in the status bar and selected in the language select. */
  language?: string;
  /** Options for the language select. The select renders when there are any. */
  languages?: CodeEditorOption[];
  /** File tabs over the code. */
  tabs?: CodeEditorOption[];
  /** The selected tab's value. Defaults to the first tab. */
  tab?: string;
  /** Problems marked in the gutter and listed in text under the code. */
  diagnostics?: CodeDiagnostic[];
  /** Spaces Tab inserts. @defaultValue `2` */
  tabSize?: number;
  /** The fewest lines shown; the editor grows with its content. @defaultValue `12` */
  rows?: number;
  /** The visible label, linked to the control. */
  label?: string;
  /** Help text under the editor. */
  hint?: string;
  /** Validation message. Marks the field invalid. */
  error?: string;
  /** Marks the field invalid without a message. @defaultValue `false` */
  invalid?: boolean;
  /** Disables the control. @defaultValue `false` */
  disabled?: boolean;
  /** Makes the code read-only. @defaultValue `false` */
  readonly?: boolean;
  /** Marks the field required and shows the required mark. @defaultValue `false` */
  required?: boolean;
  /** Placeholder text. Never a replacement for the label. */
  placeholder?: string;
  /** The code. Bound with `v-model`. */
  modelValue?: string;
  /** The file tablist's accessible name. @defaultValue `'Open files'` */
  tabsLabel?: string;
  /** The language select's accessible name. @defaultValue `'Language'` */
  languageLabel?: string;
  /** The caret position in the status bar; :line and :column are numbers. @defaultValue `'Ln :line, Col :column'` */
  positionLabel?: string;
  /** The indentation in the status bar; :count is tabSize. @defaultValue `'Spaces: :count'` */
  spacesLabel?: string;
  /** The status bar's count for one error. @defaultValue `':count error'` */
  errorCountLabel?: string;
  /** The status bar's error count; :count is the number. @defaultValue `':count errors'` */
  errorsCountLabel?: string;
  /** The status bar's count for one warning. @defaultValue `':count warning'` */
  warningCountLabel?: string;
  /** The status bar's warning count; :count is the number. @defaultValue `':count warnings'` */
  warningsCountLabel?: string;
  /** The diagnostics list's accessible name. @defaultValue `'Problems'` */
  problemsLabel?: string;
  /** A diagnostic's line; :line is the number. @defaultValue `'Line :line'` */
  lineLabel?: string;
  /** The visually hidden severity name of an error. @defaultValue `'Error'` */
  severityErrorLabel?: string;
  /** The visually hidden severity name of a warning. @defaultValue `'Warning'` */
  severityWarningLabel?: string;
  /** The visually hidden severity name of an info diagnostic. @defaultValue `'Info'` */
  severityInfoLabel?: string;
  /** The visually hidden keyboard instructions linked to the control. @defaultValue `'Tab inserts indentation. To leave the editor, press Escape, then Tab.'` */
  instructionsLabel?: string;
  /** Extra classes per part. */
  classes?: Partial<Record<CodeEditorPart, string>>;
}

/** The events of the CodeEditor component. */
export interface CodeEditorEmits {
  /** The code changed. */
  'update:modelValue': [value: string];
  /** A tab was selected: swap the value for that file. */
  'tab-change': [value: string];
  /** A language was chosen in the select. */
  'language-change': [value: string];
}
