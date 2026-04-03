import type { DaisyColor } from '@artisanpack-ui/tokens';

/**
 * A calendar event to display on a specific date.
 */
export interface CalendarEvent {
  /** Unique identifier. */
  id: string | number;
  /** Event title. */
  title: string;
  /** Date string in YYYY-MM-DD format. */
  date: string;
  /** Color indicator for the event. */
  color?: DaisyColor;
}

/**
 * Props for the Calendar component.
 *
 * A date calendar display with navigation and event markers.
 */
export interface CalendarProps {
  /** Currently displayed month (1-12). */
  month?: number;
  /** Currently displayed year. */
  year?: number;
  /** Selected date in YYYY-MM-DD format. */
  modelValue?: string;
  /** Array of events to display. */
  events?: CalendarEvent[];
  /** First day of the week (0 = Sunday, 1 = Monday). @defaultValue `0` */
  weekStart?: 0 | 1;
  /** Minimum selectable date in YYYY-MM-DD format. */
  minDate?: string;
  /** Maximum selectable date in YYYY-MM-DD format. */
  maxDate?: string;
  /** Additional CSS classes. */
  className?: string;
}
