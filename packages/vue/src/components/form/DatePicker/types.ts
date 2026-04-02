/**
 * Props for the DatePicker component.
 *
 * Uses native HTML date inputs for cross-browser date selection.
 */
export interface DatePickerProps {
  /** Text label displayed above the date picker. Hidden when `inline` is true. */
  label?: string;
  /** Helper text displayed below the date picker. Hidden when `error` is present. */
  hint?: string;
  /** Error message displayed below the picker. Replaces `hint` when present. */
  error?: string;
  /** When true, renders the label as a floating/inline label inside the input wrapper. @defaultValue `false` */
  inline?: boolean;
  /** The native HTML input type for date/time selection. @defaultValue `'date'` */
  dateType?: 'date' | 'datetime-local' | 'time' | 'month' | 'week';
  /** Custom id for the input element. */
  id?: string;
  /** Whether the field is required. */
  required?: boolean;
  /** Minimum date/time value. */
  min?: string;
  /** Maximum date/time value. */
  max?: string;
  /** Whether the field is disabled. */
  disabled?: boolean;
}
