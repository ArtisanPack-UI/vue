/**
 * Props for the Drawer component.
 *
 * A side panel overlay with focus trapping and keyboard dismissal.
 * Use `v-model:open` to control visibility.
 */
export interface DrawerProps {
  /** Whether the drawer is visible. Use with `v-model:open`. */
  open: boolean;
  /** When true, renders the drawer on the right side. @defaultValue `false` */
  end?: boolean;
  /** When true, prevents closing via Escape key or overlay click. @defaultValue `false` */
  persistent?: boolean;
  /** Accessible label for the drawer dialog. */
  ariaLabel?: string;
  /** ID of an element that labels the drawer dialog. Takes precedence over ariaLabel. */
  ariaLabelledby?: string;
}
