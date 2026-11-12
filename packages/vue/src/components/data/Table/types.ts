import type { PaginationProps } from '../../navigation/Pagination/types';

/** A row key: what `keyBy` reads from each row. */
export type TableKey = string | number;

/** The parts of a Table that accept extra classes. */
export type TablePart =
  | 'root'
  | 'toolbar'
  | 'title'
  | 'scroll'
  | 'table'
  | 'headCell'
  | 'sort'
  | 'row'
  | 'cell'
  | 'select'
  | 'expandTrigger'
  | 'expansion'
  | 'primary'
  | 'secondary'
  | 'footer';

/** The table's sort. */
export interface TableSort {
  /** The column key. */
  column: string;
  /** The order. */
  direction: 'asc' | 'desc';
}

/** @deprecated Use {@link TableSort}; `key` is now `column`. */
export type SortState = SortState1x;

/** A column of a Table. */
export interface TableColumn {
  /** Dot path to the row value, such as `'user.name'`. */
  key: string;
  /** The header label. @defaultValue the key */
  label?: string;
  /** Makes the header a sort button with `aria-sort`. */
  sortable?: boolean;
  /** End-aligns the column with tabular figures. */
  numeric?: boolean;
  /** Leaves the column out. */
  hidden?: boolean;
  /** A second dot path, shown muted under the value. */
  secondary?: string;
  /** Extra classes for the header cell. */
  class?: string;
  /** @deprecated 1.x: use `class`. */
  className?: string;
  /** @deprecated 1.x: `'right'` end-aligns like `numeric`; others are ignored. */
  align?: 'left' | 'center' | 'right';
  /** @deprecated 1.x: ignored; size columns with `class`. */
  width?: string;
}

/**
 * Props for the Table component (design-system manifest `Table`, #62).
 *
 * Emits `update:modelValue` with the selected keys (`v-model`), `sort-change`
 * and `update:sortBy` (`v-model:sort-by`), `expanded-change` and
 * `update:expanded` (`v-model:expanded`), and `row-click` with the row.
 * Slots: `title`, `toolbar`, `footer`, `empty`, and the scoped `cell`,
 * `cell-<key>`, `header-<key>`, `actions` and `expansion`. `class` and every
 * other attribute go to the root.
 */
export interface TableProps {
  /** The columns, in order. Required; the 1.x `columns` still works. */
  headers?: TableColumn[];
  /** The rows. */
  rows: Record<string, unknown>[];
  /** Dot path to each row's unique key. @defaultValue `'id'` */
  keyBy?: string;
  /** The toolbar title; it names the table unless `label` is set. A `title` slot overrides it. */
  title?: string;
  /** The table's accessible name, instead of the title. Translate it. */
  label?: string;
  /** Row height, padding and type size. Unset follows the page's density. */
  density?: 'compact' | 'default' | 'comfortable';
  /** `glass` puts the table on a translucent surface. @defaultValue `'default'` */
  surface?: 'default' | 'glass';
  /** Keeps the header row in view while the rows scroll. @defaultValue `true` */
  stickyHeader?: boolean;
  /** Hides the header row visually; screen readers still announce it. @defaultValue `false` */
  hideHeaders?: boolean;
  /** Adds row checkboxes and a select-all box. @defaultValue `false` */
  selectable?: boolean;
  /** The selected keys (`v-model`). Uncontrolled when unset. */
  modelValue?: TableKey[];
  /** Adds an expand button to each row. @defaultValue `false` */
  expandable?: boolean;
  /** The expanded keys (`v-model:expanded`). Uncontrolled when unset. */
  expanded?: TableKey[];
  /** The current sort (`v-model:sort-by`); the sorted header carries `aria-sort`. */
  sortBy?: TableSort;
  /** Shows skeleton rows and sets `aria-busy`. @defaultValue `false` */
  loading?: boolean;
  /** The empty state's title; translate it. @defaultValue `'No records found.'` */
  emptyText?: string;
  /** Toolbar content after the title. A `toolbar` slot overrides it. */
  toolbar?: string;
  /** Footer content at the start. A `footer` slot overrides it. */
  footer?: string;
  /** Pagination's props, rendered at the end of the footer; `onPageChange` listens. */
  pagination?: PaginationProps & { onPageChange?: (page: number) => void };
  /** The select-all box's name; translate it. @defaultValue `'Select all'` */
  selectAllLabel?: string;
  /** Each row box's name, with `{row}`; translate it. @defaultValue `'Select {row}'` */
  selectRowLabel?: string;
  /** Each sort button's name, with `{column}`; translate it. @defaultValue `'Sort by {column}'` */
  sortLabel?: string;
  /** Each expand button's name, with `{row}`; translate it. @defaultValue `'Show details for {row}'` */
  expandLabel?: string;
  /** The actions column's hidden header; translate it. @defaultValue `'Actions'` */
  actionsLabel?: string;
  /** Extra classes per part, such as `{ cell: '…', headCell: '…' }`. */
  classes?: Partial<Record<TablePart, string>>;
  /** @deprecated 1.x: use `headers`. */
  columns?: TableColumn[];
  /** @deprecated 1.x: use `class`. */
  className?: string;
  /** @deprecated 1.x: use `density="compact"`. */
  compact?: boolean;
  /** @deprecated 1.x: use `emptyText`. */
  emptyMessage?: string;
  /** @deprecated 1.x: use `sortBy`; `{ key, direction }`. Emits `sort` as before. */
  sort?: SortState1x;
  /** @deprecated 1.x: no longer drawn; use a Badge for status. Ignored. */
  striped?: boolean;
  /** @deprecated 1.x: rows always tint on hover. Ignored. */
  hoverable?: boolean;
  /** @deprecated 1.x: use `stickyHeader`. Ignored. */
  pinRows?: boolean;
  /** @deprecated 1.x: ignored. */
  pinCols?: boolean;
}

/** The 1.x sort shape. */
export interface SortState1x {
  key: string;
  direction: 'asc' | 'desc';
}
