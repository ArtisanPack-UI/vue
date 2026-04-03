import type { DaisyColor } from '@artisanpack-ui/tokens';

/**
 * A single item in the timeline.
 */
export interface TimelineItem {
  /** Unique identifier for the item. */
  id: string | number;
  /** Title text for the timeline event. */
  title: string;
  /** Description or body text. */
  description?: string;
  /** Timestamp or date label. */
  time?: string;
  /** Color of the timeline dot. */
  color?: DaisyColor;
  /** Whether this item represents the start of the timeline. */
  start?: boolean;
  /** Whether this item represents the end of the timeline. */
  end?: boolean;
}

/**
 * Props for the Timeline component.
 *
 * A vertical or horizontal timeline for displaying events or activity.
 */
export interface TimelineProps {
  /** Array of timeline items. */
  items: TimelineItem[];
  /** When true, renders a vertical timeline. @defaultValue `true` */
  vertical?: boolean;
  /** When true, alternates items left and right. @defaultValue `false` */
  snap?: boolean;
  /** When true, renders a compact timeline. @defaultValue `false` */
  compact?: boolean;
  /** Additional CSS classes. */
  className?: string;
}
