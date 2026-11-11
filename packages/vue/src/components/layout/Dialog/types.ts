/** The panel's width. Emitted as `data-size`. */
export type DialogSize = 'sm' | 'md' | 'lg';

/** The panel's role. `alertdialog` is for confirmations that interrupt. */
export type DialogRole = 'dialog' | 'alertdialog';

/** The panel's surface. Emitted as `data-surface`. */
export type DialogSurface = 'overlay' | 'glass';

/** Tints the header icon. Emitted as `data-color`. */
export type DialogColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/** The parts of a Dialog that accept extra classes. `root` and `content` are the panel. */
export type DialogPart =
  | 'root'
  | 'content'
  | 'trigger'
  | 'backdrop'
  | 'positioner'
  | 'header'
  | 'icon'
  | 'title'
  | 'description'
  | 'closeTrigger'
  | 'body'
  | 'footer';

/**
 * Props for the Dialog component (design-system manifest `Dialog`, #49).
 *
 * The default slot is the body. The `trigger`, `icon`, `title`,
 * `description` and `footer` slots override the same-named props. `class`
 * and every other attribute go to the panel (`.apui-dialog`).
 */
export interface DialogProps {
  /**
   * Whether it's open. Passed (`v-model:open` or `:open`), it's controlled:
   * the dialog reports changes through `update:open` and shows what the prop
   * says. Not passed, it keeps its own state. @defaultValue `false`
   */
  open?: boolean;
  /** The panel's width: 360px, `--apui-dialog-width` (480px) or 640px. @defaultValue `'md'` */
  size?: DialogSize;
  /**
   * `alertdialog` for confirmations that interrupt: the backdrop doesn't
   * close it, and focus starts on the close button. @defaultValue `'dialog'`
   */
  role?: DialogRole;
  /** The panel's surface. Glass falls back to overlay under reduced transparency and in high contrast. @defaultValue `'overlay'` */
  surface?: DialogSurface;
  /** Tints the header icon, for confirmations. */
  color?: DialogColor;
  /** An icon name from the registry, shown in a tinted circle before the title. The `icon` slot overrides it. */
  icon?: string;
  /** The heading (an `<h2>`), and the panel's accessible name. */
  title?: string;
  /** Supporting text under the title, linked with `aria-describedby`. */
  description?: string;
  /** The actions row. Usually the `footer` slot. */
  footer?: string;
  /** Content for a trigger button that opens the dialog. Without it, open the dialog through `open`. */
  trigger?: string;
  /** Traps focus, locks scroll and hides the rest of the page from assistive technology. @defaultValue `true` */
  modal?: boolean;
  /** Teleports the dialog to the end of the body. Off renders it in place. @defaultValue `true` */
  portal?: boolean;
  /** Hides the close button in the header. Escape still closes the dialog. @defaultValue `false` */
  hideClose?: boolean;
  /** The close button's accessible name; translate it. @defaultValue `'Close'` */
  closeLabel?: string;
  /** Extra classes per part, such as `{ header: '…', body: '…' }`. */
  classes?: Partial<Record<DialogPart, string>>;
}

/** Events of the Dialog component. */
export interface DialogEmits {
  /** The dialog opened or closed itself (trigger, Escape, backdrop, close button). */
  'update:open': [open: boolean];
}
