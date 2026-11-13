/** Default is one container, separated gives each item its own, flush drops the container. Emitted as `data-variant`. */
export type AccordionVariant = 'default' | 'separated' | 'flush';

/** The parts of an Accordion that accept extra classes. */
export type AccordionPart = 'root' | 'item' | 'title' | 'trigger' | 'chevron' | 'content';

/** An item as data, for the `items` prop: renders the same markup as an `AccordionItem`. */
export interface AccordionItemData {
  /** The item's value, unique in the accordion. */
  value: string;
  /** The trigger's text. */
  title: string;
  /** The panel's text. */
  content?: string;
  /** Disables the item; the arrow keys skip it. */
  disabled?: boolean;
}

/** Props for the Accordion component. */
export interface AccordionProps {
  /** The open items' values (`v-model`). */
  modelValue?: string[];
  /** The items as data, rendered before the `AccordionItem` children. */
  items?: AccordionItemData[];
  /** Several items open at once. Emitted as `data-multiple`. @defaultValue `false` */
  multiple?: boolean;
  /** The open item of a single accordion can close. Emitted as `data-collapsible`. @defaultValue `true` */
  collapsible?: boolean;
  /** @defaultValue `'default'` */
  variant?: AccordionVariant;
  /** Each item's heading level, 2 to 6. @defaultValue `3` */
  headingLevel?: number;
  /** Disables every item. @defaultValue `false` */
  disabled?: boolean;
  /** Extra classes per part; `classes.root` merges with `class`. */
  classes?: Partial<Record<AccordionPart, string>>;
}

/** Props for AccordionItem: one section. The default slot is its panel; `title` is a prop or slot. */
export interface AccordionItemProps {
  /** The item's value, unique in the accordion. */
  value: string;
  /** The trigger's text. The `title` slot overrides it. */
  title?: string;
  /** Disables the item. */
  disabled?: boolean;
}
