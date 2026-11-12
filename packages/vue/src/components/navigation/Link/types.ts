/** The tone of a Link. Emitted as `data-tone`. */
export type LinkTone = 'primary' | 'muted';

/** The parts of a Link that accept extra classes. */
export type LinkPart = 'root' | 'icon' | 'iconEnd';

/**
 * Props for the Link component (design-system manifest `Link`, #56).
 *
 * The default slot is the text. The `icon` and `iconEnd` slots override the
 * icon names. `class` and every other attribute go to the root.
 */
export interface LinkProps {
  /**
   * The destination. Only relative, http, https, mailto, tel and sms URLs are
   * used; without one, a `<button type="button">` renders with the same styles.
   */
  href?: string;
  /** `primary` for running text and calls to action, `muted` for secondary links. @defaultValue `'primary'` */
  tone?: LinkTone;
  /** A link on its own line: medium weight, underlined only on hover. @defaultValue `false` */
  standalone?: boolean;
  /** Opens in a new tab, adds the external-link icon and announces it. @defaultValue `false` */
  external?: boolean;
  /** The visually hidden text an external link announces; translate it. @defaultValue `'(opens in a new tab)'` */
  externalLabel?: string;
  /** Icon name before the text. The `icon` slot overrides it. */
  leadingIcon?: string;
  /** Icon name after the text; it replaces the external-link icon. Arrows mirror in RTL. */
  trailingIcon?: string;
  /** Extra classes per part, such as `{ icon: '…' }`. */
  classes?: Partial<Record<LinkPart, string>>;
}
