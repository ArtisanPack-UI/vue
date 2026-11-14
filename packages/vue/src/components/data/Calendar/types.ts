/**
 * Types for the design-system Calendar (#64). The event, view, color and
 * label types come from `@artisanpack-ui/behavior`, whose `calendarModel`
 * lays out every stack's days.
 */
import type {
  CalendarColor,
  CalendarEvent,
  CalendarLabels,
  CalendarView,
} from '@artisanpack-ui/behavior';

export type { CalendarColor, CalendarEvent, CalendarLabels, CalendarView };

/** The parts a Calendar accepts extra classes for. */
export type CalendarPart =
  | 'root'
  | 'toolbar'
  | 'todayTrigger'
  | 'previousTrigger'
  | 'nextTrigger'
  | 'title'
  | 'viewTabs'
  | 'createTrigger'
  | 'body'
  | 'grid'
  | 'row'
  | 'weekday'
  | 'cell'
  | 'date'
  | 'event'
  | 'eventTime'
  | 'eventTitle'
  | 'more'
  | 'legend'
  | 'legendItem';

export interface CalendarProps {
  /** month, week, day or agenda. `v-model:view`; uncontrolled when unset. @defaultValue `'month'` */
  view?: CalendarView;
  /** The date the view shows, YYYY-MM-DD. `v-model:date`; today when unset. */
  date?: string;
  /** The date marked as today. Defaults to the current date in `timeZone`. */
  today?: string;
  /** The events: `{ id, start, end, title, color, allDay, category, description, href }`. */
  events?: CalendarEvent[];
  /** The first day of the week, 0 (Sunday) to 6. Follows the locale unless set. */
  weekStartsOn?: number;
  /** BCP 47 locale for names and the first day of the week. @defaultValue `'en-US'` */
  locale?: string;
  /** IANA zone for today and for times with Z or an offset. @defaultValue `'UTC'` */
  timeZone?: string;
  /** Events a month cell shows before "+N more". @defaultValue `2` */
  maxEvents?: number;
  /** Shows a New event button that emits `create`. @defaultValue `false` */
  creatable?: boolean;
  /** Clicking an event opens a Dialog with its details. @defaultValue `true` */
  details?: boolean;
  /** Built-in text; keys you leave out keep their defaults. Translate them. */
  labels?: Partial<CalendarLabels>;
  /** Extra classes per part. */
  classes?: Partial<Record<CalendarPart, string>>;
  /** @deprecated 2.x: use `v-model:date`. */
  modelValue?: string;
  /** @deprecated 2.x: use `date`. The shown month (1–12, clamped) with `year`. */
  month?: number;
  /** @deprecated 2.x: use `date`. */
  year?: number;
  /** @deprecated 2.x: use `weekStartsOn`. */
  weekStart?: 0 | 1;
  /** @deprecated 2.x: no longer limited. Ignored. */
  minDate?: string;
  /** @deprecated 2.x: no longer limited. Ignored. */
  maxDate?: string;
  /** @deprecated 2.x: use `class`. */
  className?: string;
}
