/** A Timeline's markers. Emitted as `data-variant`. */
export type TimelineVariant = 'icon' | 'dot';

/** A marker's color. Emitted as `data-color` on the marker. */
export type TimelineColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/** The parts of a Timeline that accept extra classes, its items' included. */
export type TimelinePart = 'root' | 'item' | 'marker' | 'head' | 'time' | 'body' | 'card';

/** One event in `items`, and a TimelineItem's props. */
export interface TimelineItemData {
  /** What happened: the head. The default slot replaces it. */
  title?: string;
  /** When, as shown ("2h ago"). */
  time?: string;
  /** When, machine-readable (ISO 8601), for the `<time>` element. */
  datetime?: string;
  /** A registry icon name for the marker. */
  icon?: string;
  /** Tints the marker. */
  color?: TimelineColor;
  /** Muted detail under the head. */
  description?: string;
  /** A sunken box under the head, such as a comment. The `card` slot replaces it. */
  card?: string;
}

/** Props for a TimelineItem. `class` and every other attribute go to the `<li>`. */
export type TimelineItemProps = TimelineItemData;

/**
 * Props for the Timeline component (design-system manifest `Timeline`, #61).
 *
 * The default slot holds TimelineItem children, rendered after `items`.
 * `class` and every other attribute go to the root.
 */
export interface TimelineProps {
  /** The events as data, rendering the same children as composition. */
  items?: TimelineItemData[];
  /** Icon markers, or small dots for a compact history. @defaultValue `'icon'` */
  variant?: TimelineVariant;
  /** The list's accessible name. */
  label?: string;
  /** Extra classes per part, its items' included. */
  classes?: Partial<Record<TimelinePart, string>>;
}
