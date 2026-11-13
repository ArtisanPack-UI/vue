/** The parts of an ErrorState that accept extra classes. */
export type ErrorStatePart =
  | 'root'
  | 'icon'
  | 'numeral'
  | 'title'
  | 'description'
  | 'code'
  | 'actions';

/**
 * Props for the ErrorState component (design-system manifest `ErrorState`, #60).
 *
 * Explains what failed, what's safe and how to recover, in place of content
 * that couldn't load. It is `role="alert"`. The `icon`, `title`,
 * `description` and `actions` slots override the same-named props; the
 * default slot fills the description. `class` and every other attribute go
 * to the root. Not to be confused with ValidationSummary, which lists form
 * errors.
 */
export interface ErrorStateProps {
  /** What failed. Picks the tile's tint and default icon; `not-found` shows 404. @defaultValue `'request'` */
  variant?: 'request' | 'offline' | 'not-found' | 'forbidden';
  /** `md` for a page or card, `sm` for a panel. @defaultValue `'md'` */
  size?: 'sm' | 'md';
  /** Centered, or aligned to the start. @defaultValue `'center'` */
  align?: 'center' | 'start';
  /** An icon name from the registry. Defaults to the variant's (server-crash, wifi-off, lock). */
  icon?: string;
  /** A large status number, such as 404 or 503, in place of the default icon. */
  numeral?: string;
  /** What failed, as a heading. */
  title?: string;
  /** What's safe and what to do. The default slot fills it too. */
  description?: string;
  /** A reference people can quote to support. */
  code?: string;
  /** Content for the actions row, usually the `actions` slot. */
  actions?: string;
  /** The title's heading level, 1 to 6. @defaultValue `3` */
  headingLevel?: number;
  /** Moves focus to the title when it renders, for a full-page error. @defaultValue `false` */
  focusTitle?: boolean;
  /** Extra classes per part, such as `{ title: '…', code: '…' }`. */
  classes?: Partial<Record<ErrorStatePart, string>>;
}
