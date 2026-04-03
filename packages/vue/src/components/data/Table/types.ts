/**
 * A column definition for the Table component.
 */
export interface TableColumn {
  /** Unique key matching the row data property. */
  key: string;
  /** Display label for the column header. */
  label: string;
  /** Whether this column is sortable. @defaultValue `false` */
  sortable?: boolean;
  /** Alignment of the column content. @defaultValue `'left'` */
  align?: 'left' | 'center' | 'right';
  /** Fixed width for the column (CSS value). */
  width?: string;
  /** Additional CSS classes for the column cells. */
  className?: string;
}

/**
 * Sort state for the Table component.
 */
export interface SortState {
  /** Column key being sorted. */
  key: string;
  /** Sort direction. */
  direction: 'asc' | 'desc';
}

/**
 * Props for the Table component.
 *
 * A data table with headers, rows, sorting, and custom cell rendering via scoped slots.
 */
export interface TableProps {
  /** Column definitions. */
  columns: TableColumn[];
  /** Array of row data objects. */
  rows: Record<string, unknown>[];
  /** When true, adds zebra striping to rows. @defaultValue `false` */
  striped?: boolean;
  /** When true, makes the table compact. @defaultValue `false` */
  compact?: boolean;
  /** When true, adds hover highlighting to rows. @defaultValue `false` */
  hoverable?: boolean;
  /** When true, pins the header row. @defaultValue `false` */
  pinRows?: boolean;
  /** When true, pins the first column. @defaultValue `false` */
  pinCols?: boolean;
  /** Current sort state. */
  sort?: SortState;
  /** When true, shows a loading state. @defaultValue `false` */
  loading?: boolean;
  /** Message to display when there are no rows. @defaultValue `'No data available'` */
  emptyMessage?: string;
  /** Additional CSS classes. */
  className?: string;
}
