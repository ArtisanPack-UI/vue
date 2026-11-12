/**
 * Exports `MenuItem` as the component and, for 2.x code, as the old item
 * shape: a value and a type may share a name, so `import { MenuItem }`
 * keeps compiling where it was used as a type.
 *
 * @internal
 */
import MenuItemComponent from './MenuItem.vue';

/** A link (or button) in a Menu. */
export const MenuItem = MenuItemComponent;

/**
 * The 2.x menu item shape, as a type.
 *
 * @deprecated Use `MenuItemData` for `items` (`label`, `href`, `current`,
 * `items` for a sub-menu); `InertiaMenu` still takes this shape. As a value,
 * `MenuItem` is the component.
 */
export interface MenuItem {
  /** Unique identifier for the menu item. */
  name: string;
  /** Display label shown in the menu item. */
  label: string;
  /** Optional URL for the menu item link. */
  href?: string;
  /** Whether the menu item is currently active. @defaultValue `false` */
  active?: boolean;
  /** Whether the menu item is disabled. @defaultValue `false` */
  disabled?: boolean;
  /** Optional nested child items for submenu support. */
  children?: MenuItem[];
}
