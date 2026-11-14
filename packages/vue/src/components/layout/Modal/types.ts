/**
 * Props for the deprecated Modal component.
 *
 * @deprecated Use `Dialog` (#49). Modal renders a Dialog: `subtitle` is its
 * `description`, `glass` its glass `surface` and the `actions` slot its
 * `footer`. Dialog's own props pass through.
 */
export interface ModalProps {
  /** Whether the modal is visible. Use with `v-model:open`. */
  open: boolean;
  /** The dialog's heading. */
  title?: string;
  /** Supporting text under the title. Dialog's `description`. */
  subtitle?: string;
  /**
   * Renders an `alertdialog` without a close button that ignores Escape and
   * backdrop closes: close it by changing `open`. @defaultValue `false`
   */
  persistent?: boolean;
  /** The glass surface. Dialog's `surface="glass"`. @defaultValue `false` */
  glass?: boolean;
  /** Ignored: Dialog has no bottom sheet. Use `Drawer` with `side="bottom"`. @defaultValue `false` */
  bottom?: boolean;
  /** Names the dialog when there's no title. @defaultValue `'Dialog'` */
  ariaLabel?: string;
}
