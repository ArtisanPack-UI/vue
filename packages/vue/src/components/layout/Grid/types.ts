/** A step of the space scale. Emitted as `data-gap`. */
export type GridGap = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16';

/** How items sit in their row (align-items). Emitted as `data-align`. */
export type GridAlign = 'start' | 'center' | 'end' | 'stretch';

/** How items sit in their column (justify-items). Emitted as `data-justify`. */
export type GridJustify = 'start' | 'center' | 'end' | 'stretch';

/** Props for the Grid component. Every child is an item. */
export interface GridProps {
  /** The number of columns, 1 to 12; the most there are with `minItemWidth`. @defaultValue `1` */
  columns?: number;
  /** The narrowest a column may get, any CSS length; the grid drops columns rather than narrowing past it. */
  minItemWidth?: string;
  /** The space between rows and columns. Numbers are accepted. @defaultValue `'4'` */
  gap?: GridGap | number;
  /** @defaultValue `'stretch'` */
  align?: GridAlign;
  /** @defaultValue `'stretch'` */
  justify?: GridJustify;
}
