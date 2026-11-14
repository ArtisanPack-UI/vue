/** The parts of a Breadcrumbs that accept extra classes. */
export type BreadcrumbsPart =
  | 'root'
  | 'list'
  | 'item'
  | 'link'
  | 'separator'
  | 'current'
  | 'overflow';

/** One level of the trail. */
export interface BreadcrumbItem {
  /** The level's name. */
  label: string;
  /** Where it links. Ignored on the last item, the current page. */
  href?: string;
  /** An icon name from the registry, before the label. */
  icon?: string;
  /** Keeps the label for screen readers only, next to the icon (a home icon). */
  hideLabel?: boolean;
}

/** Props for a BreadcrumbsItem. Other attributes (`@click`) go to its link. */
export interface BreadcrumbsItemProps {
  /** The level's name. The default slot overrides it. */
  label?: string;
  /** Where it links. Ignored on the last level. */
  href?: string;
  /** An icon name from the registry, before the label. */
  icon?: string;
  /** Keeps the label for screen readers only. */
  hideLabel?: boolean;
}

/**
 * Props for the Breadcrumbs component (design-system manifest `Breadcrumbs`, #56).
 *
 * The scoped `link` slot (`{ item, attrs }`) renders a router link instead of
 * the anchor; bind `attrs` on it. `class` and every other attribute go to the root.
 */
export interface BreadcrumbsProps {
  /**
   * The trail, from the section down to the current page. The last level is
   * the current page. BreadcrumbsItem children follow it.
   */
  items?: BreadcrumbItem[];
  /**
   * How many entries show before the middle collapses: the first item, an
   * overflow button and the last `maxItems - 2`. `0` never collapses. @defaultValue `4`
   */
  maxItems?: number;
  /** The nav landmark's accessible name; translate it. @defaultValue `'Breadcrumb'` */
  label?: string;
  /** The overflow button's accessible name, with `{count}`; translate it. @defaultValue `'Show {count} more levels'` */
  overflowLabel?: string;
  /** Extra classes per part, such as `{ link: '…', current: '…' }`. */
  classes?: Partial<Record<BreadcrumbsPart, string>>;
}
