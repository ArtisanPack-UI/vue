import type { Size } from '@artisanpack-ui/tokens';

/**
 * Props for the Pagination component.
 *
 * Page navigation with numbered pages, previous/next buttons,
 * and configurable sibling page count.
 */
export interface PaginationProps {
  /** Current active page number (1-based). */
  currentPage: number;
  /** Total number of pages. */
  totalPages: number;
  /** Number of sibling pages to show on each side of the current page. @defaultValue `1` */
  siblingCount?: number;
  /** DaisyUI size modifier for the pagination buttons. */
  size?: Size;
  /** Additional CSS classes for the pagination container. */
  className?: string;
}
