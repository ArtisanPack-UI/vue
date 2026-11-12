/** The indicator a Loading shows. */
export type LoadingVariant = 'spinner' | 'dots';

/** The parts of a Loading that accept extra classes. */
export type LoadingPart = 'root' | 'indicator' | 'label';

/**
 * Props for the Loading component (design-system manifest `Loading`, #60).
 *
 * A status region with a spinner or three dots. The default slot shows
 * visible text beside the indicator; without it, `label` is rendered
 * visually hidden. `class` and every other attribute go to the root.
 */
export interface LoadingProps {
  /** A spinning ring or three pulsing dots. @defaultValue `'spinner'` */
  variant?: LoadingVariant;
  /** The indicator's size. @defaultValue `'md'` */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Tints the indicator. @defaultValue `'primary'` */
  color?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'success' | 'warning' | 'error' | 'info';
  /** What's loading, for screen readers, when there's no visible text; translate it. @defaultValue `'Loading'` */
  label?: string;
  /** Covers the nearest positioned ancestor. Set `aria-busy` on that region. @defaultValue `false` */
  overlay?: boolean;
  /** Milliseconds to wait before showing, so fast loads don't flash. @defaultValue `300` */
  delay?: number;
  /** Extra classes per part, such as `{ indicator: '…', label: '…' }`. */
  classes?: Partial<Record<LoadingPart, string>>;
}
