import type { DaisyColor } from '@artisanpack-ui/tokens';

/**
 * Props for the Sparkline component.
 *
 * A compact inline chart rendered as SVG with line, area, or bar variants.
 * Uses Catmull-Rom spline interpolation for smooth curves.
 */
export interface SparklineProps {
  /** Array of numeric data points. */
  data: number[];
  /** Sparkline type. @defaultValue `'line'` */
  type?: 'line' | 'area' | 'bar';
  /** Height in pixels. @defaultValue `40` */
  height?: number;
  /** Width in pixels. Defaults to `data.length * 8`. */
  width?: number;
  /** Color (DaisyUI name or CSS color). @defaultValue `'primary'` */
  color?: DaisyColor | string;
  /** Stroke width for line/area types. @defaultValue `2` */
  strokeWidth?: number;
  /** When true, uses Catmull-Rom curves for smooth paths. @defaultValue `true` */
  curve?: boolean;
  /** Fill opacity for area type (0-1). @defaultValue `0.3` */
  fillOpacity?: number;
  /** When true, shows a tooltip on hover. @defaultValue `true` */
  showTooltip?: boolean;
  /** Additional CSS classes. */
  className?: string;
}
