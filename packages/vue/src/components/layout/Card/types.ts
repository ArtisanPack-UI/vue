/**
 * Props for the Card component.
 *
 * A content container with optional header, footer, figure, and menu slots.
 * Renders as an `<a>` element when the `link` prop is provided.
 */
export interface CardProps {
  /** Card title rendered as an `<h2>` in the card body. */
  title?: string;
  /** Subtitle text rendered below the title. */
  subtitle?: string;
  /** Position of the figure element relative to the card body. @defaultValue `'top'` */
  figurePosition?: 'top' | 'bottom' | 'left' | 'right';
  /** When true, removes the card shadow. @defaultValue `false` */
  noShadow?: boolean;
  /** When true, adds a border to the card. @defaultValue `false` */
  bordered?: boolean;
  /** When true, reduces padding in the card body. @defaultValue `false` */
  compact?: boolean;
  /** When true, applies glass morphism styling. @defaultValue `false` */
  glass?: boolean;
  /** When provided, renders the card as an `<a>` element with this URL. */
  link?: string;
  /** When true and `link` is set, opens the link in a new tab. @defaultValue `false` */
  external?: boolean;
}
