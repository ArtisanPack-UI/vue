/**
 * Props for the deprecated Dropdown component.
 *
 * @deprecated Use `DropdownMenu` (#50). Dropdown renders a DropdownMenu:
 * `end` is its `align="end"` and the `trigger` slot its `label` slot.
 * DropdownMenu's own props pass through.
 */
export interface DropdownProps {
  /** The trigger button's text. The `trigger` slot overrides it. @defaultValue `'Options'` */
  label?: string;
  /** Lines the menu's end edge up with the trigger's. DropdownMenu's `align="end"`. @defaultValue `false` */
  end?: boolean;
  /** Ignored: DropdownMenu has no prop to open above the trigger. @defaultValue `false` */
  top?: boolean;
  /** Ignored: the menu opens on click and from the keyboard only. @defaultValue `false` */
  hover?: boolean;
  /** Whether the dropdown is open. Use with `v-model:open`. */
  open?: boolean;
}

/**
 * Props for the deprecated DropdownItem component.
 *
 * @deprecated Use `DropdownMenuItem` (#50), which needs a `value`.
 */
export interface DropdownItemProps {
  /** When true, disables the item. @defaultValue `false` */
  disabled?: boolean;
  /** The value the menu's `select` event reports. Defaults to a generated id. */
  value?: string;
}
