/**
 * Represents a single breadcrumb item.
 */
export interface BreadcrumbItem {
  /** Display label for the breadcrumb. */
  label: string;
  /** Optional URL for the breadcrumb link. The last item typically has no href. */
  href?: string;
}

/**
 * Props for the Breadcrumbs component.
 *
 * A navigation breadcrumb trail with semantic markup and ARIA navigation role.
 */
export interface BreadcrumbsProps {
  /** Array of breadcrumb items in order from root to current page. */
  items: BreadcrumbItem[];
  /** Additional CSS classes for the breadcrumb container. */
  className?: string;
}
