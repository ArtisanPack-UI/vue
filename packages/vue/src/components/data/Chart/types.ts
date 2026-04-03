import type { DaisyColor } from '@artisanpack-ui/tokens';

/**
 * A data point for pie, donut, and similar single-series chart types.
 */
export interface ChartDataPoint {
  /** Label for the data point. */
  label: string;
  /** Numeric value. */
  value: number;
  /** Color for this data point (DaisyUI name or CSS color). */
  color?: DaisyColor | string;
}

/**
 * A data series for bar, line, area, and similar multi-series chart types.
 */
export interface ChartSeries {
  /** Series name shown in legend and tooltips. */
  name: string;
  /** Array of numeric values. */
  data: number[];
  /** Color for this series (DaisyUI name or CSS color). */
  color?: DaisyColor | string;
}

/**
 * Supported chart types.
 */
export type ChartType =
  | 'bar'
  | 'line'
  | 'area'
  | 'donut'
  | 'pie'
  | 'radialBar'
  | 'radar'
  | 'polarArea';

/**
 * Props for the Chart component.
 *
 * A chart component powered by ApexCharts with support for 8 chart types,
 * DaisyUI color integration, and full ApexCharts options customization.
 */
export interface ChartProps {
  /** Chart type. @defaultValue `'bar'` */
  type?: ChartType;
  /** Labels for x-axis categories or pie/donut slice labels. */
  labels?: string[];
  /** Multi-series data for bar, line, and area charts. */
  series?: ChartSeries[];
  /** Simple data points for pie, donut, and similar chart types. */
  data?: ChartDataPoint[];
  /** Chart height in pixels or CSS value. @defaultValue `350` */
  height?: number | string;
  /** Chart width in pixels or CSS value. */
  width?: number | string;
  /** Default DaisyUI color. */
  color?: DaisyColor;
  /** ApexCharts options for advanced customization (deep-merged with defaults). */
  options?: Record<string, unknown>;
  /** When true, shows a legend. @defaultValue `true` */
  showLegend?: boolean;
  /** When true, enables animations. @defaultValue `true` */
  animated?: boolean;
  /** Chart title. */
  title?: string;
  /** Additional CSS classes. */
  className?: string;
}
