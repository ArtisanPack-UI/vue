/** A column, or a row that runs in the text direction. Emitted as `data-orientation`. */
export type StackOrientation = 'vertical' | 'horizontal';

/** A step of the space scale. Emitted as `data-gap`. */
export type StackGap = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16';

/** align-items. Emitted as `data-align`. */
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';

/** justify-content. Emitted as `data-justify`. */
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

/** Props for the Stack component. Every child is an item. */
export interface StackProps {
  /** @defaultValue `'vertical'` */
  orientation?: StackOrientation;
  /** @deprecated Use `orientation`. */
  direction?: StackOrientation;
  /** The space between items. Numbers are accepted. @defaultValue `'2'` */
  gap?: StackGap | number;
  /** @defaultValue `'stretch'` */
  align?: StackAlign;
  /** @defaultValue `'start'` */
  justify?: StackJustify;
  /** Lets a row wrap onto more lines. Emitted as `data-wrap`. @defaultValue `false` */
  wrap?: boolean;
}
