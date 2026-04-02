/** Number of grid columns (1-12). */
export type ColCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/** Gap size values matching the Tailwind spacing scale. */
export type GapSize = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;

/**
 * Props for the Grid component.
 *
 * A CSS grid layout wrapper with responsive column counts and gap controls.
 */
export interface GridProps {
  /** Base number of columns. */
  cols?: ColCount;
  /** Number of columns at the `sm` breakpoint. */
  colsSm?: ColCount;
  /** Number of columns at the `md` breakpoint. */
  colsMd?: ColCount;
  /** Number of columns at the `lg` breakpoint. */
  colsLg?: ColCount;
  /** Number of columns at the `xl` breakpoint. */
  colsXl?: ColCount;
  /** Uniform gap between grid items. @defaultValue `4` */
  gap?: GapSize;
  /** Horizontal gap between grid items. Overrides `gap` for the x-axis. */
  gapX?: GapSize;
  /** Vertical gap between grid items. Overrides `gap` for the y-axis. */
  gapY?: GapSize;
}
