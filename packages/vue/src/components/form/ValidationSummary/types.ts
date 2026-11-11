/** The color of a ValidationSummary. Emitted as `data-color`. */
export type ValidationSummaryColor = 'error' | 'warning';

/** One error: the field's id or name, and its message. */
export interface ValidationSummaryError {
  field: string;
  message: string;
}

/** The errors: a list, or a map of field to message(s) (the first message is shown). */
export type ValidationSummaryErrors =
  | ValidationSummaryError[]
  | Record<string, string | string[] | undefined>;

/** The parts of a ValidationSummary that accept extra classes. */
export type ValidationSummaryPart = 'root' | 'icon' | 'title' | 'list' | 'item' | 'link';

/**
 * Props for the ValidationSummary component (design-system manifest
 * `ValidationSummary`, #53).
 *
 * Lists every error in a form after a failed submit, each linked to its
 * field. Renders nothing without errors. The `title` slot overrides the
 * `title` prop.
 */
export interface ValidationSummaryProps {
  /** The errors, as `[{ field, message }]` or `{ field: message | message[] }`. */
  errors?: ValidationSummaryErrors;
  /** Error blocks the submit (an alert); warning lists recommendations (a status). @defaultValue `'error'` */
  color?: ValidationSummaryColor;
  /** The heading. Defaults to "Fix N fields" (error) or "N recommendations" (warning). */
  title?: string;
  /** Extra classes per part, such as `{ title: '…', list: '…' }`. */
  classes?: Partial<Record<ValidationSummaryPart, string>>;
}
