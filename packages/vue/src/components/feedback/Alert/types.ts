/** The status colors an Alert takes. */
export type AlertColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/** The parts of an Alert that accept extra classes. */
export type AlertPart = 'root' | 'icon' | 'title' | 'description' | 'actions' | 'closeTrigger';

/**
 * Props for the Alert component (design-system manifest `Alert`, #60).
 *
 * An inline message about the state of a page or section. The `icon`,
 * `title`, `description` and `actions` slots override the same-named props;
 * the default slot fills the description. `class` and every other attribute
 * go to the root.
 */
export interface AlertProps {
  /** The headline: what happened. */
  title?: string;
  /** Supporting text: what to do next. The default slot fills it too. */
  description?: string;
  /** The status. `error` makes the alert `role="alert"`; every other color is `role="status"`. @defaultValue `'neutral'` */
  color?: AlertColor;
  /** `soft` tints the background, `outline` suits dense forms, `solid` is for blocking failures. @defaultValue `'soft'` */
  variant?: 'soft' | 'outline' | 'solid';
  /** The alert's surface. @defaultValue `'default'` */
  surface?: 'default' | 'glass';
  /** An icon name from the registry. Defaults to the color's status icon. The `icon` slot overrides it. */
  icon?: string;
  /** Content under the text, usually the `actions` slot. */
  actions?: string;
  /** Adds a close button; pressing it hides the alert and emits `open-change` (`false`). @defaultValue `false` */
  dismissible?: boolean;
  /** The close button's accessible name; translate it. @defaultValue `'Dismiss'` */
  closeLabel?: string;
  /** Extra classes per part, such as `{ title: '…', actions: '…' }`. */
  classes?: Partial<Record<AlertPart, string>>;
}

/** Events of the Alert component. */
export interface AlertEmits {
  /** The close button was pressed (always `false`); the alert has hidden itself. */
  'open-change': [open: boolean];
}
