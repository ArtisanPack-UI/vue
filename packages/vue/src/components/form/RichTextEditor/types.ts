import type {
  RichTextCommand,
  RichTextOutput,
  RichTextToolbarItem,
  RichTextTranslations,
} from '@artisanpack-ui/behavior';

export type { RichTextCommand, RichTextOutput, RichTextToolbarItem, RichTextTranslations };

/** The parts of a RichTextEditor that accept extra classes. */
export type RichTextEditorPart =
  | 'root'
  | 'label'
  | 'required'
  | 'box'
  | 'toolbar'
  | 'button'
  | 'divider'
  | 'content'
  | 'placeholder'
  | 'footer'
  | 'count'
  | 'hint'
  | 'error';

/**
 * Props for the RichTextEditor component (design-system manifest
 * `RichTextEditor`, #53).
 *
 * Bind the value, in the `output` format, with `v-model`. It's sanitized to
 * the editor's formats before it's shown. `class` and other attributes go to
 * the root; `name` goes to a hidden input so plain forms submit the value.
 */
export interface RichTextEditorProps {
  /**
   * A preset (`default`, `compact`, `minimal`) or a list of commands and `|`
   * dividers. @defaultValue `'default'`
   */
  toolbar?: string | RichTextToolbarItem[];
  /** The format the value is read and written in. @defaultValue `'html'` */
  output?: RichTextOutput;
  /** The most characters allowed. Typing stops there; the footer counts against it. */
  maxLength?: number;
  /** Shows the footer with the word and character count. @defaultValue `false` */
  counter?: boolean;
  /** The visible label. It names the content. */
  label?: string;
  /** Help text under the editor. */
  hint?: string;
  /** Validation message. Marks the field invalid. */
  error?: string;
  /** Marks the field invalid without a message. @defaultValue `false` */
  invalid?: boolean;
  /** Disables editing and the toolbar. @defaultValue `false` */
  disabled?: boolean;
  /** Shows the content without editing it. @defaultValue `false` */
  readonly?: boolean;
  /** Marks the field required and shows the required mark. @defaultValue `false` */
  required?: boolean;
  /** Text shown while the content is empty. */
  placeholder?: string;
  /** The content in the output format. Bound with `v-model`. */
  modelValue?: string;
  /** The toolbar's accessible name. @defaultValue `'Formatting'` */
  toolbarLabel?: string;
  /** The Bold button's accessible name. @defaultValue `'Bold'` */
  boldLabel?: string;
  /** The Italic button's accessible name. @defaultValue `'Italic'` */
  italicLabel?: string;
  /** The Underline button's accessible name. @defaultValue `'Underline'` */
  underlineLabel?: string;
  /** The Strikethrough button's accessible name. @defaultValue `'Strikethrough'` */
  strikeLabel?: string;
  /** The Heading 2 button's accessible name. @defaultValue `'Heading 2'` */
  heading2Label?: string;
  /** The Heading 3 button's accessible name. @defaultValue `'Heading 3'` */
  heading3Label?: string;
  /** The bulleted list button's accessible name. @defaultValue `'Bulleted list'` */
  bulletListLabel?: string;
  /** The numbered list button's accessible name. @defaultValue `'Numbered list'` */
  orderedListLabel?: string;
  /** The Quote button's accessible name. @defaultValue `'Quote'` */
  quoteLabel?: string;
  /** The Code button's accessible name. @defaultValue `'Code'` */
  codeLabel?: string;
  /** The Link button's accessible name. @defaultValue `'Link'` */
  linkLabel?: string;
  /** The Image button's accessible name. @defaultValue `'Image'` */
  imageLabel?: string;
  /** The Undo button's accessible name. @defaultValue `'Undo'` */
  undoLabel?: string;
  /** The Redo button's accessible name. @defaultValue `'Redo'` */
  redoLabel?: string;
  /** The prompt that asks for a link URL (built-in engine). @defaultValue `'Link URL'` */
  linkPromptLabel?: string;
  /** The prompt that asks for an image URL (built-in engine). @defaultValue `'Image URL'` */
  imagePromptLabel?: string;
  /** The prompt that asks for an image description (built-in engine). @defaultValue `'Describe the image'` */
  imageAltPromptLabel?: string;
  /** The footer note about Markdown shortcuts. @defaultValue `'Markdown shortcuts on'` */
  shortcutsLabel?: string;
  /** The footer's word count for one word; :count is the number. @defaultValue `':count word'` */
  wordLabel?: string;
  /** The footer's word count; :count is the number. @defaultValue `':count words'` */
  wordsLabel?: string;
  /** The footer's character count for one character. @defaultValue `':count character'` */
  characterLabel?: string;
  /** The footer's character count; :count is the number. @defaultValue `':count characters'` */
  charactersLabel?: string;
  /** The footer's count with maxLength; :count and :max are numbers. @defaultValue `':count / :max characters'` */
  limitLabel?: string;
  /** Extra classes per part. */
  classes?: Partial<Record<RichTextEditorPart, string>>;
}

/** The events of the RichTextEditor component. */
export interface RichTextEditorEmits {
  /** The content changed, in the output format. */
  'update:modelValue': [value: string];
}
