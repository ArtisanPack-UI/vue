/** The surface of a Card. Emitted as `data-surface`. */
export type CardSurface = 'default' | 'raised' | 'sunken' | 'glass';

/** The parts of a Card that accept extra classes. */
export type CardPart =
  | 'root'
  | 'media'
  | 'header'
  | 'title'
  | 'description'
  | 'actions'
  | 'body'
  | 'footer';

/**
 * Props for the Card component (design-system manifest `Card`, #48).
 *
 * The default slot is the body. The `media`, `title`, `description`,
 * `actions` and `footer` slots override the same-named props. `class` and
 * every other attribute go to the root.
 */
export interface CardProps {
  /** The surface. Glass falls back to raised under reduced transparency and in high contrast. @defaultValue `'default'` */
  surface?: CardSurface;
  /** Adds the hover edge. Set by `href`. @defaultValue `false` */
  interactive?: boolean;
  /** Makes the title a link whose hit area covers the whole card. */
  href?: string;
  /** The heading in the header (an `<h3>`). */
  title?: string;
  /** Supporting text under the title. */
  description?: string;
  /** Controls at the end of the header. Usually the `actions` slot. */
  actions?: string;
  /** The footer row, separated by an edge. */
  footer?: string;
  /** An image URL shown edge to edge above the header. The `media` slot overrides it. */
  media?: string;
  /** Alternative text for `media`. Empty marks it decorative. @defaultValue `''` */
  mediaAlt?: string;
  /** Extra classes per part, such as `{ header: '…', body: '…' }`. */
  classes?: Partial<Record<CardPart, string>>;
}
