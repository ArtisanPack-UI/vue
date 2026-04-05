/**
 * Props for the ErrorDisplay component.
 *
 * Displays a user-friendly error state with an optional icon, title,
 * message, and retry action.
 */
export interface ErrorDisplayProps {
  /** Error title displayed as a heading. @defaultValue `'Something went wrong'` */
  title?: string;
  /** Descriptive error message displayed below the title. */
  message?: string;
  /** When true, renders a retry button. @defaultValue `false` */
  retryable?: boolean;
  /** Custom label for the retry button. @defaultValue `'Try again'` */
  retryLabel?: string;
  /** Additional CSS classes. */
  className?: string;
}
