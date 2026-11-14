import type { DatePickerMode, DatePickerValue } from '@artisanpack-ui/behavior/vue';

export type { DatePickerMode, DatePickerValue };

/** Control height. Emitted as `data-size`. */
export type DatePickerSize = 'sm' | 'md' | 'lg';

/** The parts of a DatePicker that accept extra classes. */
export type DatePickerPart =
  | 'root'
  | 'label'
  | 'required'
  | 'box'
  | 'trigger'
  | 'control'
  | 'hint'
  | 'timeZone'
  | 'error'
  | 'positioner'
  | 'content'
  | 'view'
  | 'viewControl'
  | 'prevTrigger'
  | 'rangeText'
  | 'nextTrigger'
  | 'table'
  | 'tableHead'
  | 'tableRow'
  | 'tableHeader'
  | 'tableBody'
  | 'tableCell'
  | 'tableCellTrigger'
  | 'time'
  | 'timeLabel'
  | 'timeList'
  | 'timeOption'
  | 'footer';

/**
 * Props for the DatePicker component (design-system manifest `DatePicker`,
 * #55): a text field with a calendar popover for a date or a range, and with
 * `time` a date and time (DateTime). Values are ISO 8601 strings.
 *
 * `class` goes to the root (`.apui-date-picker`); every other attribute goes
 * to the (first) text input. The `label`, `hint` and `footer` slots override
 * the props of the same name.
 */
export interface DatePickerProps {
  /**
   * The ISO value: `2026-11-12`, `2026-11-12T11:00` with `time`, or two dates
   * with `mode="range"`. Bind it with `v-model`. Passed, it's controlled;
   * not passed, the picker keeps its own.
   */
  modelValue?: DatePickerValue;
  /** One date, or a range of two. Emitted as `data-mode`. @defaultValue `'single'` */
  mode?: DatePickerMode;
  /** Date and time: adds the time list. Single mode only. Emitted as `data-time`. @defaultValue `false` */
  time?: boolean;
  /** Minutes between the times in the time list. @defaultValue `30` */
  step?: number;
  /** The IANA time zone, shown under the field in time mode. */
  timeZone?: string;
  /** BCP 47 locale for month and weekday names (Intl). @defaultValue `'en-US'` */
  locale?: string;
  /** The earliest date that can be chosen, ISO. */
  min?: string;
  /** The latest date that can be chosen, ISO. */
  max?: string;
  /** Dates that can't be chosen, ISO. */
  disabledDates?: string[];
  /** First day of the week, 0 (Sunday) to 6. Follows the locale unless set. */
  weekStartsOn?: number;
  /** The text pattern, with `yyyy`, `MM` and `dd`. Follows the locale unless set. */
  format?: string;
  /** Control height. @defaultValue `'md'` */
  size?: DatePickerSize;
  /** The visible label. The `label` slot overrides it. */
  label?: string;
  /** Help text under the field. Show the expected format here. */
  hint?: string;
  /** Validation message. Marks the field invalid. */
  error?: string;
  /** Marks the field invalid without a message. @defaultValue `false` */
  invalid?: boolean;
  /** Disables the field and the calendar. @defaultValue `false` */
  disabled?: boolean;
  /** Read-only: focusable, the calendar doesn't open. @defaultValue `false` */
  readonly?: boolean;
  /** Marks the field required. @defaultValue `false` */
  required?: boolean;
  /** Placeholder text. Defaults to the pattern, `MM/DD/YYYY`. */
  placeholder?: string;
  /** Submits the ISO value in a hidden input (`name[]` twice in range mode). */
  name?: string;
  /** Whether the calendar is open. Bind it with `v-model:open`. @defaultValue `false` */
  open?: boolean;
  /** Teleports the popover to the end of the body. Off renders it in place. @defaultValue `true` */
  portal?: boolean;
  /** A row under the calendar. The `footer` slot overrides it. */
  footer?: string;
  /** The calendar button's accessible name; translate it. @defaultValue `'Choose date'` (`'Choose date and time'` with `time`) */
  triggerLabel?: string;
  /** The previous-month button's name. @defaultValue `'Previous month'` */
  previousLabel?: string;
  /** The next-month button's name. @defaultValue `'Next month'` */
  nextLabel?: string;
  /** The popover's name. @defaultValue `'Calendar'` */
  calendarLabel?: string;
  /** The time list's name and heading. @defaultValue `'Time'` */
  timeLabel?: string;
  /** The end input's name in range mode. @defaultValue `'End date'` */
  endLabel?: string;
  /** The time-zone line; `{zone}` stands for the zone. @defaultValue `'Time zone: {zone}'` */
  timeZoneLabel?: string;
  /** Extra classes per part. */
  classes?: Partial<Record<DatePickerPart, string>>;
}

/** Events of the DatePicker component. */
export interface DatePickerEmits {
  /** A day, a time or typed text changed the value (`v-model`). */
  'update:modelValue': [value: DatePickerValue];
  /** The popover opened or closed itself (`v-model:open`). */
  'update:open': [open: boolean];
}
