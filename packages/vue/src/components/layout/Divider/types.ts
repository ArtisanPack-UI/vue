/** A rule across the inline axis, or a vertical one. Emitted as `data-orientation`. */
export type DividerOrientation = 'horizontal' | 'vertical';

/** Where a label sits along the rule. Emitted as `data-align`. */
export type DividerAlign = 'start' | 'center' | 'end';

/** Subtle uses the muted border, strong the default border. Emitted as `data-strength`. */
export type DividerStrength = 'subtle' | 'strong';

/** The parts of a Divider that accept extra classes. */
export type DividerPart = 'root' | 'label';

/** Props for the Divider component. The default slot is the label. */
export interface DividerProps {
  /** @defaultValue `'horizontal'` */
  orientation?: DividerOrientation;
  /** Text in the middle of the rule. The default slot overrides it. */
  label?: string;
  /** @defaultValue `'center'` */
  align?: DividerAlign;
  /** @defaultValue `'subtle'` */
  strength?: DividerStrength;
  /** Hides the divider from assistive technology. @defaultValue `false` */
  decorative?: boolean;
  /** Extra classes per part; `classes.root` merges with `class`. */
  classes?: Partial<Record<DividerPart, string>>;
}
