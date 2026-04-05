/**
 * Props for the Dropdown component.
 *
 * A trigger + popover menu with keyboard navigation and ARIA semantics.
 */
export interface DropdownProps {
  /** Text label for the default trigger button. @defaultValue `'Options'` */
  label?: string;
  /** When true, aligns the dropdown menu to the right. @defaultValue `false` */
  end?: boolean;
  /** When true, opens the dropdown above the trigger. @defaultValue `false` */
  top?: boolean;
  /** When true, opens on hover instead of click. @defaultValue `false` */
  hover?: boolean;
  /** Whether the dropdown is open. Use with `v-model:open`. */
  open?: boolean;
}

/**
 * Props for the DropdownItem component.
 *
 * A single item within a Dropdown menu.
 */
export interface DropdownItemProps {
  /** When true, disables the item. @defaultValue `false` */
  disabled?: boolean;
}
