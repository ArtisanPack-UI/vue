/** The trigger's side the label sits on. `start` and `end` follow the reading direction. */
export type TooltipPlacement = 'top' | 'bottom' | 'start' | 'end';

/** A one-line label, or a sentence or two. Emitted as `data-size`. */
export type TooltipSize = 'md' | 'lg';

/** The parts of a Tooltip that accept extra classes. `root` and `content` are the label. */
export type TooltipPart = 'root' | 'content' | 'trigger' | 'positioner' | 'arrow' | 'kbd';

/**
 * @deprecated Use {@link TooltipPlacement}: `left` and `right` are `start` and `end`.
 */
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Props for the Tooltip component (design-system manifest `Tooltip`, #59).
 *
 * The default slot is the trigger: its one element gets the trigger part's
 * attributes and keeps its own id; text is wrapped in a focusable span. The
 * `content` slot overrides the `content` prop. `class` and every other
 * attribute go to the label (`.apui-tooltip`).
 */
export interface TooltipProps {
  /** The label. It describes the trigger (`aria-describedby`); it's never the only name of an icon button. */
  content?: string;
  /** The trigger's side the label sits on, centered. Emitted as `data-placement`. @defaultValue `'top'` */
  placement?: TooltipPlacement;
  /** Milliseconds the pointer rests on the trigger before it shows. Focus shows it at once. @defaultValue `400` */
  delay?: number;
  /** `lg` for a sentence or two, at body size. @defaultValue `'md'` */
  size?: TooltipSize;
  /** A keyboard shortcut shown after the label, as keys joined with `+` (`⌘+K`). */
  shortcut?: string;
  /**
   * Controls the label: `true` shows it, `false` hides it, whatever the
   * pointer and focus do (`v-model:open` binds it). Leave it out to let hover
   * and focus show it.
   */
  open?: boolean;
  /** Never shows the label. Emitted as `data-disabled`. @defaultValue `false` */
  disabled?: boolean;
  /** Teleports the label to the end of the body. Off renders it in place. @defaultValue `true` */
  portal?: boolean;
  /** Extra classes per part, such as `{ root: '…', kbd: '…' }`. */
  classes?: Partial<Record<TooltipPart, string>>;
}

/** Events of the Tooltip component. */
export interface TooltipEmits {
  /** The label showed or hid itself (hover, focus, blur, Escape). */
  'update:open': [open: boolean];
}
