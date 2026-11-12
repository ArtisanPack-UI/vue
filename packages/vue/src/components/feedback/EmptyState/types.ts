/** The parts of an EmptyState that accept extra classes. */
export type EmptyStatePart = 'root' | 'icon' | 'title' | 'description' | 'actions';

/**
 * Props for the EmptyState component (design-system manifest `EmptyState`, #60).
 *
 * Explains why there's nothing here and what to do next. The `icon`,
 * `title`, `description` and `actions` slots override the same-named props;
 * the default slot fills the description. `class` and every other attribute
 * go to the root.
 */
export interface EmptyStateProps {
  /** Why it's empty. Picks the tile's tint and default icon. @defaultValue `'first-use'` */
  variant?: 'first-use' | 'no-results' | 'cleared';
  /** `md` for a page or card, `sm` for a panel. @defaultValue `'md'` */
  size?: 'sm' | 'md';
  /** Centered, or aligned to the start. @defaultValue `'center'` */
  align?: 'center' | 'start';
  /** An icon name from the registry. Defaults to the variant's: inbox, search-x or circle-check. */
  icon?: string;
  /** Why it's empty, as a heading. */
  title?: string;
  /** What to do next. The default slot fills it too. */
  description?: string;
  /** Content for the actions row, usually the `actions` slot. */
  actions?: string;
  /** The title's heading level, 2 to 6. @defaultValue `3` */
  headingLevel?: number;
  /** Extra classes per part, such as `{ title: '…', actions: '…' }`. */
  classes?: Partial<Record<EmptyStatePart, string>>;
}
