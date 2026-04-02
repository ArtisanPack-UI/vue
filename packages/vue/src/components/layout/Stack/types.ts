/**
 * Props for the Stack component.
 *
 * A flexbox layout wrapper with declarative direction, gap, alignment, and wrap controls.
 */
export interface StackProps {
  /** Flex direction. @defaultValue `'vertical'` */
  direction?: 'vertical' | 'horizontal';
  /** Gap between items using Tailwind spacing scale. @defaultValue `2` */
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;
  /** Cross-axis alignment. */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  /** Main-axis justification. */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  /** When true, allows items to wrap to the next line. @defaultValue `false` */
  wrap?: boolean;
}
