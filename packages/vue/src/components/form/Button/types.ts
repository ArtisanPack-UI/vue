/** Visual treatment of a Button. Emitted as `data-variant`. */
export type ButtonVariant = 'solid' | 'soft' | 'outline' | 'ghost' | 'link';

/** Semantic color of a Button. Emitted as `data-color`. */
export type ButtonColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/** Control height of a Button. Emitted as `data-size`. */
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** The parts of a Button that accept extra classes. */
export type ButtonPart = 'root' | 'icon' | 'iconEnd' | 'label' | 'spinner';

/**
 * Props for the Button component (design-system manifest `Button`, #44).
 *
 * Renders a native `<button>`, or an `<a>` with the same styles when `href`
 * is set. The default slot is the label; the `icon` and `iconEnd` slots
 * override `leadingIcon` and `trailingIcon`. `class` goes to the root, as do
 * all other attributes and listeners.
 */
export interface ButtonProps {
  /** Visual treatment. @defaultValue `'solid'` */
  variant?: ButtonVariant;
  /** Semantic color. @defaultValue `'primary'` */
  color?: ButtonColor;
  /** Control height. @defaultValue `'md'` */
  size?: ButtonSize;
  /** Renders only the icon. Requires an `aria-label`. @defaultValue `false` */
  iconOnly?: boolean;
  /** Shows the spinner and sets `aria-busy`; clicks are ignored while loading. @defaultValue `false` */
  loading?: boolean;
  /** Disables the button. With `href`, renders an anchor without `href` and with `aria-disabled`. @defaultValue `false` */
  disabled?: boolean;
  /** Renders an anchor with the same styles. */
  href?: string;
  /** Icon name before the label, resolved through the icon registry. The `icon` slot overrides it. */
  leadingIcon?: string;
  /** Icon name after the label, resolved through the icon registry. The `iconEnd` slot overrides it. */
  trailingIcon?: string;
  /** The native button type. Ignored when `href` renders an anchor. @defaultValue `'button'` */
  type?: 'button' | 'submit' | 'reset';
  /** Extra classes per part, such as `{ root: '…', label: '…' }`. */
  classes?: Partial<Record<ButtonPart, string>>;
}
