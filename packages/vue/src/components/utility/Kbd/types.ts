import type { KbdLabels } from '@artisanpack-ui/behavior';

/** Key cap sizes. Emitted as `data-size`. */
export type KbdSize = 'sm' | 'md';

/** Whose keys to show: measured after mount, or fixed. */
export type KbdPlatform = 'auto' | 'mac' | 'other';

/** The parts of a Kbd that accept extra classes. */
export type KbdPart = 'root' | 'combo' | 'key';

/**
 * Props for the Kbd component (design-system manifest `Kbd`, #65).
 *
 * Without `keys`, the default slot is one key. `class` and every other
 * attribute go to the outer `<kbd>`.
 */
export interface KbdProps {
  /** A shortcut's keys in order, such as `['mod', 'shift', 'p']`. Renders a combo. */
  keys?: string[];
  /** Key cap size. @defaultValue `'md'` */
  size?: KbdSize;
  /** Whose keys to show. @defaultValue `'auto'` */
  platform?: KbdPlatform;
  /** The hidden names of symbol keys, by name (`command`, `enter`, `up`…). Translate them. */
  labels?: KbdLabels;
  /** Extra classes per part. */
  classes?: Partial<Record<KbdPart, string>>;
}
