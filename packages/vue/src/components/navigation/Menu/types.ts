import type { DaisyColor, Size } from '@artisanpack-ui/tokens';

/**
 * Represents a single menu item with its label, optional children, and configuration.
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

/**
 * Props for the Menu component.
 *
 * A vertical or horizontal menu with active state tracking,
 * nested submenus, and full keyboard navigation.
 */
export interface MenuProps {
  /** Array of menu item definitions. */
  items: MenuItem[];
  /** When true, renders items horizontally. @defaultValue `false` */
  horizontal?: boolean;
  /** DaisyUI size modifier for the menu. */
  size?: Size;
  /** DaisyUI color applied to active items. */
  color?: DaisyColor;
  /** Additional CSS classes for the menu container. */
  className?: string;
}
