import type { Toaster, ToasterOptions, ToastOptions } from '@artisanpack-ui/behavior/vue';

/** The parts of a Toast that accept extra classes. */
export type ToastPart = 'root' | 'icon' | 'title' | 'description' | 'actions' | 'closeTrigger';

/**
 * Props for the Toast component (design-system manifest `Toast`, #51).
 *
 * Rendered on its own, a Toast is static: in docs, a page's inline status
 * or a test fixture. Show timed toasts with a `Toaster` and
 * `toast.create({ … })` instead. The `icon`, `title`, `description` and
 * `actions` slots override the same-named props. `class` and every other
 * attribute go to the root.
 */
export interface ToastProps {
  /** The message, linked with `aria-labelledby`. */
  title?: string;
  /** Supporting text, linked with `aria-describedby`. */
  description?: string;
  /** Tints the icon. `error` makes the toast an alert (`role="alert"`). @defaultValue `'neutral'` */
  color?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'success' | 'warning' | 'error' | 'info';
  /** `inverse` uses the inverse surface, for a toast that must stand out. @defaultValue `'default'` */
  variant?: 'default' | 'inverse';
  /** The toast's surface. Glass falls back to overlay under reduced transparency and in high contrast. @defaultValue `'overlay'` */
  surface?: 'overlay' | 'glass';
  /**
   * An icon name from the registry. Defaults to the color's status icon:
   * circle-check, triangle-alert, circle-alert or info. The `icon` slot overrides it.
   */
  icon?: string;
  /** Content under the text, such as Undo. Usually the `actions` slot. */
  actions?: string;
  /** Hides the close button. @defaultValue `false` */
  hideClose?: boolean;
  /** The close button's accessible name; translate it. @defaultValue `'Dismiss notification'` */
  closeLabel?: string;
  /** Extra classes per part, such as `{ title: '…', actions: '…' }`. */
  classes?: Partial<Record<ToastPart, string>>;
}

/** Events of the Toast component. */
export interface ToastEmits {
  /** The close button was pressed (always `false`). Hiding a standalone toast is the owner's job. */
  'open-change': [open: boolean];
}

/**
 * Props for the Toaster component: the region that shows toasts created
 * from data. Without `toaster`, it renders the default `toast` toaster.
 */
export interface ToasterProps {
  /** Where the region sits; `start` and `end` follow the text direction. @defaultValue `'bottom-end'` */
  placement?: ToasterOptions['placement'];
  /** At most this many show at once; the rest queue. @defaultValue `5` */
  max?: number;
  /** Space between toasts, in px. @defaultValue `8` */
  gap?: number;
  /** Milliseconds before a toast dismisses itself, paused on hover and focus. 0 keeps it. @defaultValue `5000` */
  duration?: number;
  /** Distance from the viewport edge. @defaultValue `'16px'` */
  offsets?: string;
  /** A toaster from `createToaster()` to render instead of the default `toast`. */
  toaster?: Toaster;
  /** The region's accessible name. @defaultValue `'Notifications'` */
  label?: string;
  /** Each toast's close button name; translate it. @defaultValue `'Dismiss notification'` */
  closeLabel?: string;
  /** Extra classes per part of each toast, plus `group` for the region. */
  classes?: Partial<Record<ToastPart | 'group' | 'actionTrigger', string>>;
}

/** A toaster: `create`, `update`, `dismiss` and `remove` toasts. */
export type ToasterInstance = Toaster;

/** One toast as data, as `toast.create()` takes it. */
export type ToastInput = ToastOptions;

/** The options `createToaster()` takes. */
export type ToasterInstanceOptions = ToasterOptions;
