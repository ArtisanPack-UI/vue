import type { StatColor, StatTrend } from '../Stat/types';

/** The metric a KpiCard shows: Stat's props. */
export interface KpiCardStat {
  /** What the metric measures. */
  label?: string;
  /** The number, already formatted. */
  value?: string | number;
  /** A unit after the value. */
  unit?: string;
  /** A registry icon name for the tile. */
  icon?: string;
  /** Tints the icon tile and the target bar. @defaultValue `'neutral'` */
  color?: StatColor;
  /** The change as text; takes precedence over `change`. */
  delta?: string;
  /** The change as a percentage; sets `trend` from its sign. */
  change?: number;
  /** The change's direction. */
  trend?: StatTrend;
  /** Context after the delta. */
  description?: string;
  /** Hidden text before an up delta. @defaultValue `'Increase'` */
  upLabel?: string;
  /** Hidden text before a down delta. @defaultValue `'Decrease'` */
  downLabel?: string;
  /** Hidden text before a flat delta. @defaultValue `'No change'` */
  flatLabel?: string;
}

/** Progress toward a goal. */
export interface KpiCardTarget {
  /** The progress, from 0 to `max`. */
  value: number;
  /** The goal's value. @defaultValue `100` */
  max?: number;
  /** Names the goal and the bar, such as "Goal $25,000". */
  label?: string;
}

/** The parts of a KpiCard that accept extra classes. */
export type KpiCardPart =
  | 'root'
  | 'top'
  | 'label'
  | 'period'
  | 'icon'
  | 'row'
  | 'summary'
  | 'value'
  | 'unit'
  | 'foot'
  | 'delta'
  | 'description'
  | 'sparkline'
  | 'target'
  | 'targetText';

/**
 * Props for the KpiCard component (design-system manifest `KpiCard`, #61).
 *
 * The `period` slot overrides the same-named prop. `class` and every other
 * attribute go to the root.
 */
export interface KpiCardProps {
  /** The metric, with Stat's props. */
  stat?: KpiCardStat;
  /** The recent values, drawn as an area Sparkline beside the value. */
  sparkline?: readonly number[];
  /** The sparkline's accessible label; translate it. @defaultValue `'Trend from {first} to {latest}'` */
  sparklineLabel?: string;
  /** Progress toward a goal. Show it only when one exists. */
  target?: KpiCardTarget;
  /**
   * The end of the target row; `{percent}`, `{value}` and `{max}` are filled
   * in. Translate it. @defaultValue `'{percent}% of goal'`
   */
  targetLabel?: string;
  /** A period control. Usually the `period` slot, holding a Select. */
  period?: string;
  /** Extra classes per part. */
  classes?: Partial<Record<KpiCardPart, string>>;
}

/** The target's clamped percentage and end text. @internal */
export function kpiTarget(target: KpiCardTarget | undefined, template: string) {
  if (!target || typeof target.value !== 'number' || !Number.isFinite(target.value)) return null;
  const max =
    typeof target.max === 'number' && Number.isFinite(target.max) && target.max > 0
      ? target.max
      : 100;
  const percent = Math.round(Math.max(0, Math.min(1, target.value / max)) * 100);
  const text = template
    .replace(/\{percent\}/g, String(percent))
    .replace(/\{value\}/g, String(target.value))
    .replace(/\{max\}/g, String(max));
  return { value: target.value, max, percent, label: target.label, text };
}
