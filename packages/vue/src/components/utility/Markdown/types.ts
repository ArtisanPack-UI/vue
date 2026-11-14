import type { MarkdownMode } from '@artisanpack-ui/behavior';

export type { MarkdownMode };

/** The parts of a Markdown that accept extra classes. */
export type MarkdownPart = 'root' | 'editor' | 'preview' | 'split';

/**
 * Props for the Markdown component (design-system manifest `Markdown`, #65).
 *
 * `class` and every other attribute go to the root.
 */
export interface MarkdownProps {
  /** The Markdown. In write and split modes, the Textarea's value; bind it with `v-model:source`. */
  source?: string;
  /** @deprecated Use `source`. The 2.x name, still accepted. */
  content?: string;
  /**
   * `preview` renders the Markdown only; `write` and `split` add Write,
   * Preview and Split tabs over the source, opening on that tab. Emitted as
   * `data-mode`. @defaultValue `'preview'`
   */
  mode?: MarkdownMode;
  /**
   * Escape raw HTML (the default). `false` keeps the allowlisted formatting
   * tags with safe attributes and escapes every other tag; script-capable
   * markup never renders. @defaultValue `true`
   */
  sanitize?: boolean;
  /** Names the mode tabs; translate it. @defaultValue `'Markdown mode'` */
  tabsLabel?: string;
  /** The Write tab; translate it. @defaultValue `'Write'` */
  writeLabel?: string;
  /** The Preview tab; translate it. @defaultValue `'Preview'` */
  previewLabel?: string;
  /** The Split tab; translate it. @defaultValue `'Split'` */
  splitLabel?: string;
  /** Names the source Textarea; translate it. @defaultValue `'Markdown source'` */
  editorLabel?: string;
  /** Names the preview region in write and split modes; translate it. @defaultValue `'Rendered preview'` */
  outputLabel?: string;
  /** Extra classes per part. */
  classes?: Partial<Record<MarkdownPart, string>>;
}

/** Events of the Markdown component. */
export interface MarkdownEmits {
  /** The source was edited in the Textarea. */
  'source-change': [source: string];
  /** The same, for `v-model:source`. */
  'update:source': [source: string];
}
