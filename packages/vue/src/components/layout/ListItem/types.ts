/** A List's frame: plain, bordered (a framed surface) or divided (rules only). */
export type ListVariant = 'plain' | 'bordered' | 'divided';

/** The parts of a ListItem that accept extra classes. */
export type ListItemPart = 'root' | 'leading' | 'title' | 'description' | 'trailing';

/** Props for the List component. `class` and every other attribute go to the ul/ol. */
export interface ListProps {
  /** The frame. Emitted as `data-variant`. @defaultValue `'plain'` */
  variant?: ListVariant;
  /** Renders an ol instead of a ul. @defaultValue `false` */
  ordered?: boolean;
}

/**
 * Props for the ListItem component (design-system manifest `ListItem`, #58).
 *
 * Slots: `leading`, `title` (the default slot also fills it), `description`
 * and `trailing` override the props. `class` and every other attribute go to
 * the row, so a `@click` on an interactive row runs when its button is pressed.
 */
export interface ListItemProps {
  /** The main text. */
  title?: string;
  /** Secondary text under the title. */
  description?: string;
  /** Makes the title a link covering the row (relative, http, https, mailto, tel, sms). */
  href?: string;
  /** Without `href`, makes the title a button covering the row. @defaultValue `false` */
  interactive?: boolean;
  /** The current or chosen row: `data-selected`, and `aria-current` on its control. @defaultValue `false` */
  selected?: boolean;
  /** Dims the row and disables its control. @defaultValue `false` */
  disabled?: boolean;
  /** Icon name in the leading part. The `leading` slot overrides it. */
  leadingIcon?: string;
  /** Short text at the end. The `trailing` slot overrides it. */
  trailing?: string;
  /** Extra classes per part, such as `{ title: '…' }`. */
  classes?: Partial<Record<ListItemPart, string>>;
}
