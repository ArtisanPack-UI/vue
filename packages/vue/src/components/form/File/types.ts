/** A listed file that isn't a browser `File`: a stored or uploading file. */
export interface FileEntry {
  /** The file name. */
  name: string;
  /** The size in bytes. */
  size?: number;
  /** Upload progress, 0 to 100. Shows a progress bar. */
  progress?: number;
  /** An error for this file. Marks its row and replaces the size. */
  error?: string;
}

/** One listed file: a browser `File` or an entry. */
export type FileItem = globalThis.File | FileEntry;

/** The parts of a File that accept extra classes. */
export type FilePart =
  | 'root'
  | 'label'
  | 'required'
  | 'dropzone'
  | 'control'
  | 'icon'
  | 'title'
  | 'hint'
  | 'list'
  | 'item'
  | 'thumb'
  | 'name'
  | 'meta'
  | 'progress'
  | 'actions'
  | 'error';

/**
 * Props for the File component (design-system manifest `File`, #53).
 *
 * Bind the files with `v-model`. `class` goes to the root; every other
 * attribute (`name`, `id`, `capture`, `aria-*`, listeners) goes to the
 * native file input.
 */
export interface FileProps {
  /** The visible label, for the input. Without it, the title names the input. */
  label?: string;
  /** The drop zone's main line. @defaultValue `'Drop files here or browse'` */
  title?: string;
  /** The limits under the title, linked with `aria-describedby`. */
  hint?: string;
  /** Validation message. Marks the field invalid and is linked with `aria-describedby`. */
  error?: string;
  /** Marks the field invalid without a message. @defaultValue `false` */
  invalid?: boolean;
  /** Disables the input. @defaultValue `false` */
  disabled?: boolean;
  /** Marks the field required and shows the required mark. @defaultValue `false` */
  required?: boolean;
  /** The accepted types. */
  accept?: string;
  /** Allows several files. @defaultValue `false` */
  multiple?: boolean;
  /** The largest file in bytes, emitted as `data-max-size`. Validate on `update:modelValue`. */
  maxSize?: number;
  /** A large centered drop zone, or a compact row. @defaultValue `'dropzone'` */
  variant?: 'dropzone' | 'compact';
  /** The files to list, bound with `v-model`. Without it, the chosen files are listed. */
  modelValue?: FileItem[];
  /** The remove buttons' name, with `:name`. @defaultValue `'Remove :name'` */
  removeLabel?: string;
  /** Extra classes per part, such as `{ dropzone: '…' }`. */
  classes?: Partial<Record<FilePart, string>>;
}
