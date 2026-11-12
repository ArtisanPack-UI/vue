/** One column or the two versions side by side. Emitted as `data-view`. */
export type DiffView = 'unified' | 'split';

/** The parts of a Diff that accept extra classes. */
export type DiffPart =
  | 'root'
  | 'header'
  | 'icon'
  | 'file'
  | 'counts'
  | 'actions'
  | 'table'
  | 'hunk'
  | 'line'
  | 'lineNumber'
  | 'sign'
  | 'code'
  | 'ins'
  | 'del';

/**
 * Props for the Diff component (design-system manifest `Diff`, #61).
 *
 * The `actions` slot overrides the same-named prop. `class` and every other
 * attribute go to the root.
 */
export interface DiffProps {
  /** The earlier version. */
  oldContent?: string;
  /** The later version. */
  newContent?: string;
  /** What changed, at the start of the header. */
  fileName?: string;
  /** One column, or the versions side by side. @defaultValue `'unified'` */
  view?: DiffView;
  /** Marks the changed words inside a changed line. @defaultValue `true` */
  wordLevel?: boolean;
  /** Unchanged lines kept around each change. @defaultValue `3` */
  context?: number;
  /**
   * The counts' text for assistive technology; `{additions}` and
   * `{deletions}` are filled in. Translate it.
   * @defaultValue `'{additions} additions, {deletions} deletions'`
   */
  countsLabel?: string;
  /** Shown when the versions are the same; translate it. @defaultValue `'No changes'` */
  emptyLabel?: string;
  /** Header controls. Usually the `actions` slot. */
  actions?: string;
  /** Extra classes per part. */
  classes?: Partial<Record<DiffPart, string>>;
}

/** A cell's sign: + for an addition, − for a deletion, a space otherwise. @internal */
export const DIFF_SIGNS: Record<string, string> = { add: '+', del: '−', ctx: ' ', empty: '' };
