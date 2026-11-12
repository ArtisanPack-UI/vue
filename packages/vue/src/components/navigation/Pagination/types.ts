/** The parts of a Pagination that accept extra classes. */
export type PaginationPart = 'root' | 'summary' | 'previous' | 'page' | 'ellipsis' | 'next';

/**
 * Props for the Pagination component (design-system manifest `Pagination`, #56).
 *
 * Emits `page-change` with the chosen page, and `update:page` for
 * `v-model:page`. `class` and every other attribute go to the root.
 */
export interface PaginationProps {
  /** The current page, from 1. Clamped to the page count. @defaultValue `1` */
  page?: number;
  /** How many pages there are. Without it, `total / perPage`. */
  pageCount?: number;
  /** How many items the whole list has. */
  total?: number;
  /** How many items a page holds. @defaultValue `10` */
  perPage?: number;
  /** Pages shown on each side of the current one. @defaultValue `1` */
  siblings?: number;
  /** Shows the summary before the pages. @defaultValue `false` */
  summary?: boolean;
  /** The nav landmark's accessible name; translate it. @defaultValue `'Pagination'` */
  label?: string;
  /** The previous button's accessible name; translate it. @defaultValue `'Previous page'` */
  previousLabel?: string;
  /** The next button's accessible name; translate it. @defaultValue `'Next page'` */
  nextLabel?: string;
  /** Each page's accessible name, with `{page}`; translate it. @defaultValue `'Page {page}'` */
  pageLabel?: string;
  /**
   * The summary, with `{from}`, `{to}`, `{total}`, `{page}` and `{pageCount}`.
   * @defaultValue `'Showing {from}–{to} of {total}'`, or `'Page {page} of {pageCount}'` without a total
   */
  summaryLabel?: string;
  /** Extra classes per part, such as `{ page: '…', summary: '…' }`. */
  classes?: Partial<Record<PaginationPart, string>>;
}
