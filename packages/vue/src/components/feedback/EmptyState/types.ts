/**
 * Props for the EmptyState component.
 *
 * A placeholder component shown when a list, table, or section has no
 * content to display.
 */
export interface EmptyStateProps {
  /** Heading text rendered inside the heading element. */
  heading?: string;
  /** HTML element to render the heading as. @defaultValue `'h3'` */
  headingAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  /** Descriptive message displayed below the heading. */
  description?: string;
  /** Additional CSS classes. */
  className?: string;
}
