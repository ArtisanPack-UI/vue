import type { ChartNotation, ChartSeriesInput, ChartType } from '@artisanpack-ui/behavior';

export type { ChartNotation, ChartType };

/** One named series; `data` lines up with `labels`. */
export type ChartSeries = ChartSeriesInput;

/** The parts of a Chart that accept extra classes. */
export type ChartPart =
  | 'root'
  | 'header'
  | 'title'
  | 'description'
  | 'actions'
  | 'legend'
  | 'swatch'
  | 'body'
  | 'plot'
  | 'grid'
  | 'axis'
  | 'mark'
  | 'line'
  | 'area'
  | 'point'
  | 'crosshair'
  | 'dot'
  | 'value'
  | 'tooltip'
  | 'table';

/**
 * Props for the Chart component (design-system manifest `Chart`, #63).
 * `class` and every other attribute go to the root.
 */
export interface ChartProps {
  /** Bars (the first series), lines, lines with a fill, or a donut. @defaultValue `'bar'` */
  type?: ChartType;
  /** `[{ name, data }]`, or a plain array of values for one series named by `title`. */
  series: readonly ChartSeries[] | readonly (number | null)[];
  /** The categories: x-axis labels, or the donut's slices. */
  labels?: readonly string[];
  /** The heading; it names the plot and the table. */
  title: string;
  /** Supporting text under the title. */
  description?: string;
  /** Header controls as text; the `actions` slot replaces it. */
  actions?: string;
  /** Shows the data table under the plot (the spec's `showTable`). @defaultValue `false` */
  tabular?: boolean;
  /** Printed before every value, such as `$`. */
  prefix?: string;
  /** Printed after every value, such as `%`. */
  suffix?: string;
  /** `standard` (12,500) or `compact` ($12.5k). @defaultValue `'standard'` */
  notation?: ChartNotation;
  /** The plot's viewBox width. @defaultValue `520` */
  width?: number;
  /** The plot's viewBox height. @defaultValue `220` */
  height?: number;
  /** Extra classes per part. */
  classes?: Partial<Record<ChartPart, string>>;
}
