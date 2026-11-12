/** Section hides the region while closed; read-more clamps it behind a fade. Emitted as `data-variant`. */
export type CollapseVariant = 'section' | 'read-more';

/** The parts of a Collapse that accept extra classes. */
export type CollapsePart = 'root' | 'trigger' | 'icon' | 'content' | 'fade';

/** Props for the Collapse component. The default slot is the region; the `trigger` slot overrides `label`. */
export interface CollapseProps {
  /** Whether the region shows (`v-model:open`). @defaultValue `false` */
  open?: boolean;
  /** @defaultValue `'section'` */
  variant?: CollapseVariant;
  /** The trigger's text. Read-more defaults it to `'Read more'`. */
  label?: string;
  /** The trigger's text while open. Read-more defaults it to `'Show less'`. */
  openLabel?: string;
  /** The trigger can't be focused or toggled. @defaultValue `false` */
  disabled?: boolean;
  /** Extra classes per part; `classes.root` merges with `class`. */
  classes?: Partial<Record<CollapsePart, string>>;
}
