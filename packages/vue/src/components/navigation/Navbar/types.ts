/** A full-width bar or a rounded island. Emitted as `data-layout`. */
export type NavbarLayout = 'bar' | 'island';

/** The bar's surface. Emitted as `data-surface`. */
export type NavbarSurface = 'default' | 'glass';

/** The parts of a Navbar that accept extra classes. */
export type NavbarPart = 'root' | 'brand' | 'links' | 'link' | 'search' | 'actions';

/** A primary link, as data. */
export interface NavbarLinkData {
  label: string;
  href: string;
  /** Marks the current page: `aria-current="page"`. */
  current?: boolean;
}

/** Props for the Navbar component. */
export interface NavbarProps {
  /** @defaultValue `'bar'` */
  layout?: NavbarLayout;
  /** Glass falls back to an opaque surface under reduced transparency and in high contrast. @defaultValue `'default'` */
  surface?: NavbarSurface;
  /** Sticks to the top of the scrolling container. @defaultValue `true` */
  sticky?: boolean;
  /** The brand at the start. The `brand` slot overrides it. */
  brand?: string;
  /** The primary links as data, rendered before the default slot's NavbarItems. */
  links?: NavbarLinkData[];
  /** A search field's text content. The `search` slot overrides it. */
  search?: string;
  /** The controls at the end. The `actions` slot overrides it. */
  actions?: string;
  /** Names the links' nav landmark. @defaultValue `'Main'` */
  label?: string;
  /** Extra classes per part; `classes.root` merges with `class`. */
  classes?: Partial<Record<NavbarPart, string>>;
}

/** Props for NavbarItem: one primary link. The default slot is its text. */
export interface NavbarItemProps {
  href?: string;
  /** Marks the current page. */
  current?: boolean;
}
