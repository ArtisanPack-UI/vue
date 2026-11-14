/** The edge the drawer slides in from. `end` and `start` follow the reading direction. */
export type DrawerSide = 'end' | 'start' | 'bottom';

/** The panel's width at the start or end side. Emitted as `data-size`. */
export type DrawerSize = 'sm' | 'md' | 'lg';

/** The panel's surface. Emitted as `data-surface`. */
export type DrawerSurface = 'overlay' | 'glass';

/** The parts of a Drawer that accept extra classes. `root` and `content` are the panel. */
export type DrawerPart =
  | 'root'
  | 'content'
  | 'trigger'
  | 'backdrop'
  | 'positioner'
  | 'handle'
  | 'header'
  | 'title'
  | 'description'
  | 'closeTrigger'
  | 'body'
  | 'footer';

/**
 * Props for the Drawer component (design-system manifest `Drawer`, #58).
 *
 * The default slot is the body. The `trigger`, `title`, `description` and
 * `footer` slots override the same-named props. `class` and every other
 * attribute go to the panel (`.apui-drawer`).
 */
export interface DrawerProps {
  /**
   * Whether it's open. Passed (`v-model:open` or `:open`), it's controlled:
   * the drawer reports changes through `update:open` and shows what the prop
   * says. Not passed, it keeps its own state. @defaultValue `false`
   */
  open?: boolean;
  /**
   * The edge it slides in from: `end` is on the right in LTR and on the left
   * in RTL; `bottom` is a full-width sheet with a handle. @defaultValue `'end'`
   */
  side?: DrawerSide;
  /** The panel's width at the start or end side: 320px, `--apui-drawer-width` (400px) or 560px. @defaultValue `'md'` */
  size?: DrawerSize;
  /** The panel's surface. Glass falls back to overlay under reduced transparency and in high contrast. @defaultValue `'overlay'` */
  surface?: DrawerSurface;
  /** The heading (an `<h2>`), and the panel's accessible name. */
  title?: string;
  /** Supporting text under the title, linked with `aria-describedby`. */
  description?: string;
  /** The actions row. Usually the `footer` slot. */
  footer?: string;
  /** Content for a trigger button that opens the drawer. Without it, open the drawer through `open`. */
  trigger?: string;
  /** Traps focus, locks scroll and hides the rest of the page from assistive technology. @defaultValue `true` */
  modal?: boolean;
  /** Teleports the drawer to the end of the body. Off renders it in place. @defaultValue `true` */
  portal?: boolean;
  /** Hides the close button in the header. Escape still closes the drawer. @defaultValue `false` */
  hideClose?: boolean;
  /** The close button's accessible name; translate it. @defaultValue `'Close'` */
  closeLabel?: string;
  /** Extra classes per part, such as `{ header: '…', body: '…' }`. */
  classes?: Partial<Record<DrawerPart, string>>;
}

/** Events of the Drawer component. */
export interface DrawerEmits {
  /** The drawer opened or closed itself (trigger, Escape, backdrop, close button). */
  'update:open': [open: boolean];
}
