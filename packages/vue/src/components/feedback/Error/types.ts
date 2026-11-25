/**
 * Props for the deprecated ErrorDisplay component.
 *
 * @deprecated Use `ErrorState` (#60). ErrorDisplay renders an ErrorState:
 * `message` becomes its description and `retryable` adds a Try again button
 * to its actions.
 */
export interface ErrorDisplayProps {
  /** Error title displayed as a heading. @defaultValue `'Something went wrong'`, translated */
  title?: string;
  /** Descriptive error message displayed below the title. */
  message?: string;
  /** When true, renders a retry button that emits `retry`. @defaultValue `false` */
  retryable?: boolean;
  /** Label for the retry button. @defaultValue `'Try again'`, translated */
  retryLabel?: string;
  /** Additional CSS classes on the root. */
  className?: string;
}
