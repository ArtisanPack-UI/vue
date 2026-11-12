/** A Stat's size: the value's type style. Emitted as `data-size`. */
export type StatSize = 'sm' | 'md' | 'lg';

/** A Stat's color: tints the icon tile and the emphasis fill. Emitted as `data-color`. */
export type StatColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/** The change's direction. Emitted as `data-trend` on the delta. */
export type StatTrend = 'up' | 'down' | 'flat';

/** The parts of a Stat that accept extra classes. */
export type StatPart =
  | 'root'
  | 'top'
  | 'label'
  | 'icon'
  | 'value'
  | 'unit'
  | 'foot'
  | 'delta'
  | 'description';

/**
 * Props for the Stat component (design-system manifest `Stat`, #61).
 *
 * The default slot replaces `value`; the `icon` slot replaces the named
 * icon. `class` and every other attribute go to the root.
 */
export interface StatProps {
  /** What the number measures. */
  label?: string;
  /** The number, already formatted. The default slot replaces it. */
  value?: string | number;
  /** The same as `value`, under the design-system kit's Vue spelling; `value` wins. */
  modelValue?: string | number;
  /** A unit after the value, smaller and muted. */
  unit?: string;
  /** A registry icon name for the tile. The `icon` slot replaces it. Decorative. */
  icon?: string;
  /** The change as text; takes precedence over `change`. */
  delta?: string;
  /** The change as a percentage, shown with one decimal; sets `trend` from its sign. */
  change?: number;
  /** The change's direction: an arrow and hidden text. */
  trend?: StatTrend;
  /** Context after the delta, such as "vs last month". */
  description?: string;
  /** The value's type style. @defaultValue `'md'` */
  size?: StatSize;
  /** Tints the icon tile and the emphasis fill. @defaultValue `'neutral'` */
  color?: StatColor;
  /** A soft fill in `color`, for the one stat that matters in a row. @defaultValue `false` */
  emphasis?: boolean;
  /** No container, for a stat inside a Card. @defaultValue `false` */
  bare?: boolean;
  /** Hidden text before an up delta; translate it. @defaultValue `'Increase'` */
  upLabel?: string;
  /** Hidden text before a down delta; translate it. @defaultValue `'Decrease'` */
  downLabel?: string;
  /** Hidden text before a flat delta; translate it. @defaultValue `'No change'` */
  flatLabel?: string;
  /** Extra classes per part. */
  classes?: Partial<Record<StatPart, string>>;
}

const TRENDS: readonly StatTrend[] = ['up', 'down', 'flat'];

/** The trend's arrow: it shows the direction, not only the color. */
export const TREND_ICONS: Record<StatTrend, string> = {
  up: 'arrow-up-right',
  down: 'arrow-down-right',
  flat: 'minus',
};

/** The delta's text: `delta`, or `change` as a percentage with one decimal. @internal */
export function statDelta(delta: string | undefined, change: number | undefined): string | null {
  if (delta !== undefined && delta !== null && delta !== '') return delta;
  return typeof change === 'number' && Number.isFinite(change)
    ? `${Math.abs(change).toFixed(1)}%`
    : null;
}

/** The trend: `trend`, or the sign of `change`. @internal */
export function statTrend(
  trend: StatTrend | undefined,
  change: number | undefined,
): StatTrend | undefined {
  if (trend !== undefined && TRENDS.includes(trend)) return trend;
  if (typeof change !== 'number' || !Number.isFinite(change)) return undefined;
  return change > 0 ? 'up' : change < 0 ? 'down' : 'flat';
}
