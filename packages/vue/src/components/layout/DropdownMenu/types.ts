/** Which of the menu's edges lines up with the trigger's. Emitted as `data-align`. */
export type DropdownMenuAlign = 'start' | 'center' | 'end';

/** The menu's surface. Emitted as `data-surface`. */
export type DropdownMenuSurface = 'overlay' | 'glass';

/** The kind of a menu item. */
export type DropdownMenuItemType = 'item' | 'checkbox' | 'radio';

/** The parts of a DropdownMenu that accept extra classes. `root` and `content` are the panel. */
export type DropdownMenuPart =
  | 'root'
  | 'content'
  | 'trigger'
  | 'positioner'
  | 'itemGroup'
  | 'itemGroupLabel'
  | 'item'
  | 'icon'
  | 'itemText'
  | 'shortcut'
  | 'itemIndicator'
  | 'separator';

/** An action item, as data. */
export interface DropdownMenuActionEntry {
  type?: 'item';
  value: string;
  label: string;
  icon?: string;
  shortcut?: string;
  color?: 'error';
  disabled?: boolean;
}

/** A checkbox or radio item, as data. Its `checked` state stays the owner's to set. */
export interface DropdownMenuOptionEntry {
  type: 'checkbox' | 'radio';
  value: string;
  label: string;
  checked?: boolean;
  icon?: string;
  shortcut?: string;
  disabled?: boolean;
}

/** A rule between items, as data. */
export interface DropdownMenuSeparatorEntry {
  type: 'separator';
}

/** A labelled group of items, as data. */
export interface DropdownMenuGroupEntry {
  type: 'group';
  label?: string;
  items: DropdownMenuEntry[];
}

/** One entry of the `items` prop. */
export type DropdownMenuEntry =
  | DropdownMenuActionEntry
  | DropdownMenuOptionEntry
  | DropdownMenuSeparatorEntry
  | DropdownMenuGroupEntry;

/** The payload of `checked-change`. */
export interface DropdownMenuCheckedChange {
  value: string;
  checked: boolean;
}

/**
 * Props for the DropdownMenu component (design-system manifest
 * `DropdownMenu`, #50).
 *
 * The default slot takes `DropdownMenuItem`, `DropdownMenuGroup` and
 * `DropdownMenuSeparator`; `items` renders the same children from data.
 * The `label` slot overrides the `label` prop. `class` and every other
 * attribute go to the panel (`.apui-dropdown-menu`).
 */
export interface DropdownMenuProps {
  /**
   * Whether it's open. Passed (`v-model:open` or `:open`), it's controlled:
   * the menu reports changes through `update:open` and shows what the prop
   * says. Not passed, it keeps its own state. @defaultValue `false`
   */
  open?: boolean;
  /**
   * The trigger button's content. For an icon-only trigger, use the `label`
   * slot with an icon and visually hidden text:
   * `<span class="apui-sr-only">More actions</span>`.
   */
  label?: string;
  /** The items as data, rendering the same children as composition. */
  items?: DropdownMenuEntry[];
  /** The menu's edge that lines up with the trigger's; start and end follow the text direction. @defaultValue `'start'` */
  align?: DropdownMenuAlign;
  /** The menu's surface. Glass falls back to overlay under reduced transparency and in high contrast. @defaultValue `'overlay'` */
  surface?: DropdownMenuSurface;
  /** Teleports the menu to the end of the body. Off renders it in place. @defaultValue `true` */
  portal?: boolean;
  /** Extra classes per part, such as `{ trigger: '…', item: '…' }`. */
  classes?: Partial<Record<DropdownMenuPart, string>>;
}

/** Props for DropdownMenuItem. */
export interface DropdownMenuItemProps {
  /** The value `select` and `checked-change` report. */
  value: string;
  /** An icon name from the registry, before the label. The `icon` slot overrides it. */
  icon?: string;
  /** A keyboard shortcut shown at the end, in a `<kbd>`. */
  shortcut?: string;
  /** `error` marks a danger item. Put it last, after a separator. */
  color?: 'error';
  /** Disables the item: it's skipped by the arrow keys and can't be chosen. @defaultValue `false` */
  disabled?: boolean;
  /** An action item, or a checkbox or radio item. @defaultValue `'item'` */
  type?: DropdownMenuItemType;
  /** Whether a checkbox or radio item is checked. @defaultValue `false` */
  checked?: boolean;
}

/** Props for DropdownMenuGroup. */
export interface DropdownMenuGroupProps {
  /** The group's label, which labels it for assistive technology. */
  label?: string;
}
