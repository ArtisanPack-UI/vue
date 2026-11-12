/**
 * @module data
 *
 * Data components for the ArtisanPack UI Vue component library.
 * Provides data-driven components for tables, charts, and calendars.
 *
 * @example
 * ```vue
 * import { Table, Chart, Calendar } from '@artisanpack-ui/vue';
 * ```
 */

export { default as Table } from './Table/Table.vue';
export type {
  TableProps,
  TableColumn,
  TableKey,
  TablePart,
  TableSort,
  SortState,
} from './Table/types';

export { default as Chart } from './Chart/Chart.vue';
export type {
  ChartProps,
  ChartSeries,
  ChartType,
  ChartPart,
  ChartNotation,
} from './Chart/types';

export { default as Calendar } from './Calendar/Calendar.vue';
export type {
  CalendarProps,
  CalendarEvent,
  CalendarColor,
  CalendarLabels,
  CalendarPart,
  CalendarView,
} from './Calendar/types';
