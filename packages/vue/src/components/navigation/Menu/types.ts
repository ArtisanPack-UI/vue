/** The parts of a Menu that accept extra classes. */
export type MenuPart =
  | 'root'
  | 'list'
  | 'item'
  | 'icon'
  | 'itemText'
  | 'badge'
  | 'chevron'
  | 'sub'
  | 'title'
  | 'separator';

/** A link, as data. */
export interface MenuLinkData {
  type?: 'item';
  /** A stable key for the rendered item; defaults to `href`, then the position. */
  key?: string;
  label: string;
  href?: string;
  icon?: string;
  badge?: string | number;
  /** Marks the current page: `aria-current="page"`. */
  current?: boolean;
  disabled?: boolean;
}

/** A sub-menu, as data. */
export interface MenuSubData {
  type?: 'sub';
  /** A stable key for the rendered sub-menu; defaults to the position. */
  key?: string;
  label: string;
  icon?: string;
  /** A count or status at the end of the toggle. */
  badge?: string | number;
  /** Disables the toggle. */
  disabled?: boolean;
  /** Opens it initially. A sub-menu holding the current page opens anyway. */
  open?: boolean;
  items: MenuItemData[];
}

/** A section title, as data. */
export interface MenuTitleData {
  type: 'title';
  label: string;
}

/** A rule between items, as data. */
export interface MenuSeparatorData {
  type: 'separator';
}

/** One entry of the `items` prop. */
export type MenuItemData = MenuLinkData | MenuSubData | MenuTitleData | MenuSeparatorData;

/** Props for the Menu component. */
export interface MenuProps {
  /** The menu as data, rendered before the children. */
  items?: MenuItemData[];
  /** Sub-menus open and close from their item. Off shows them all. @defaultValue `true` */
  collapsible?: boolean;
  /** Names the nav landmark. */
  label?: string;
  /** Extra classes per part; `classes.root` merges with `class`. */
  classes?: Partial<Record<MenuPart, string>>;
}

/** Props for MenuItem. The default slot is its label. */
export interface MenuItemProps {
  href?: string;
  icon?: string;
  badge?: string | number;
  /** Marks the current page. */
  current?: boolean;
  /** Takes the link out of the Tab order and drops its href. */
  disabled?: boolean;
}

/** Props for MenuSub: a collapsible group of items. */
export interface MenuSubProps {
  label: string;
  icon?: string;
  /** A count or status at the end of the toggle. */
  badge?: string | number;
  /** Disables the toggle. */
  disabled?: boolean;
  /**
   * Whether it's open (`v-model:open`). Controlled only when it's a boolean;
   * `undefined` leaves the sub-menu its own state.
   */
  open?: boolean;
  /**
   * The initial state when uncontrolled. Defaults to whether it holds the
   * current page; it also opens when an item inside becomes current.
   */
  defaultOpen?: boolean;
}
