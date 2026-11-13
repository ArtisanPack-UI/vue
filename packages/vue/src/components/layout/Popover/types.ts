/** The trigger's side the panel sits on. `start` and `end` follow the reading direction. */
export type PopoverPlacement = 'top' | 'bottom' | 'start' | 'end';

/** The parts of a Popover that accept extra classes. `root` and `content` are the panel. */
export type PopoverPart =
  | 'root'
  | 'content'
  | 'trigger'
  | 'positioner'
  | 'arrow'
  | 'title'
  | 'body'
  | 'actions';

/**
 * Props for the Popover component (design-system manifest `Popover`, #58).
 *
 * The default slot is the body. The `title` and `actions` slots override the
 * same-named props. The `trigger` slot is the trigger itself when it holds
 * one element; text renders an outline Button. `class` and every other
 * attribute go to the panel (`.apui-popover`).
 */
export interface PopoverProps {
  /**
   * Whether it's open. Passed (`v-model:open` or `:open`), it's controlled:
   * the popover reports changes through `update:open` and shows what the
   * prop says. Not passed, it keeps its own state. @defaultValue `false`
   */
  open?: boolean;
  /**
   * The trigger's side the panel sits on, lined up with the trigger's start
   * edge. Emitted as `data-placement`; the side it settled on, after
   * flipping, is `data-side`. @defaultValue `'bottom'`
   */
  placement?: PopoverPlacement;
  /** Draws the arrow that points at the trigger. @defaultValue `true` */
  arrow?: boolean;
  /** The heading (an `<h3>`), and the panel's accessible name. Without one, give the popover an `aria-label`. */
  title?: string;
  /** A row of actions at the end of the panel. Usually the `actions` slot. */
  actions?: string;
  /** Text for an outline Button that opens it. The `trigger` slot overrides it. */
  trigger?: string;
  /** Teleports the panel to the end of the body. Off renders it in place. @defaultValue `true` */
  portal?: boolean;
  /** Extra classes per part, such as `{ title: '…', body: '…' }`. */
  classes?: Partial<Record<PopoverPart, string>>;
}

/** Events of the Popover component. */
export interface PopoverEmits {
  /** The popover opened or closed itself (trigger, Escape, an outside click). */
  'update:open': [open: boolean];
}
